import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroAvatarCanvas from './HeroAvatarCanvas';

const HeroSection = () => {
  const { scrollY } = useScroll();

  // Subtle parallax effect on scroll
  const contentY = useTransform(scrollY, [0, 500], [0, 60]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.15]);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background select-none">
      
      {/* 1. Subtle Atmospheric Background Ambient Flares */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft atmospheric gradient behind the scene */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.06] filter blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] filter blur-[140px]" />
        
        {/* Radial vignette mask */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(120,119,198,0.06),rgba(0,0,0,0))]" />
      </div>

      {/* 2. Fullscreen 3D Character Canvas Layer (Centerpiece) */}
      <HeroAvatarCanvas />

      {/* 3. Integrated Hero Typography & Portfolio Info Layer */}
      <motion.div 
        style={{ y: contentY, opacity: heroOpacity }}
        className="w-full h-full min-h-screen max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col justify-between py-24 lg:py-0 relative z-20 pointer-events-none"
      >
        {/* Main Grid / Layout Wrapper */}
        <div className="w-full flex-grow flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-0 my-auto">
          
          {/* LEFT SIDE: Name & Intro */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto"
          >
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg font-mono tracking-[0.25em] uppercase text-zinc-500 dark:text-zinc-400 mb-2 font-normal"
            >
              Hello! I'm
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-[0.92]"
            >
              <span className="block text-zinc-900 dark:text-white">
                KARTHICK
              </span>
              <span className="block bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-400 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-500 bg-clip-text text-transparent mt-1">
                PANDI
              </span>
            </motion.h1>
          </motion.div>

          {/* Spacer for Center 3D Character on Desktop */}
          <div className="hidden lg:block w-72 xl:w-96 h-1 pointer-events-none" />

          {/* RIGHT SIDE: Professional Role & Description */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto max-w-sm"
          >
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl font-light text-cyan-500 dark:text-cyan-400 tracking-wide mb-1"
            >
              Full Stack &
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-zinc-900 dark:text-white uppercase leading-[0.95] tracking-tight mb-4"
            >
              DEVELOPER
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal"
            >
              Building modern, scalable, and interactive web applications with React, Next.js, Node.js, Python, Three.js, and AI technologies.
            </motion.p>
          </motion.div>

        </div>

        {/* 4. Minimal Elegant Bottom Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="w-full pb-8 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-500">
              SCROLL
            </span>
            <div className="w-[1px] h-6 bg-gradient-to-b from-cyan-400/70 to-transparent animate-pulse" />
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default HeroSection;
