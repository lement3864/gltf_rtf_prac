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
    renderer.outputEncoding  = THREE.sRGBEncoding ;

    const camera = new THREE.PerspectiveCamera(60, 1);
    camera.position.set(0, 3, -5); // Adjusted camera position
    camera.lookAt(new THREE.Vector3(0, 1, 0)); // Adjusted lookAt position

    scene.background = new THREE.Color('white');
    const light = new THREE.DirectionalLight('0xffff00', 2);
    scene.add(light);

    console.log(scene)

    const loader = new GLTFLoader();
    loader.load('/images/scene.gltf', function (gltf) {
      gltf.scene.scale.set(0.025, 0.025, 0.025);
      
      
      const models = [];

      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          // 각 모델에 대한 조작을 수행합니다.
          // 예: 모델의 위치를 조정하거나, 배열에 모델을 추가합니다.
          child.position.set(0, 0, 0); // 모델의 위치를 조정합니다.
          models.push(child); // 모델을 배열에 추가합니다.
        }
      });

      scene.add(models[3]);

      const animationClip = gltf.animations[0];

      const mixer = new THREE.AnimationMixer(models[3]);

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
          if (models[3].rotation.y < maxRotationAngle) {
            models[3].rotation.y += rotationSpeed;
          }
        } else if (isRightKeyPressed) {
          if (models[3].rotation.y > -maxRotationAngle) {
            models[3].rotation.y -= rotationSpeed;
          }
        }
      }

      animate();


    });
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};


export default Move2;