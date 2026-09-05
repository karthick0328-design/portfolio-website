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

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera Setup - Balanced straight-on portrait framing
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(24, aspect, 0.1, 1000);
    camera.position.set(0, 0, 18);

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
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);

    // 4. Character Meshes: Base Character + Animated Eyelids + Speaking Mouth
    const textureLoader = new THREE.TextureLoader();
    let characterGroup = new THREE.Group();
    scene.add(characterGroup);

    let eyelidMat = null;
    let eyelidMesh = null;
    let mouthMesh = null;
    let mouthMat = null;

    const planeGeom = new THREE.PlaneGeometry(7.6, 7.6);

    // Load Base Character (Open Eyes & Neutral Mouth)
    textureLoader.load(
      '/models/karthick_straight_open.png?v=7',
      (baseTex) => {
        baseTex.colorSpace = THREE.SRGBColorSpace;
        baseTex.generateMipmaps = true;
        baseTex.minFilter = THREE.LinearMipmapLinearFilter;

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

        // Load Eyelids Layer (For Natural Solid Eye Blinking)
        textureLoader.load(
          '/models/karthick_eyelids.png?v=7',
          (eyelidTex) => {
            eyelidTex.colorSpace = THREE.SRGBColorSpace;
            eyelidTex.generateMipmaps = true;
            eyelidTex.minFilter = THREE.LinearMipmapLinearFilter;

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

        // Load Open Mouth Layer Directly
        textureLoader.load(
          '/models/karthick_mouth_open.png?v=7',
          (mouthTex) => {
            mouthTex.colorSpace = THREE.SRGBColorSpace;
            mouthTex.generateMipmaps = true;
            mouthTex.minFilter = THREE.LinearMipmapLinearFilter;

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
        camera.fov = 30;
        camera.position.set(0, -0.15, 17.5);
      } else if (w < 1024) {
        camera.fov = 26;
        camera.position.set(0, -0.1, 18.0);
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
    const blinkDuration = 0.13; // 130ms natural human blink

    // 7. Animation Loop: Real Human Audio Lip-Sync + Eye Blinking
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

      const elapsedTime = clock.getElapsedTime();

      // Subtle natural breathing float
      const breathingHover = Math.sin(elapsedTime * 1.3) * 0.025;
      if (characterGroup) {
        characterGroup.position.y = breathingHover;
        characterGroup.position.x = 0;
        characterGroup.rotation.set(0, 0, 0);
      }

      // 1. Natural Eye Blinking Controller (Fast, snappy, solid eyelids without ghosting)
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

      // 2. Real Viseme-Driven Lip Sync Controller (Single Unified Mouth)
      const currentViseme = visemeEngine.update(0.35);

      if (mouthMat && mouthMesh) {
        if (isSpeakingRef.current && currentViseme.openY > 0.12) {
          mouthMesh.visible = true;
          mouthMat.opacity = Math.min(1.0, (currentViseme.openY - 0.12) * 5.0);
          mouthMesh.scale.set(1.0, 1.0, 1.0);
        } else {
          mouthMesh.visible = false;
          mouthMat.opacity = 0.0;
          mouthMesh.scale.set(1.0, 1.0, 1.0);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
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
      className="absolute inset-0 w-full h-full flex items-center justify-center select-none z-10 overflow-hidden cursor-pointer"
      title="Click to play real voice introduction"
    >
      {/* 3D Canvas Mounting Point */}
      <div 
        ref={mountRef} 
        className="w-full h-full relative z-10 flex items-center justify-center pointer-events-none"
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
    </div>
  );
};

export default HeroAvatarCanvas;
