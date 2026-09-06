import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { visemeEngine } from '../../features/voice/services/visemeEngine';

const HeroAvatarCanvas = ({ isSpeaking = false, audioLevel = 0, onToggleSpeak }) => {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const isSpeakingRef = useRef(isSpeaking);
  const audioLevelRef = useRef(audioLevel);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

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

    const isMobile = window.innerWidth < 768;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(24, aspect, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // 3. WebGL Renderer with High-Performance Mobile Optimization
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // Disable on mobile to eliminate GPU bottleneck
      powerPreference: isMobile ? 'low-power' : 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
      depth: false, // 2D planes don't need depth buffer
      stencil: false
    });
    renderer.setSize(width, height);
    // Lock pixel ratio on mobile to 1.0 to guarantee 60 FPS and zero frame drops
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    if (!isMobile) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
    }

    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // 4. Character Meshes
    const textureLoader = new THREE.TextureLoader();
    let characterGroup = new THREE.Group();
    scene.add(characterGroup);

    let eyelidMat = null;
    let eyelidMesh = null;
    let mouthMesh = null;
    let mouthMat = null;

    const planeGeom = new THREE.PlaneGeometry(7.6, 7.6);

    // Load Base Character
    textureLoader.load(
      '/models/karthick_straight_open.png?v=7',
      (baseTex) => {
        baseTex.colorSpace = THREE.SRGBColorSpace;
        baseTex.generateMipmaps = !isMobile;
        baseTex.minFilter = isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;

        const baseMat = new THREE.MeshBasicMaterial({
          map: baseTex,
          transparent: true,
          alphaTest: 0.01,
          depthWrite: false,
          side: THREE.DoubleSide,
        });

        const baseMesh = new THREE.Mesh(planeGeom, baseMat);
        baseMesh.position.set(0, -0.2, 0);
        characterGroup.add(baseMesh);

        // Load Eyelids Layer
        textureLoader.load(
          '/models/karthick_eyelids.png?v=7',
          (eyelidTex) => {
            eyelidTex.colorSpace = THREE.SRGBColorSpace;
            eyelidTex.generateMipmaps = !isMobile;
            eyelidTex.minFilter = isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;

            eyelidMat = new THREE.MeshBasicMaterial({
              map: eyelidTex,
              transparent: true,
              opacity: 0.0,
              depthWrite: false,
              side: THREE.DoubleSide,
            });

            eyelidMesh = new THREE.Mesh(planeGeom, eyelidMat);
            eyelidMesh.position.set(0, -0.2, 0.01);
            eyelidMesh.visible = false;
            characterGroup.add(eyelidMesh);
          }
        );

        // Load Open Mouth Layer
        textureLoader.load(
          '/models/karthick_mouth_open.png?v=7',
          (mouthTex) => {
            mouthTex.colorSpace = THREE.SRGBColorSpace;
            mouthTex.generateMipmaps = !isMobile;
            mouthTex.minFilter = isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;

            mouthMat = new THREE.MeshBasicMaterial({
              map: mouthTex,
              transparent: true,
              opacity: 0.0,
              depthWrite: false,
              side: THREE.DoubleSide,
            });

            mouthMesh = new THREE.Mesh(planeGeom, mouthMat);
            mouthMesh.position.set(0, -0.2, 0.02);
            mouthMesh.visible = false;
            characterGroup.add(mouthMesh);

            setIsLoading(false);
          },
          undefined,
          () => {
            setIsLoading(false);
          }
        );
      },
      undefined,
      (err) => {
        console.error('Failed to load character texture:', err);
        setLoadError(true);
        setIsLoading(false);
      }
    );

    // 5. Responsive Camera Adjustments
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;

      if (w < 640) {
        camera.fov = 29;
        camera.position.set(0, 0.1, 18.0);
      } else if (w < 1024) {
        camera.fov = 26;
        camera.position.set(0, 0.0, 18.0);
      } else {
        camera.fov = 24;
        camera.position.set(0, 0, 18.0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 6. Realistic Periodic Eye Blinking State
    let nextBlinkTime = 2.2;
    let isBlinking = false;
    let blinkStartTime = 0;
    const blinkDuration = 0.13;

    // 7. Animation Loop with Smart Idle Pausing & Intersection Observer
    let animationFrameId = null;
    let isRunning = false;
    let isVisible = true;
    const clock = new THREE.Clock();
    let lastRenderTime = 0;
    const targetFps = isMobile ? 40 : 60;
    const frameInterval = 1000 / targetFps;

    const animate = (currentTime) => {
      if (!isVisible) {
        isRunning = false;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      // Throttle rendering on mobile to keep CPU/GPU cold and silky smooth
      if (isMobile) {
        const delta = currentTime - lastRenderTime;
        if (delta < frameInterval) return;
        lastRenderTime = currentTime - (delta % frameInterval);
      }

      const elapsedTime = clock.getElapsedTime();

      // Subtle breathing hover
      const breathingHover = Math.sin(elapsedTime * 1.3) * (isMobile ? 0.015 : 0.025);
      if (characterGroup) {
        characterGroup.position.y = breathingHover;
      }

      // 1. Natural Eye Blinking Controller
      if (eyelidMat && eyelidMesh) {
        if (!isBlinking && elapsedTime >= nextBlinkTime) {
          isBlinking = true;
          blinkStartTime = elapsedTime;
          eyelidMesh.visible = true;
        }

        if (isBlinking) {
          const progress = (elapsedTime - blinkStartTime) / blinkDuration;
          if (progress >= 1.0) {
            eyelidMat.opacity = 0.0;
            eyelidMesh.visible = false;
            isBlinking = false;
            const isDoubleBlink = Math.random() < 0.2;
            nextBlinkTime = elapsedTime + (isDoubleBlink ? 0.25 : 3.0 + Math.random() * 2.5);
          } else {
            eyelidMesh.visible = true;
            let eyeAlpha = 1.0;
            if (progress < 0.25) {
              eyeAlpha = progress / 0.25;
            } else if (progress > 0.75) {
              eyeAlpha = (1.0 - progress) / 0.25;
            } else {
              eyeAlpha = 1.0;
            }
            eyelidMat.opacity = eyeAlpha;
          }
        }
      }

      // 2. Real Viseme-Driven Lip Sync Controller
      if (isSpeakingRef.current) {
        const currentViseme = visemeEngine.update(0.14);
        if (mouthMat && mouthMesh) {
          if (currentViseme.openY > 0.10) {
            mouthMesh.visible = true;
            mouthMat.opacity = Math.min(1.0, Math.max(0.0, (currentViseme.openY - 0.10) * 1.8));
          } else {
            mouthMesh.visible = false;
            mouthMat.opacity = 0.0;
          }
        }
      } else if (mouthMesh && mouthMesh.visible) {
        mouthMesh.visible = false;
        if (mouthMat) mouthMat.opacity = 0.0;
      }

      renderer.render(scene, camera);
    };

    // IntersectionObserver: COMPLETELY halts Three.js render loop when scrolled away on mobile!
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !isRunning) {
        isRunning = true;
        clock.start();
        lastRenderTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      } else if (!isVisible && isRunning) {
        isRunning = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        clock.stop();
      }
    }, { threshold: 0.02 });

    intersectionObserver.observe(container);

    isRunning = true;
    animationFrameId = requestAnimationFrame(animate);

    // 8. Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      onClick={onToggleSpeak}
      className="absolute inset-0 w-full h-full flex items-center justify-center select-none z-10 overflow-hidden cursor-pointer pointer-events-auto touch-pan-y"
      title="Click to play real voice introduction"
    >
      {/* 3D Canvas Mounting Point */}
      <div 
        ref={mountRef} 
        className="w-full h-full relative z-10 flex items-center justify-center pointer-events-none touch-pan-y"
      />

      {/* Loading Skeleton */}
      {isLoading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-[9px] font-mono text-cyan-400 font-bold">3D</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroAvatarCanvas;
