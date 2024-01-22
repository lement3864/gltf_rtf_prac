import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const Move = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });
    renderer.outputEncoding = THREE.sRGBEncoding;

    const camera = new THREE.PerspectiveCamera(60, 1);
    camera.position.set(0, 3, -5); // Adjusted camera position
    camera.lookAt(new THREE.Vector3(0, 1, 0)); // Adjusted lookAt position

    scene.background = new THREE.Color('white');
    const light = new THREE.DirectionalLight('0xffff00', 2);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('/images/Fox.gltf', function (gltf) {
      gltf.scene.scale.set(0.025, 0.025, 0.025);
      const character = gltf.scene;
      scene.add(character);

      const animationClip = gltf.animations[2];

      const mixer = new THREE.AnimationMixer(character);

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

        mixer.update(0.04);

        renderer.render(scene, camera);

        if (isLeftKeyPressed) {
          if (character.rotation.y < maxRotationAngle) {
            character.rotation.y += rotationSpeed;
          }
        } else if (isRightKeyPressed) {
          if (character.rotation.y > -maxRotationAngle) {
            character.rotation.y -= rotationSpeed;
          }
        }
      }

      animate();
    });
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};


export default Move;