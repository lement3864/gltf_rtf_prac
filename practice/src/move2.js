import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const Move2 = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });
    

    const camera = new THREE.PerspectiveCamera(100, 1);
    camera.position.set(0, 4, -1); // Adjusted camera position
    camera.lookAt(new THREE.Vector3(0, 1, 0)); // Adjusted lookAt position

    scene.background = new THREE.Color('grey');
    const light = new THREE.DirectionalLight('white', 2);
    scene.add(light);

    

    const loader = new GLTFLoader();
    loader.load('/images/animals/scene.gltf', function (gltf) {
      gltf.scene.scale.set(0.025, 0.025, 0.025);
      console.log(gltf)
      const models = gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0]; 
      

      scene.add(models);

      const animationClip = gltf.animations[0];

      const mixer = new THREE.AnimationMixer(models);

      const action = mixer.clipAction(animationClip);

      let rotationSpeed = 0.1;
      let isLeftKeyPressed = false;
      let isRightKeyPressed = false;
      let maxRotationAngle = Math.PI / 3.5; // 최대 회전 각도 

      function handleKeyDown(event) {
        if (event.key === 'ArrowLeft') {
          isLeftKeyPressed = true;
        } else if (event.key === 'ArrowRight') {
          isRightKeyPressed = true;
        }
      }

      function handleKeyUp(event) {
        if (event.key === 'ArrowLeft') {
          isLeftKeyPressed = false;
        } else if (event.key === 'ArrowRight') {
          isRightKeyPressed = false;
        }
      }

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      action.play();

      function animate() {
        requestAnimationFrame(animate);

        mixer.update(0.02);

        renderer.render(scene, camera);

        if (isLeftKeyPressed) {
          if (models.rotation.y < maxRotationAngle) {
            models.rotation.y += rotationSpeed;
          }
        } else if (isRightKeyPressed) {
          if (models.rotation.y > -maxRotationAngle) {
            models.rotation.y -= rotationSpeed;
          }
        }
      }

      animate();


    });
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};


export default Move2;