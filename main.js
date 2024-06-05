import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() {
    const canvas = document.querySelector('#c');
    // const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
      });

    const fov = 60;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    

    // Custom Shader Material for the Skybox
    const skyboxGeo = new THREE.SphereGeometry(500, 32, 32);  // Large sphere for the skybox
    const skyboxMat = new THREE.ShaderMaterial({
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      uniforms: {
          time: { value: 0 }
      },
      side: THREE.BackSide
    });
    const skybox = new THREE.Mesh(skyboxGeo, skyboxMat);
    scene.add(skybox);


    // Skybox
    // const loader = new THREE.TextureLoader();
    // const texture = loader.load(
    // './images/rural4k.png',
    // () => {
    //   texture.mapping = THREE.EquirectangularReflectionMapping;
    //   texture.colorSpace = THREE.SRGBColorSpace;
    //   scene.background = texture;
    // });

    // Road Texture
    const planeSize = 42;
    const roadTextureLoader = new THREE.TextureLoader();
    // const roadTexture = roadTextureLoader.load('./images/road.png');
    const roadTexture = roadTextureLoader.load('./images/grass4.jpg');
    // const roadTexture = roadTextureLoader.load('./images/lava.jpg');
    // const roadTexture = roadTextureLoader.load('./images/earth.jpg');

    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    roadTexture.repeat.set(repeats, repeats);
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: roadTexture,
        side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = Math.PI * -0.5;
    scene.add(plane);

    // Various Lights
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);


    // Cube with Texture
    const cubeTextureLoader = new THREE.TextureLoader();
    const cubeTexture = cubeTextureLoader.load('./images/lava.jpg');
    cubeTexture.colorSpace = THREE.SRGBColorSpace;
    const geometryBox = new THREE.BoxGeometry(1, 1, 1);
    const materialBox = new THREE.MeshBasicMaterial({ map: cubeTexture });
    const cube = new THREE.Mesh(geometryBox, materialBox);
    cube.position.set(-5, 2, -5);
    scene.add(cube);

    // Sphere
    const geometrySphere = new THREE.SphereGeometry(0.5, 16, 16);
    const materialSphere = new THREE.MeshBasicMaterial({ color: 0x78ff44 });
    const sphere = new THREE.Mesh(geometrySphere, materialSphere);
    sphere.position.set(0, 0.5, -5);
    scene.add(sphere);

    // Cylinder
    const geometryCylinder = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const materialCylinder = new THREE.MeshPhongMaterial({ color: 0x3498db });
    const cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
    cylinder.position.set(5, 1, -5);
    scene.add(cylinder);


    ////////////////// FUNCTIONS FOR CREATING DIFFERENT SCENE OBJECTS (START) //////////////////////
    function createCar(x, z, color) {
      const carGroup = new THREE.Group();
  
      // Car Body
      const bodyGeometry = new THREE.BoxGeometry(3, 1, 1.5);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(x, 0.75, z);
      carGroup.add(body);
  
      // Car Cabin
      const cabinGeometry = new THREE.BoxGeometry(1.5, 0.75, 1);
      const cabinMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, flatShading: true });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.set(x + 0.5, 1.25, z);  // Offset to the front
      carGroup.add(cabin);
  
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
      const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
      const wheelPositions = [
          [-1.2, 0.4, -0.75], [1.2, 0.4, -0.75], [-1.2, 0.4, 0.75], [1.2, 0.4, 0.75]
      ];
      wheelPositions.forEach(pos => {
          const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(x + pos[0], pos[1], z + pos[2]);
          carGroup.add(wheel);
      });
  
      // Headlights
      const headlightGeometry = new THREE.SphereGeometry(0.2, 12, 6);
      const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
      const headlights = [
          new THREE.Mesh(headlightGeometry, headlightMaterial),
          new THREE.Mesh(headlightGeometry, headlightMaterial)
      ];
      headlights[0].position.set(x + 1.5, 0.5, z + 0.55);
      headlights[1].position.set(x + 1.5, 0.5, z - 0.55);
      carGroup.add(headlights[0]);
      carGroup.add(headlights[1]);
  
      // Tail Lights
      const taillightMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
      const taillights = [
          new THREE.Mesh(headlightGeometry, taillightMaterial),
          new THREE.Mesh(headlightGeometry, taillightMaterial)
      ];
      taillights[0].position.set(x - 1.5, 0.5, z + 0.55);
      taillights[1].position.set(x - 1.5, 0.5, z - 0.55);
      carGroup.add(taillights[0]);
      carGroup.add(taillights[1]);
  
      // Add the entire car group to the scene
      scene.add(carGroup);
    }
      
    // Traffic Lights
    function createTrafficLight(x, z, rotationY) {
      const poleGeometry = new THREE.BoxGeometry(0.1, 4, 0.1);
      const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(x, 2, z);
      pole.rotation.y = rotationY;
      scene.add(pole);

      const lightsGeometry = new THREE.BoxGeometry(0.4, 1, 0.2);
      const lightsMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const lights = new THREE.Mesh(lightsGeometry, lightsMaterial);
      lights.position.set(x, 4, z);
      lights.rotation.y = rotationY;
      scene.add(lights);

      ['red', 'yellow', 'green'].forEach((color, idx) => {
        const lightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const lightMaterial = new THREE.MeshBasicMaterial({ color: color === 'red' ? 0xff0000 : color === 'yellow' ? 0xffff00 : 0x00ff00 });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(x, 4, z + 0.11);
        light.position.x += (idx - 1) * 0.15;
        scene.add(light);
      });
    }

    // Trees
    function createTree(x, y, z) {
      const sceneGroup = new THREE.Group(); // Group to hold parts of the tree for easy manipulation

      // Trunk
      const trunkHeight = Math.random() * 2 + 5; // Randomize height
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, trunkHeight, 32);
      const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color for the trunk
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(0, trunkHeight / 2, 0); // Position the trunk
      sceneGroup.add(trunk);

      // Foliage
      const foliageLevels = 5; // Number of foliage layers
      const initialFoliageHeight = trunkHeight; // Foliage starts right at the top of the trunk
      for (let i = 0; i < foliageLevels; i++) {
        const levelHeight = initialFoliageHeight + i * 1.5; // Calculate height for each foliage layer
        const foliageRadius = 2 - i * 0.5; // Decrease radius for higher layers
        const foliageGeometry = new THREE.ConeGeometry(foliageRadius, 1.5, 16);
        const foliageMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 }); // Green color for foliage
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(0, levelHeight + 1.5 / 2, 0); // Center the foliage's height on its layer
        sceneGroup.add(foliage);
      }

      // Position and add the whole tree group to the scene
      sceneGroup.position.set(x, y, z);
      scene.add(sceneGroup);
    }
    ////////////////// FUNCTIONS FOR CREATING DIFFERENT SCENE OBJECTS (END) //////////////////////



    // Roads
    const roadWidth = 6; // Assume each road has a width of 6 units
    const roadLength = 42;
    const roadMargin = 5; // Safe margin from the center of the road

    const roadGeometry = new THREE.PlaneGeometry(roadLength, roadWidth);
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

    // Horizontal road
    const roadHorizontal = new THREE.Mesh(roadGeometry, roadMaterial);
    roadHorizontal.rotation.x = -Math.PI / 2;
    roadHorizontal.position.set(0, 0.1, 0); // Centered at origin
    scene.add(roadHorizontal);

    // Vertical road
    const roadVertical = new THREE.Mesh(roadGeometry, roadMaterial);
    roadVertical.rotation.x = -Math.PI / 2;
    roadVertical.rotation.z = Math.PI / 2;
    roadVertical.position.set(0, 0.1, 0); // Centered at origin
    scene.add(roadVertical);

    // Define tree placement strategy
    const treeSpacing = 12; // Distance between trees
    const offsetFromRoad = roadWidth / 2 + roadMargin; // Calculate offset from road center

    // Place trees along the roads with adequate spacing and offsets
    for (let i = -20; i <= 20; i += treeSpacing) {
        createTree(i, 0.1, -(offsetFromRoad)); // Left side of the horizontal road
        createTree(i, 0.1, offsetFromRoad);    // Right side of the horizontal road
    }
    for (let i = -20; i <= 20; i += treeSpacing) {
        createTree(-(offsetFromRoad), 0.1, i); // Bottom side of the vertical road
        createTree(offsetFromRoad, 0.1, i);    // Top side of the vertical road
    }

    // Positioning traffic lights at each corner of the intersection
    createTrafficLight(3, -3, Math.PI / 2);
    createTrafficLight(-3, 3, -Math.PI / 2);
    createTrafficLight(3, 3, Math.PI);
    createTrafficLight(-3, -3, 0);

    // Creating cars at specific positions
    createCar(-10, 0, 0xFF0000);  // Red car
    createCar(10, 0, 0x0000FF);    // Blue car
  
    function createCelestialBody(size, vertexShader, fragmentShader, color, initialPosition) {
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.ShaderMaterial({
          vertexShader: document.getElementById(vertexShader).textContent,
          fragmentShader: document.getElementById(fragmentShader).textContent,
          uniforms: {
            cameraPosition: { value: camera.position },
            sunColor: { value: new THREE.Color(color) }, // Ensure you pass the correct color uniform based on the body
            moonColor: { value: new THREE.Color(color) }
          }
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(initialPosition);
      scene.add(mesh);
      return mesh;
    }
    
    const sun = createCelestialBody(5, 'sunVertexShader', 'sunFragmentShader', 'yellow', new THREE.Vector3(0, -50, 0));
    const moon = createCelestialBody(3, 'moonVertexShader', 'moonFragmentShader', 'lightgray', new THREE.Vector3(0, -50, 0));
    

    // Load textured 3D model
    const mtlLoader = new MTLLoader();
    mtlLoader.load('./models/bus.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('./models/bus.obj', (root) => {
            scene.add(root);
            root.position.set(0, 0, 5);
        });
    });

    // Animation
    let mixer;
    const clock = new THREE.Clock();

    function animateSkybox() {
      requestAnimationFrame(animateSkybox);
  
      const elapsedTime = clock.getElapsedTime();
      const cycleTime = elapsedTime * 0.1; // Slow down time for a more realistic day/night cycle
  
      // Update the time uniform for the sky shader
      skyboxMat.uniforms.time.value = cycleTime;
  
      // Sun and Moon positions
      const sunHeight = Math.sin(cycleTime);
      const moonHeight = Math.sin(cycleTime + Math.PI); // Offset by PI to be opposite to the sun
  
      sun.position.set(50 * Math.cos(cycleTime), 30 * sunHeight, 50 * Math.sin(cycleTime));
      moon.position.set(50 * Math.cos(cycleTime + Math.PI), 30 * moonHeight, 50 * Math.sin(cycleTime + Math.PI));
  
      // Only show the sun and the moon above the horizon
      sun.visible = sunHeight > -0.1;
      moon.visible = moonHeight > -0.1;
  
      renderer.render(scene, camera);
      controls.update();
    }
  

    animateSkybox();
    


    // Standard animation function
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
    }
    animate();


    // Animate rotation of the cube
    mixer = new THREE.AnimationMixer(cube);
    const rotationKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2], [
        0, 0, 0, 1,
        0.707, 0.707, 0, 0,
        0, 0, 0, 1
    ]);
    const clip = new THREE.AnimationClip('rotate', 3, [rotationKF]);
    const action = mixer.clipAction(clip);
    action.play();
    animate();

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    }

    // camera controls
    class MinMaxGUIHelper {
        constructor(obj, minProp, maxProp, minDif) {
          this.obj = obj;
          this.minProp = minProp;
          this.maxProp = maxProp;
          this.minDif = minDif;
        }
        get min() {
          return this.obj[this.minProp];
        }
        set min(v) {
          this.obj[this.minProp] = v;
          this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
        }
        get max() {
          return this.obj[this.maxProp];
        }
        set max(v) {
          this.obj[this.maxProp] = v;
          this.min = this.min;  // this will call the min setter
        }
    }

    function setupCameraGUI(camera, gui) {
      const updateCamera = () => {
          camera.updateProjectionMatrix();
      };
  
      // Field of View Control
      gui.add(camera, 'fov', 1, 180).name('Field of View').onChange(updateCamera);
  
      // Camera Near and Far Plane Controls
      const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
      gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('Near Plane').onChange(updateCamera);
      gui.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('Far Plane').onChange(updateCamera);
  
      // Camera Position Controls
      gui.add(camera.position, 'x', -100, 100).name('Position X').onChange(updateCamera);
      gui.add(camera.position, 'y', -100, 100).name('Position Y').onChange(updateCamera);
      gui.add(camera.position, 'z', -100, 100).name('Position Z').onChange(updateCamera);
  
      // Camera Rotation Controls (Euler angles in degrees)
      const rotationFolder = gui.addFolder('Rotation');
      rotationFolder.add(camera.rotation, 'x', -Math.PI, Math.PI).name('Rotate X').onChange(updateCamera);
      rotationFolder.add(camera.rotation, 'y', -Math.PI, Math.PI).name('Rotate Y').onChange(updateCamera);
      rotationFolder.add(camera.rotation, 'z', -Math.PI, Math.PI).name('Rotate Z').onChange(updateCamera);
      rotationFolder.open();
    }
       
    const gui = new GUI();
    setupCameraGUI(camera, gui);

    function render() {
      resizeRendererToDisplaySize(renderer);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

main();
