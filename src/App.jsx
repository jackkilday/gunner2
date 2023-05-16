import { useEffect } from 'react';

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import SceneInit from './lib/SceneInit';

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
    
    const cannonDebugger = new CannonDebugger(test.scene, physicsWorld, {});

    let p = {
      body: createBoxBody(1, 3, 1),
      mesh: createBoxMesh(1, 3, 1),
    }

    const test2 = createBoxBody(1, 3, 1)

    function createBoxBody(boxSizex, boxSizey, boxSizez){
      const boxBody = new CANNON.Body({
        mass: 5,
        shape: new CANNON.Box(new CANNON.Vec3(boxSizex / 2, boxSizey / 2, boxSizez / 2)),
      });
    }

    function createBoxMesh(boxSizex, boxSizey, boxSizez){
      const boxGeometry = new THREE.BoxGeometry(boxSizex, boxSizey, boxSizez)
      const boxMaterial = new THREE.MeshNormalMaterial();
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
      test.scene.add(boxMesh); 
      return(boxMesh)
    }

    const animate = () => {
      cannonDebugger.update();
      
      window.requestAnimationFrame(animate);
      frame()
    }; 

    function frame(){
      //keys()
      physicsWorld.fixedStep();
      gravity()
      load()
    }
    

    function load(){
      p.mesh.position.copy(p.body.position);
      p.mesh.quaternion.copy(p.body.quaternion);
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
