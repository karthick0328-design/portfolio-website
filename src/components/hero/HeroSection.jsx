import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroAvatarCanvas from './HeroAvatarCanvas';

const HeroSection = () => {
  const { scrollY } = useScroll();

  // Subtle parallax on scroll
  const leftColY = useTransform(scrollY, [0, 500], [0, 80]);
  const rightColY = useTransform(scrollY, [0, 500], [0, 80]);
  const avatarY = useTransform(scrollY, [0, 500], [0, -30]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.1]);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-background pt-20 sm:pt-24 lg:pt-0">
      
      {/* 1. Subtle Atmospheric Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Center Halo behind 3D Character */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/[0.07] dark:bg-cyan-500/[0.09] filter blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-purple-600/[0.05] dark:bg-purple-600/[0.07] filter blur-[150px] pointer-events-none" />
        
        {/* Very subtle grid/depth line */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_40%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>

      {/* 2. Main Hero Grid: LEFT CONTENT ← 3D CHARACTER → RIGHT CONTENT */}
      <motion.div 
        style={{ opacity: heroOpacity }}
        className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 flex-grow flex items-center relative z-10 w-full"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[calc(100vh-8rem)] py-8 lg:py-0">
          
          {/* LEFT CONTENT: Introduction & Name */}
          <motion.div 
            style={{ y: leftColY }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 xl:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 select-none z-20"
          >
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl font-mono text-zinc-500 dark:text-zinc-400 mb-2 tracking-widest uppercase font-light"
            >
              Hello! I'm
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-[1.05]"
            >
              <span className="block bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                KARTHICK
              </span>
              <span className="block bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent mt-1">
                PANDI
              </span>
            </motion.h1>
          </motion.div>

          {/* CENTER: Full-Height 3D Human Avatar */}
          <motion.div 
            style={{ y: avatarY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-6 h-[460px] sm:h-[540px] md:h-[620px] lg:h-[calc(100vh-8rem)] w-full flex items-center justify-center relative order-1 lg:order-2 z-10"
          >
            <HeroAvatarCanvas />
          </motion.div>

          {/* RIGHT CONTENT: Professional Role & Description */}
          <motion.div 
            style={{ y: rightColY }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 xl:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right order-3 lg:order-3 select-none z-20"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-4 tracking-tight"
            >
              <span className="block text-cyan-500 dark:text-cyan-400">Full Stack</span>
              <span className="block text-zinc-800 dark:text-zinc-200">Developer</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal max-w-xs lg:max-w-none"
            >
              Building modern, scalable, and interactive web applications with React, Next.js, Node.js, Python, Three.js, and AI technologies.
            </motion.p>
          </motion.div>

        </div>
      </motion.div>

      {/* 3. Bottom Minimal Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="w-full pb-8 flex flex-col items-center justify-center relative z-20 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400 dark:text-zinc-500">
            Scroll
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-cyan-400/60 to-transparent animate-pulse" />
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
