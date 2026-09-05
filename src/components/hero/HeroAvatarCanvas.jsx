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

    // 2. Camera Setup - Cinematic Portrait Framing (Large, Close-Up Character)
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(22, aspect, 0.1, 100);
    camera.position.set(0, 1.42, 3.2);

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
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Cinematic Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    // Key Light (Soft Warm Studio Front Light)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
    keyLight.position.set(2, 3.5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cyan / Teal Rim Backlight (Signature Neon Edge Highlight)
    const rimLight = new THREE.DirectionalLight(0x22d3ee, 5.0);
    rimLight.position.set(-2.8, 2.8, -2.5);
    scene.add(rimLight);

    // Secondary Purple / Indigo Rim Light (Opposite Edge Glow)
    const rimLight2 = new THREE.DirectionalLight(0xa855f7, 3.2);
    rimLight2.position.set(2.8, 2.0, -2.5);
    scene.add(rimLight2);

    // Soft Chest & Face Fill Light
    const fillLight = new THREE.PointLight(0x38bdf8, 1.4, 6);
    fillLight.position.set(0, 0.8, 2);
    scene.add(fillLight);

    // Floating 3D Ambient Glowing Particles
    const particleCount = 35;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 4.5;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 3.5 + 1.2;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255,255,255,1)');
    pGrad.addColorStop(0.3, 'rgba(34,211,238,0.8)');
    pGrad.addColorStop(1, 'rgba(0,0,0,0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTex = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.07,
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
              child.material.roughness = Math.max(child.material.roughness, 0.4);
              child.material.envMapIntensity = 1.2;
            }
          }
          const name = (child.name || '').toLowerCase();
          if ((name.includes('head') || name.includes('spine006') || name.includes('neck')) && !headBone) {
            headBone = child;
          } else if (name.includes('spine') && !spineBone) {
            spineBone = child;
          }
        });

        // Compute box and scale so upper body and head fill the hero prominently
        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Target height ~ 2.6 units so the character is large, close, and commands the screen
        const targetHeight = 2.65;
        const scale = targetHeight / (size.y || 1.8);
        loadedModel.scale.set(scale, scale, scale);

        // Center horizontally and set vertical position so head/torso aligns with camera
        loadedModel.position.x = -center.x * scale;
        loadedModel.position.y = -box.min.y * scale - 0.22;
        loadedModel.position.z = -center.z * scale;

        avatarGroup.add(loadedModel);

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
        loader.load(
          '/models/developer_alt.glb',
          (fallbackGltf) => {
            loadedModel = fallbackGltf.scene;
            const box = new THREE.Box3().setFromObject(loadedModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const scale = 2.65 / (size.y || 1.8);
            loadedModel.scale.set(scale, scale, scale);
            loadedModel.position.x = -center.x * scale;
            loadedModel.position.y = -box.min.y * scale - 0.22;
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

    // 6. Pointer & Cursor Tracking Listeners
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 7. Dynamic Camera & Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;

      if (w < 640) {
        // Mobile: Slightly pull back and raise height so head/torso is framed nicely
        camera.fov = 28;
        camera.position.set(0, 1.35, 3.8);
      } else if (w < 1024) {
        // Tablet
        camera.fov = 24;
        camera.position.set(0, 1.4, 3.5);
      } else {
        // Desktop: High-impact close-up portrait framing
        camera.fov = 22;
        camera.position.set(0, 1.42, 3.2);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Animation Loop
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
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.048;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.048;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Natural subtle breathing motion
      const breathingHover = Math.sin(elapsedTime * 1.5) * 0.015;
      const breathingTilt = Math.sin(elapsedTime * 1.1) * 0.008;

      if (avatarGroup) {
        // Character torso subtly turns toward cursor
        avatarGroup.rotation.y = mx * 0.32 + Math.sin(elapsedTime * 0.5) * 0.012;
        avatarGroup.rotation.x = -my * 0.1 + breathingTilt;
        avatarGroup.position.y = breathingHover;
        avatarGroup.position.x = mx * 0.04;

        // Head bone turns toward cursor
        if (headBone) {
          headBone.rotation.y = mx * 0.38;
          headBone.rotation.x = -my * 0.26;
        }
      }

      // Particles gentle drift
      if (particlePoints) {
        particlePoints.rotation.y = elapsedTime * 0.02 + mx * 0.06;
      }

      // Subtle dynamic camera parallax
      camera.position.x = mx * 0.12;
      camera.position.y = 1.42 + my * 0.08;
      camera.lookAt(0, 1.32, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeom.dispose();
      pMat.dispose();
      pTex.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center select-none pointer-events-none z-10 overflow-hidden">
      {/* 3D Canvas Mounting Point */}
      <div 
        ref={mountRef} 
        className="w-full h-full relative z-10 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
      />

      {/* Loading Skeleton */}
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

      {/* Graceful Fallback */}
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[580px] bg-cyan-500/[0.14] dark:bg-cyan-400/[0.16] rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-purple-600/[0.1] rounded-full blur-[110px] pointer-events-none z-0" />
    </div>
  );
};

export default HeroAvatarCanvas;
