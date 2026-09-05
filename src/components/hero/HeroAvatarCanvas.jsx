import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const HeroAvatarCanvas = () => {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL support check
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setLoadError(true);
      setIsLoading(false);
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.05;
    camera.updateProjectionMatrix();

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(3, 18, 15);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Teal / Cyan Rim Light
    const rimLight = new THREE.DirectionalLight(0x22d3ee, 5.0);
    rimLight.position.set(-6, 14, -6);
    scene.add(rimLight);

    // Purple / Indigo Rim Light
    const rimLight2 = new THREE.DirectionalLight(0xa855f7, 3.5);
    rimLight2.position.set(6, 10, -5);
    scene.add(rimLight2);

    // Point Fill Light
    const pointLight = new THREE.PointLight(0x22d3ee, 1.6, 50);
    pointLight.position.set(0, 14, 8);
    scene.add(pointLight);

    // 5. Load Exact Reference 3D Character Model
    let character = null;
    let headBone = null;
    let chestBone = null;
    let mixer = null;
    let baseHeadRot = { x: 0, y: 0, z: 0 };
    let baseChestRot = { x: 0, y: 0, z: 0 };

    const loader = new GLTFLoader();
    loader.load(
      '/models/character.glb',
      (gltf) => {
        character = gltf.scene;

        character.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = Math.max(child.material.roughness, 0.4);
              child.material.envMapIntensity = 1.2;
            }
          }
        });

        // Exact bone references from GLTF hierarchy
        headBone = character.getObjectByName('spine.006') || character.getObjectByName('Head') || null;
        chestBone = character.getObjectByName('spine.005') || character.getObjectByName('spine.003') || null;

        if (headBone) {
          baseHeadRot = { x: headBone.rotation.x, y: headBone.rotation.y, z: headBone.rotation.z };
        }
        if (chestBone) {
          baseChestRot = { x: chestBone.rotation.x, y: chestBone.rotation.y, z: chestBone.rotation.z };
        }

        scene.add(character);

        // Animation mixer for idle blink and intro
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(character);

          // Blink loop
          const blinkClip = gltf.animations.find((a) => a.name === 'Blink');
          if (blinkClip) {
            const blinkAction = mixer.clipAction(blinkClip);
            blinkAction.play();
          }

          // Subtle keyboard/hands idle keys
          ['key1', 'key2', 'key5', 'key6'].forEach((name) => {
            const clip = gltf.animations.find((a) => a.name === name);
            if (clip) {
              const act = mixer.clipAction(clip);
              act.play();
              act.timeScale = 1.0;
            }
          });
        }

        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Error loading reference character.glb:', err);
        setLoadError(true);
        setIsLoading(false);
      }
    );

    // 6. Global Mouse & Touch Tracking Listeners
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current.targetX = Math.max(-1.2, Math.min(1.2, x));
      mousePos.current.targetY = Math.max(-1.2, Math.min(1.2, y));
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        mousePos.current.targetX = Math.max(-1.2, Math.min(1.2, x));
        mousePos.current.targetY = Math.max(-1.2, Math.min(1.2, y));
      }
    };

    // Return to rest when mouse leaves window
    const handleMouseLeave = () => {
      mousePos.current.targetX = 0;
      mousePos.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;

      if (w < 640) {
        camera.fov = 17.5;
        camera.position.set(0, 12.8, 26);
        camera.zoom = 1.0;
      } else if (w < 1024) {
        camera.fov = 15.5;
        camera.position.set(0, 13.0, 25.2);
        camera.zoom = 1.05;
      } else {
        camera.fov = 14.5;
        camera.position.set(0, 13.1, 24.7);
        camera.zoom = 1.1;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Animation & Render Loop
    let animationFrameId;
    const clock = new THREE.Clock();
    let isVisible = true;

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Update GLTF animation mixer first
      if (mixer) {
        mixer.update(delta);
      }

      // Smooth Spring-Damped Lerping of mouse position
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.06;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.06;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Continuous natural breathing motion
      const breathingHover = Math.sin(elapsedTime * 1.8) * 0.05;
      const breathingSway = Math.sin(elapsedTime * 1.2) * 0.015;

      // 1. Interactive Head Rotation (spine.006)
      if (headBone) {
        const maxHeadTurnY = Math.PI / 4.5; // ~40 degrees
        const targetHeadY = baseHeadRot.y + mx * maxHeadTurnY;
        const targetHeadX = baseHeadRot.x - my * 0.35 + breathingSway * 0.5;

        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetHeadY, 0.12);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetHeadX, 0.1);
      }

      // 2. Interactive Chest / Upper Torso Rotation (spine.005)
      if (chestBone) {
        const targetChestY = baseChestRot.y + mx * 0.18;
        const targetChestX = baseChestRot.x - my * 0.12;

        chestBone.rotation.y = THREE.MathUtils.lerp(chestBone.rotation.y, targetChestY, 0.08);
        chestBone.rotation.x = THREE.MathUtils.lerp(chestBone.rotation.x, targetChestX, 0.08);
      }

      // 3. Whole Character Body Subtle Parallax & Rotation
      if (character) {
        character.rotation.y = THREE.MathUtils.lerp(character.rotation.y, mx * 0.18 + Math.sin(elapsedTime * 0.8) * 0.012, 0.06);
        character.rotation.x = THREE.MathUtils.lerp(character.rotation.x, -my * 0.06, 0.06);
        character.position.x = THREE.MathUtils.lerp(character.position.x, mx * 0.3, 0.06);
        character.position.y = breathingHover + my * 0.12;
      }

      // 4. Smooth Camera Parallax
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx * 0.7, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 13.1 + my * 0.35, 0.05);
      camera.lookAt(0, 12.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center select-none pointer-events-none z-10 overflow-hidden">
      {/* 3D Canvas Mounting Point */}
      <div 
        ref={mountRef} 
        className="w-full h-full relative z-10 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
      />

      {/* Loading Indicator */}
      {isLoading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-[9px] font-mono text-cyan-400 font-bold">3D</span>
            </div>
          </div>
        </div>
      )}

      {/* Atmospheric Rim Glow behind character */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[560px] bg-cyan-500/[0.14] dark:bg-cyan-400/[0.16] rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-purple-600/[0.1] rounded-full blur-[110px] pointer-events-none z-0" />
    </div>
  );
};

export default HeroAvatarCanvas;
