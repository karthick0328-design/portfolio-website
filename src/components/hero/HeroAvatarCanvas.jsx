import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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

    // 4. Character Structure: Stationary Body + Mouse-Tracking Head
    const textureLoader = new THREE.TextureLoader();
    let bodyMesh = null;
    let headGroup = new THREE.Group();
    let headMesh = null;

    scene.add(headGroup);

    const planeGeom = new THREE.PlaneGeometry(7.6, 7.6);

    // Load Body Texture (Stationary)
    textureLoader.load(
      '/models/karthick_straight_body.png',
      (bodyTex) => {
        bodyTex.colorSpace = THREE.SRGBColorSpace;
        bodyTex.generateMipmaps = true;
        bodyTex.minFilter = THREE.LinearMipmapLinearFilter;

        const bodyMat = new THREE.MeshBasicMaterial({
          map: bodyTex,
          transparent: true,
          alphaTest: 0.01,
          depthWrite: false,
          side: THREE.DoubleSide,
        });

        bodyMesh = new THREE.Mesh(planeGeom, bodyMat);
        bodyMesh.position.set(0, -0.2, 0);
        scene.add(bodyMesh);

        // Load Head Texture (Interactive Mouse Tracking)
        textureLoader.load(
          '/models/karthick_straight_head.png',
          (headTex) => {
            headTex.colorSpace = THREE.SRGBColorSpace;
            headTex.generateMipmaps = true;
            headTex.minFilter = THREE.LinearMipmapLinearFilter;

            const headMat = new THREE.MeshBasicMaterial({
              map: headTex,
              transparent: true,
              alphaTest: 0.01,
              depthWrite: false,
              side: THREE.DoubleSide,
            });

            headMesh = new THREE.Mesh(planeGeom, headMat);
            // Pivot around neck / chin
            headMesh.position.set(0, 0, 0);
            headGroup.position.set(0, -0.2, 0.05);
            headGroup.add(headMesh);

            setIsLoading(false);
          },
          undefined,
          (err) => {
            console.error('Failed to load head texture:', err);
            setLoadError(true);
            setIsLoading(false);
          }
        );
      },
      undefined,
      (err) => {
        console.error('Failed to load body texture:', err);
        setLoadError(true);
        setIsLoading(false);
      }
    );

    // 5. Global Mouse & Touch Tracking Listeners
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current.targetX = Math.max(-1.0, Math.min(1.0, x));
      mousePos.current.targetY = Math.max(-1.0, Math.min(1.0, y));
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        mousePos.current.targetX = Math.max(-1.0, Math.min(1.0, x));
        mousePos.current.targetY = Math.max(-1.0, Math.min(1.0, y));
      }
    };

    const handleMouseLeave = () => {
      mousePos.current.targetX = 0;
      mousePos.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // 6. Responsive Camera Adjustments
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

    // 7. Animation Loop: Head tracks mouse, Body remains stationary
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

      // Smooth Spring-Damped Lerping of mouse position
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.06;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.06;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Subtle breathing motion
      const breathingHover = Math.sin(elapsedTime * 1.3) * 0.03;
      const breathingSway = Math.sin(elapsedTime * 0.7) * 0.005;

      // HEAD ROTATES & MOVES WITH MOUSE (Straight direction + interactive tracking)
      if (headGroup) {
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mx * 0.2 + breathingSway, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -my * 0.14, 0.08);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, -mx * 0.02, 0.08);
        headGroup.position.x = THREE.MathUtils.lerp(headGroup.position.x, mx * 0.16, 0.08);
        headGroup.position.y = THREE.MathUtils.lerp(headGroup.position.y, -0.2 + my * 0.08 + breathingHover, 0.08);
      }

      // BODY REMAINS STATIONARY (Only subtle vertical breathing anchor)
      if (bodyMesh) {
        bodyMesh.position.y = -0.2 + breathingHover * 0.4;
        bodyMesh.position.x = 0;
        bodyMesh.rotation.set(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
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
