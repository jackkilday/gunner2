import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class SceneInit {
  constructor(canvasId) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    // NOTE: Camera params;
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    // NOTE: Additional components.
    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    // NOTE: Lighting is basically required.
    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 50;
    this.camera.position.y = 8;

    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    this.ambientLight = new THREE.AmbientLight("white", 0.5);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight("white", 1);
    this.directionalLight.position.set(0, 32, 64);
    this.directionalLight.castShadow = true; // Enable shadow casting
    this.scene.add(this.directionalLight);

    // Add a spotlight to create shadows
    const spotLight = new THREE.SpotLight("white", 0.5);
    spotLight.position.set(0, 50, 100);
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    // Set shadow properties for the directional light and spotlight
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 500;
    this.directionalLight.shadow.camera.left = -200;
    this.directionalLight.shadow.camera.right = 200;
    this.directionalLight.shadow.camera.top = 200;
    this.directionalLight.shadow.camera.bottom = -200;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 500;

    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
