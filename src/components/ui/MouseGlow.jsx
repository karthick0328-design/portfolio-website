import React, { useEffect, useState } from 'react';

const MouseGlow = () => {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on devices with a mouse/fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let animationFrameId;

    const updateMousePosition = (e) => {
      if (!isVisible) setIsVisible(true);
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-30 transition-opacity duration-300 w-[600px] h-[600px] rounded-full"
      style={{
        background: `radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)`,
        transform: `translate(${position.x - 300}px, ${position.y - 300}px)`,
        willChange: 'transform',
      }}
    />
  );
};

export default MouseGlow;
