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

    // 2. Camera Setup - Focused on 3D Character portrait
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(28, aspect, 0.1, 1000);
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
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 4. 3D Floating Glowing Bokeh Orbs (Matching reference atmosphere)
    const orbsGroup = new THREE.Group();
    scene.add(orbsGroup);

    // Magenta Orb (Top Left)
    const orbGeom1 = new THREE.SphereGeometry(0.55, 32, 32);
    const orbMat1 = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#d946ef'),
      transparent: true,
      opacity: 0.85,
    });
    const orb1 = new THREE.Mesh(orbGeom1, orbMat1);
    orb1.position.set(-5.5, 3.8, -2.5);
    orbsGroup.add(orb1);

    // Cyan Orb (Top Right)
    const orbGeom2 = new THREE.SphereGeometry(0.35, 32, 32);
    const orbMat2 = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#06b6d4'),
      transparent: true,
      opacity: 0.9,
    });
    const orb2 = new THREE.Mesh(orbGeom2, orbMat2);
    orb2.position.set(4.8, 4.2, -1.8);
    orbsGroup.add(orb2);

    // Deep Teal Glow Orb (Mid Right)
    const orbGeom3 = new THREE.SphereGeometry(0.8, 32, 32);
    const orbMat3 = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#0ea5e9'),
      transparent: true,
      opacity: 0.45,
    });
    const orb3 = new THREE.Mesh(orbGeom3, orbMat3);
    orb3.position.set(6.2, -1.5, -3.5);
    orbsGroup.add(orb3);

    // Tiny Sparkle Orbs
    const sparkles = [];
    const sparkleGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const sparkleColors = ['#38bdf8', '#c084fc', '#22d3ee', '#e879f9'];
    for (let i = 0; i < 8; i++) {
      const spMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(sparkleColors[i % sparkleColors.length]),
        transparent: true,
        opacity: 0.75,
      });
      const sp = new THREE.Mesh(sparkleGeom, spMat);
      sp.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4 - 1
      );
      sparkles.push({
        mesh: sp,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        basePos: sp.position.clone(),
      });
      orbsGroup.add(sp);
    }

    // 5. High-Precision 3D Interactive Human Character Mesh
    const textureLoader = new THREE.TextureLoader();
    let characterMesh = null;
    let characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // Vertex Shader: 3D Depth Displacement & Perspective Curvature
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform sampler2D uDepthMap;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uDisplacement;

      void main() {
        vUv = uv;
        
        // Sample depth map (white = close, black = far)
        float depth = texture2D(uDepthMap, uv).r;
        
        // 3D breathing micro-motion
        float breath = sin(uTime * 1.6 + uv.y * 2.0) * 0.04;
        
        // 3D anatomical displacement (face and nose protrude forward, shoulders recede)
        vec3 displacedPosition = position;
        displacedPosition.z += depth * uDisplacement + breath;

        // Subtle 3D perspective warp tracking mouse
        displacedPosition.x += uMouse.x * depth * 0.45;
        displacedPosition.y += uMouse.y * depth * 0.35;

        vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
        vViewPosition = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    // Fragment Shader: High-End Stylized Rim Lighting & Parallax
    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform sampler2D uTexture;
      uniform sampler2D uDepthMap;
      uniform vec2 uMouse;
      uniform float uTime;

      void main() {
        // Dynamic Parallax Offset in UV coordinates
        float depth = texture2D(uDepthMap, vUv).r;
        vec2 parallaxOffset = uMouse * (depth * 0.035);
        vec2 uv = vUv - parallaxOffset;

        // Clamp UVs to avoid edge bleeding
        uv = clamp(uv, 0.002, 0.998);

        vec4 color = texture2D(uTexture, uv);

        // Soft studio rim lighting calculation
        vec3 viewDir = normalize(vViewPosition);
        float rim = 1.0 - max(dot(viewDir, vec3(0.0, 0.0, 1.0)), 0.0);
        rim = smoothstep(0.4, 0.95, rim);

        // Left Cyan Rim Light (responds to mouse angle)
        vec3 cyanLight = vec3(0.04, 0.75, 0.93) * (rim * (0.85 - uMouse.x * 0.35));
        
        // Right Purple / Magenta Rim Light (responds to mouse angle)
        vec3 purpleLight = vec3(0.72, 0.28, 0.95) * (rim * (0.85 + uMouse.x * 0.35));

        // Soft ambient eye and hair sheen
        float sheen = pow(depth, 2.2) * 0.12 * (1.0 + sin(uTime * 1.2) * 0.15);
        
        // Seamless dark background blend (pure #050507 at outer boundary)
        vec2 edgeDist = min(vUv, 1.0 - vUv);
        float edgeAlpha = smoothstep(0.0, 0.04, min(edgeDist.x, edgeDist.y));

        vec3 finalRgb = color.rgb + (cyanLight + purpleLight) * depth * 0.6 + vec3(sheen);

        gl_FragColor = vec4(finalRgb, color.a * edgeAlpha);
      }
    `;

    // Load Color Map & Depth Map
    textureLoader.load(
      '/models/karthick_avatar.jpg',
      (colorTex) => {
        colorTex.colorSpace = THREE.SRGBColorSpace;
        colorTex.generateMipmaps = true;
        colorTex.minFilter = THREE.LinearMipmapLinearFilter;

        textureLoader.load(
          '/models/karthick_avatar_depth.png',
          (depthTex) => {
            depthTex.generateMipmaps = true;

            const planeGeom = new THREE.PlaneGeometry(8.6, 8.6, 128, 128);
            const planeMat = new THREE.ShaderMaterial({
              vertexShader,
              fragmentShader,
              uniforms: {
                uTexture: { value: colorTex },
                uDepthMap: { value: depthTex },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uTime: { value: 0 },
                uDisplacement: { value: 1.35 },
              },
              transparent: true,
              side: THREE.DoubleSide,
            });

            characterMesh = new THREE.Mesh(planeGeom, planeMat);
            // Position character in center framing
            characterMesh.position.set(0, -0.35, 0);
            characterGroup.add(characterMesh);

            setIsLoading(false);
          },
          undefined,
          () => {
            setLoadError(true);
            setIsLoading(false);
          }
        );
      },
      undefined,
      () => {
        setLoadError(true);
        setIsLoading(false);
      }
    );

    // 6. Global Mouse & Touch Tracking
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

    // 7. Responsive Camera Adjustments
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;

      if (w < 640) {
        camera.fov = 34;
        camera.position.set(0, -0.2, 17.5);
      } else if (w < 1024) {
        camera.fov = 30;
        camera.position.set(0, -0.1, 18.0);
      } else {
        camera.fov = 28;
        camera.position.set(0, 0, 18.0);
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

      const elapsedTime = clock.getElapsedTime();

      // Smooth Spring-Damped Lerping of mouse position
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.065;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.065;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Natural breathing & floating sway
      const breathingHover = Math.sin(elapsedTime * 1.5) * 0.08;
      const breathingSway = Math.sin(elapsedTime * 0.9) * 0.015;

      // Update Character 3D Shader Uniforms
      if (characterMesh && characterMesh.material.uniforms) {
        characterMesh.material.uniforms.uMouse.value.set(mx, my);
        characterMesh.material.uniforms.uTime.value = elapsedTime;
      }

      // Smooth 3D Group Rotation & Parallax
      if (characterGroup) {
        characterGroup.rotation.y = THREE.MathUtils.lerp(characterGroup.rotation.y, mx * 0.22 + breathingSway, 0.08);
        characterGroup.rotation.x = THREE.MathUtils.lerp(characterGroup.rotation.x, -my * 0.16, 0.08);
        characterGroup.rotation.z = THREE.MathUtils.lerp(characterGroup.rotation.z, -mx * 0.03, 0.08);
        characterGroup.position.x = THREE.MathUtils.lerp(characterGroup.position.x, mx * 0.45, 0.06);
        characterGroup.position.y = THREE.MathUtils.lerp(characterGroup.position.y, my * 0.25 + breathingHover - 0.2, 0.06);
      }

      // Animate 3D Glowing Orbs in Depth
      orb1.position.y = 3.8 + Math.sin(elapsedTime * 1.1) * 0.25 + my * 0.4;
      orb1.position.x = -5.5 + Math.cos(elapsedTime * 0.8) * 0.2 - mx * 0.5;
      
      orb2.position.y = 4.2 + Math.cos(elapsedTime * 1.3) * 0.2 + my * 0.3;
      orb2.position.x = 4.8 + Math.sin(elapsedTime * 0.9) * 0.2 - mx * 0.4;

      orb3.position.y = -1.5 + Math.sin(elapsedTime * 0.7) * 0.3 + my * 0.2;

      sparkles.forEach((sp, idx) => {
        sp.mesh.position.y = sp.basePos.y + Math.sin(elapsedTime * 1.4 + idx) * 0.35 + my * 0.15;
        sp.mesh.position.x = sp.basePos.x + Math.cos(elapsedTime * 1.1 + idx) * 0.25 + mx * 0.15;
      });

      // Subtle Camera Tracking
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx * 0.6, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, my * 0.35, 0.05);
      camera.lookAt(0, 0, 0);

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[620px] bg-cyan-500/[0.14] dark:bg-cyan-400/[0.16] rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-600/[0.12] rounded-full blur-[120px] pointer-events-none z-0" />
    </div>
  );
};

export default HeroAvatarCanvas;
