import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import SceneInit from './lib/SceneInit';

// I just changed this.

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    const axesHelper = new THREE.AxesHelper(8);
    test.scene.add(axesHelper);

    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(groundBody);

    const radius = 1;
    const sphereBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Sphere(radius),
    });
    sphereBody.position.set(0, 1, 0);
    physicsWorld.addBody(sphereBody);

    //const cannonDebugger = new CannonDebugger(test.scene, physicsWorld, {});

    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshNormalMaterial();
    const sphereMesh = new THREE.Mesh(geometry, material);
    test.scene.add(sphereMesh);

    const playerShape = new CANNON.Sphere(1.2);
    const playerBody = new CANNON.Body({ mass: 1, shape: playerShape});
    physicsWorld.addBody(playerBody);
    playerBody.position.set(3, 1, 0);

    const boxBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    });
    boxBody.position.set(-2, 1, 0);
    physicsWorld.addBody(boxBody);

    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    test.scene.add(boxMesh);

    const groundGeometry = new THREE.BoxGeometry(1000, 2, 1000);
    const groundMaterial = new THREE.MeshNormalMaterial();
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    test.scene.add(groundMesh);
    groundMesh.position.y -= 1

    let key = {
      w: false,
      s: false,
      a: false,
      d: false,
      _: false
    };

    let enemy = []

    let bullet = []

    let isPlayerTouchingGround = false;

    function createEnemyMesh(){
      const enemyGeometry = new THREE.SphereGeometry(1.1);
      const enemyMaterial = new THREE.MeshNormalMaterial();
      const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
      test.scene.add(enemyMesh);
      return(enemyMesh)
    }

    function createEnemyBody(x, y, z){
      const enemyBody = new CANNON.Body({
        mass: 5,
        shape: new CANNON.Sphere(1.1),
      });
      enemyBody.position.set(x, y, z);
      physicsWorld.addBody(enemyBody);
      return(enemyBody)
    }

    function createEnemy(x, y, z){
      const enemy2 = {
        mesh: createEnemyMesh(),
        body: createEnemyBody(x, y, z)
      }
      enemy.push(enemy2)
    }

    function createBullet(x, y, z){
      
    }

    const controls = new PointerLockControls(test.camera, document.body);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'w') {
        key.w = true;
      }
      if (event.key === 's') {
        key.s = true;
      }
      if (event.key === 'a') {
        key.a = true;
      }
      if (event.key === 'd') {
        key.d = true;
      }
      if (event.key === ' ') {
        key._ = true;
      }
    });

    document.addEventListener('keyup', function (event) {
      if (event.key === 'w') {
        key.w = false;
      }
      if (event.key === 's') {
        key.s = false;
      }
      if (event.key === 'a') {
        key.a = false;
      }
      if (event.key === 'd') {
        key.d = false;
      }
      if (event.key === ' ') {
        key._ = false;
      }
    });

    document.addEventListener('click', () => {
      controls.lock();
    });

    document.addEventListener('mousemove', (event) => {
      if (controls.isLocked) {
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        controls.moveRight(-movementX * 0.002);
        controls.moveForward(-movementY * 0.002);
      }
    });

    playerBody.addEventListener("collide", function (event) {
      const { body } = event;
      isPlayerTouchingGround = true;
    });

    const spawnD = 100

    for(let i = 0; i < 10; i++){
      createEnemy(Math.random() * spawnD - spawnD / 2, 10, Math.random() * spawnD - spawnD / 2)
    }
    
    

    const animate = () => {
      frame();
      window.requestAnimationFrame(animate);
    };

    function frame() {
      load();
      keys();
      debug();
      enemyF()
    }

    function enemyF(){
      for(let i = 0; i < enemy.length; i++){
        const dx = playerBody.position.x - enemy[i].body.position.x;
        const dz = playerBody.position.z - enemy[i].body.position.z;

        const magnitude = Math.sqrt(dx * dx + dz * dz);
        
        if (!(Math.abs(dx) + Math.abs(dz) <= 20)){
          enemy[i].body.velocity.x = dx / magnitude / 2 * 25
          enemy[i].body.velocity.z = dz / magnitude / 2 * 25
        }else{
          enemy[i].body.velocity.x = enemy[i].body.velocity.x / 2
          enemy[i].body.velocity.z = enemy[i].body.velocity.z / 2
        }
      }
    }

    function debug() {
      playerBody.velocity.x = playerBody.velocity.x / 1.1
      playerBody.velocity.z = playerBody.velocity.z / 1.1
    }

    function keys() {
      let move = {
        xv: 0,
        yv: 0,
        zv: 0,
      };

      if (key.w) {
        move.zv -= 1;
      }
      if (key.a) {
        move.xv -= 1;
      }
      if (key.s) {
        move.zv += 1;
      }
      if (key.d) {
        move.xv += 1;
      }
      if (key._ && isPlayerTouchingGround) {
        playerBody.velocity.y += 10;
        isPlayerTouchingGround = false; // Prevent multiple jumps while in the air
      }
    

      const position = Object.assign({}, test.camera.position);

      test.camera.translateX(move.xv);
      test.camera.translateY(move.yv);
      test.camera.translateZ(move.zv);
      playerBody.velocity.x += test.camera.position.x - position.x;
      playerBody.velocity.z += test.camera.position.z - position.z;
      test.camera.translateX(-move.xv);
      test.camera.translateY(-move.yv);
      test.camera.translateZ(-move.zv);
  }

    function load() {
      physicsWorld.step(1 / 60)
      //cannonDebugger.update()
      boxMesh.position.copy(boxBody.position)
      boxMesh.quaternion.copy(boxBody.quaternion)
      sphereMesh.position.copy(sphereBody.position)
      sphereMesh.quaternion.copy(sphereBody.quaternion)
      playerBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0)
      test.camera.position.copy(playerBody.position)
      for(let i = 0; i < enemy.length; i++){
        enemy[i].mesh.position.copy(enemy[i].body.position)
        enemy[i].mesh.quaternion.copy(enemy[i].body.quaternion)
      }
    }

    

    animate();
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
