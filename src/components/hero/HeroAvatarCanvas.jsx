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

    // 2. Camera Setup - Focused close on character portrait
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(26, aspect, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // 3. WebGL Renderer (High performance, crisp rendering)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // 4. Character 3D Mesh
    const textureLoader = new THREE.TextureLoader();
    let characterGroup = new THREE.Group();
    scene.add(characterGroup);

    let characterMesh = null;

    // Load master high-definition character asset
    textureLoader.load(
      '/models/karthick_avatar.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Plane dimensions matching character portrait aspect ratio
        const planeGeom = new THREE.PlaneGeometry(8.2, 8.2);
        
        // Custom Shader for seamless dark edge blending without distorting character
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uMouse: { value: new THREE.Vector2(0, 0) },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform vec2 uMouse;

            void main() {
              vec4 color = texture2D(uTexture, vUv);
              
              // Soft border vignette to merge seamlessly with #050507 background
              vec2 edge = min(vUv, 1.0 - vUv);
              float fade = smoothstep(0.0, 0.05, min(edge.x, edge.y));
              
              gl_FragColor = vec4(color.rgb, color.a * fade);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide,
        });

        characterMesh = new THREE.Mesh(planeGeom, material);
        characterMesh.position.set(0, -0.4, 0);
        characterGroup.add(characterMesh);

        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load avatar texture:', err);
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
        camera.fov = 32;
        camera.position.set(0, -0.2, 17.5);
      } else if (w < 1024) {
        camera.fov = 28;
        camera.position.set(0, -0.1, 18.0);
      } else {
        camera.fov = 26;
        camera.position.set(0, 0, 18.0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 7. Animation Loop with Solid 3D Perspective Rotation & Parallax
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
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.065;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.065;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Natural idle breathing motion (clean vertical float, no texture warping)
      const breathingHover = Math.sin(elapsedTime * 1.4) * 0.06;
      const breathingSway = Math.sin(elapsedTime * 0.8) * 0.01;

      // Solid 3D Perspective Tilt & Rotation tracking the cursor
      if (characterGroup) {
        characterGroup.rotation.y = THREE.MathUtils.lerp(characterGroup.rotation.y, mx * 0.18 + breathingSway, 0.08);
        characterGroup.rotation.x = THREE.MathUtils.lerp(characterGroup.rotation.x, -my * 0.12, 0.08);
        characterGroup.rotation.z = THREE.MathUtils.lerp(characterGroup.rotation.z, -mx * 0.02, 0.08);
        characterGroup.position.x = THREE.MathUtils.lerp(characterGroup.position.x, mx * 0.35, 0.06);
        characterGroup.position.y = THREE.MathUtils.lerp(characterGroup.position.y, my * 0.2 + breathingHover - 0.2, 0.06);
      }

      // Subtle Camera Tracking
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx * 0.45, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, my * 0.25, 0.05);
      camera.lookAt(0, 0, 0);

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

      {/* Atmospheric Rim Glow behind character */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[620px] bg-cyan-500/[0.12] dark:bg-cyan-400/[0.14] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-600/[0.1] rounded-full blur-[130px] pointer-events-none z-0" />
    </div>
  );
};

export default HeroAvatarCanvas;
