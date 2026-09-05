import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const HeroAvatarCanvas = () => {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isHovered = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setLoadError(true);
      setIsLoading(false);
      return;
    }

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 550;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);

    // 3. Renderer Setup
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
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Main Key Light (Soft Warm Studio Light)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(2.5, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cyan / Blue Rim Light (Backlight for Cinematic Glow)
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 3.2);
    rimLight.position.set(-3, 3, -2.5);
    scene.add(rimLight);

    // Purple / Indigo Accent Light
    const fillLight = new THREE.PointLight(0xa855f7, 2.5, 8);
    fillLight.position.set(3, -0.5, 1.5);
    scene.add(fillLight);

    // Bottom soft uplight
    const bottomLight = new THREE.PointLight(0x3b82f6, 1.2, 6);
    bottomLight.position.set(0, -2, 2);
    scene.add(bottomLight);

    // 5. Floating Background Particle Dust
    const particleCount = 70;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6 + 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Create circular particle texture programmatically
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 32;
    canvasTexture.height = 32;
    const ctx = canvasTexture.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(96,165,250,0.8)');
    gradient.addColorStop(1, 'rgba(147,51,234,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const particleTex = new THREE.CanvasTexture(canvasTexture);
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Floating Tech Accents (Orbiting Geometric Ring & Glowing Core)
    const ringGroup = new THREE.Group();
    const torusGeom = new THREE.TorusGeometry(1.6, 0.015, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.4,
    });
    const torus = new THREE.Mesh(torusGeom, torusMat);
    torus.rotation.x = Math.PI / 3;
    ringGroup.add(torus);

    const ringGeom2 = new THREE.TorusGeometry(1.85, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.3,
    });
    const torus2 = new THREE.Mesh(ringGeom2, ringMat2);
    torus2.rotation.y = Math.PI / 4;
    ringGroup.add(torus2);

    ringGroup.position.set(0, 0.8, -0.4);
    scene.add(ringGroup);

    // 7. Load 3D Human Avatar Model
    let avatarGroup = new THREE.Group();
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

        // Traverse model to optimize materials and shadows
        loadedModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = Math.max(child.material.roughness, 0.4);
              child.material.envMapIntensity = 1.2;
            }
          }
          // Find head / neck / spine bone for subtle head-tracking
          const name = (child.name || '').toLowerCase();
          if (name.includes('head') && !headBone) {
            headBone = child;
          } else if (name.includes('spine') && !spineBone) {
            spineBone = child;
          }
        });

        // Compute bounding box to auto-center and scale accurately
        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Target height ~ 2.45 units for a prominent, striking avatar
        const targetHeight = 2.45;
        const scale = targetHeight / (size.y || 1.8);
        loadedModel.scale.set(scale, scale, scale);
        
        // Center horizontally and set vertical base
        loadedModel.position.x = -center.x * scale;
        loadedModel.position.y = -box.min.y * scale - 0.2;
        loadedModel.position.z = -center.z * scale;

        avatarGroup.add(loadedModel);

        // Check for built-in animation clips (idle, typing, breathing)
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
      (xhr) => {
        // Progress tracking
      },
      (err) => {
        console.warn('Error loading primary model, trying fallback', err);
        loader.load(
          '/models/developer_alt.glb',
          (fallbackGltf) => {
            loadedModel = fallbackGltf.scene;
            loadedModel.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            const box = new THREE.Box3().setFromObject(loadedModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const scale = 2.4 / (size.y || 1.8);
            loadedModel.scale.set(scale, scale, scale);
            loadedModel.position.x = -center.x * scale;
            loadedModel.position.y = -box.min.y * scale - 0.2;
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

    // 8. Mouse & Pointer Movement Handlers
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
      
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      
      mousePos.current.targetX = Math.max(-1.5, Math.min(1.5, x));
      mousePos.current.targetY = Math.max(-1.5, Math.min(1.5, y));
    };

    const handleWindowMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current.targetX = x * 1.2;
      mousePos.current.targetY = y * 1.2;
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    container.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 500;
      const newHeight = container.clientHeight || 550;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation & Render Loop
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

      // Update GLTF animations mixer
      if (mixer) {
        mixer.update(delta);
      }

      // Smooth Lerp Mouse Movement
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Subtle natural breathing and floating motion
      const breathingSway = Math.sin(elapsedTime * 1.8) * 0.025;
      const breathingHover = Math.sin(elapsedTime * 1.5) * 0.035;

      if (avatarGroup) {
        // Smooth torso / body rotation tracking cursor
        avatarGroup.rotation.y = mx * 0.35 + Math.sin(elapsedTime * 0.8) * 0.02;
        avatarGroup.rotation.x = -my * 0.15 + breathingSway * 0.5;
        avatarGroup.position.y = breathingHover;
        avatarGroup.position.x = mx * 0.08;

        // If bone exists, provide dedicated head-look responsiveness
        if (headBone) {
          headBone.rotation.y = mx * 0.4;
          headBone.rotation.x = -my * 0.3;
        }
      }

      // Rotate and float tech rings
      if (ringGroup) {
        ringGroup.rotation.z = elapsedTime * 0.25;
        ringGroup.rotation.y = elapsedTime * 0.15 + mx * 0.2;
        ringGroup.position.y = 0.8 + Math.cos(elapsedTime * 1.2) * 0.04;
      }

      // Rotate particle cloud gently
      if (particles) {
        particles.rotation.y = elapsedTime * 0.05 + mx * 0.1;
        particles.rotation.x = my * 0.05;
      }

      // Subtle dynamic camera parallax
      camera.position.x = mx * 0.18;
      camera.position.y = 1.2 + my * 0.12;
      camera.lookAt(0, 1.05, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      container.removeEventListener('touchmove', handlePointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTex.dispose();
      torusGeom.dispose();
      torusMat.dispose();
      ringGeom2.dispose();
      ringMat2.dispose();
    };
  }, []);

  return (
    <div 
      className="relative w-full h-[450px] sm:h-[520px] md:h-[580px] lg:h-[640px] flex items-center justify-center select-none"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; mousePos.current.targetX = 0; mousePos.current.targetY = 0; }}
    >
      {/* 3D Canvas Mounting Point */}
      <div 
        ref={mountRef} 
        className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Loading Skeleton / State */}
      {isLoading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xs font-mono text-cyan-400 font-semibold">3D</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-mono text-zinc-400 tracking-widest uppercase animate-pulse">
            Rendering 3D Avatar...
          </p>
        </div>
      )}

      {/* Graceful Fallback if WebGL or Asset Fails */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center">
              <img 
                src="/Karthick.jpeg" 
                alt="Karthick Pandi" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Atmospheric Background Glow behind Avatar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-purple-600/20 rounded-full blur-[90px] pointer-events-none z-0"></div>

      {/* Interactive Helper Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/60 dark:bg-black/50 border border-white/10 backdrop-blur-md shadow-lg opacity-80 hover:opacity-100 transition-opacity">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
        <span className="text-[11px] font-mono text-zinc-300 dark:text-zinc-400 tracking-wider">
          Interactive 3D • Move cursor to inspect
        </span>
      </div>
    </div>
  );
};

export default HeroAvatarCanvas;
