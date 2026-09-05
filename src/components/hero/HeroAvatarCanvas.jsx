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

    // Check WebGL availability
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

    // 2. Camera Setup (framed for full-height character presentation)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 3.4);

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
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Cinematic Studio Lighting Rig
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Main Key Light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cyan / Blue Rim Light (Backlight for edge highlight)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    rimLight.position.set(-3, 3, -2.5);
    scene.add(rimLight);

    // Warm / Violet Fill Light
    const fillLight = new THREE.PointLight(0x818cf8, 2.0, 7);
    fillLight.position.set(2.5, -0.2, 1.5);
    scene.add(fillLight);

    // Soft bottom uplight for contrast
    const bottomLight = new THREE.PointLight(0x06b6d4, 1.2, 5);
    bottomLight.position.set(0, -1.8, 1.5);
    scene.add(bottomLight);

    // Ground Contact Shadow Plane
    const shadowPlaneGeom = new THREE.PlaneGeometry(3, 3);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    const shadowGrad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.55)');
    shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.2)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const shadowMesh = new THREE.Mesh(shadowPlaneGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.05;
    scene.add(shadowMesh);

    // Subtle atmospheric dust particles
    const particleCount = 45;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 5;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 4 + 1;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 3 - 0.2;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    pGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
    pGrad.addColorStop(0.4, 'rgba(56,189,248,0.5)');
    pGrad.addColorStop(1, 'rgba(0,0,0,0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 16, 16);

    const pTex = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlePoints = new THREE.Points(particleGeom, pMat);
    scene.add(particlePoints);

    // 5. 3D Character Group & Loader
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    let mixer = null;
    let headBone = null;
    let spineBone = null;
    let loadedModel = null;

    const loader = new GLTFLoader();
    loader.load(
      '/models/developer.glb',
      (gltf) => {
        loadedModel = gltf.scene;

        loadedModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = Math.max(child.material.roughness, 0.45);
              child.material.envMapIntensity = 1.0;
            }
          }
          const name = (child.name || '').toLowerCase();
          if (name.includes('head') && !headBone) {
            headBone = child;
          } else if (name.includes('spine') && !spineBone) {
            spineBone = child;
          }
        });

        // Scale and center model so it occupies full viewport height
        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Target height ~ 2.42 units for dominant central composition
        const targetHeight = 2.42;
        const scale = targetHeight / (size.y || 1.8);
        loadedModel.scale.set(scale, scale, scale);

        loadedModel.position.x = -center.x * scale;
        loadedModel.position.y = -box.min.y * scale;
        loadedModel.position.z = -center.z * scale;

        avatarGroup.add(loadedModel);

        // Check for animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(loadedModel);
          const idleClip = gltf.animations.find(
            (a) => a.name.toLowerCase().includes('idle') || a.name.toLowerCase().includes('wave')
          ) || gltf.animations[0];

          if (idleClip) {
            const action = mixer.clipAction(idleClip);
            action.play();
          }
        }

        setIsLoading(false);
      },
      undefined,
      () => {
        // Fallback loader if primary fails
        loader.load(
          '/models/developer_alt.glb',
          (altGltf) => {
            loadedModel = altGltf.scene;
            const box = new THREE.Box3().setFromObject(loadedModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const scale = 2.42 / (size.y || 1.8);
            loadedModel.scale.set(scale, scale, scale);
            loadedModel.position.x = -center.x * scale;
            loadedModel.position.y = -box.min.y * scale;
            loadedModel.position.z = -center.z * scale;
            avatarGroup.add(loadedModel);
            setIsLoading(false);
          },
          undefined,
          () => {
            setLoadError(true);
            setIsLoading(false);
          }
        );
      }
    );

    // 6. Pointer & Cursor Tracking
    const handlePointerMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);

      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;

      mousePos.current.targetX = Math.max(-1.2, Math.min(1.2, x));
      mousePos.current.targetY = Math.max(-1.2, Math.min(1.2, y));
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 7. Resize Observer & Dynamic Camera Adjustments
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;

      // Adjust camera distance based on aspect ratio (closer for wide desktop, pull back slightly on mobile)
      if (w < 640) {
        camera.fov = 44;
        camera.position.z = 3.6;
        camera.position.y = 1.1;
      } else if (w < 1024) {
        camera.fov = 40;
        camera.position.z = 3.5;
        camera.position.y = 1.15;
      } else {
        camera.fov = 37;
        camera.position.z = 3.35;
        camera.position.y = 1.15;
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

      if (mixer) {
        mixer.update(delta);
      }

      // Smooth Lerping
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.045;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.045;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Natural subtle breathing motion
      const breathingHover = Math.sin(elapsedTime * 1.6) * 0.02;
      const breathingTilt = Math.sin(elapsedTime * 1.2) * 0.012;

      if (avatarGroup) {
        avatarGroup.rotation.y = mx * 0.32 + Math.sin(elapsedTime * 0.7) * 0.015;
        avatarGroup.rotation.x = -my * 0.12 + breathingTilt;
        avatarGroup.position.y = breathingHover;
        avatarGroup.position.x = mx * 0.06;

        if (headBone) {
          headBone.rotation.y = mx * 0.35;
          headBone.rotation.x = -my * 0.25;
        }
      }

      // Subtle particle drift
      if (particlePoints) {
        particlePoints.rotation.y = elapsedTime * 0.03 + mx * 0.08;
      }

      // Smooth camera parallax
      camera.position.x = mx * 0.14;
      camera.position.y = 1.15 + my * 0.1;
      camera.lookAt(0, 1.08, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      shadowPlaneGeom.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      particleGeom.dispose();
      pMat.dispose();
      pTex.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* 3D Canvas Mounting Point */}
      <div 
        ref={mountRef} 
        className="w-full h-full relative z-10 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
      />

      {/* Loading Skeleton Indicator */}
      {isLoading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">3D</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] font-mono text-zinc-400 tracking-widest uppercase animate-pulse">
            Loading Character...
          </p>
        </div>
      )}

      {/* Graceful Fallback if WebGL unavailable */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
          <div className="relative w-64 h-80 rounded-3xl p-1 bg-gradient-to-tr from-cyan-500/30 via-indigo-500/20 to-purple-500/30 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center">
            <img 
              src="/Karthick.jpeg" 
              alt="Karthick Pandi" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Atmospheric Rim Glow behind character */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-purple-600/15 rounded-full blur-[100px] pointer-events-none z-0" />
    </div>
  );
};

export default HeroAvatarCanvas;
