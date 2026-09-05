import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolioData';
import HeroAvatarCanvas from './HeroAvatarCanvas';

const HeroSection = () => {
  const { personalInfo } = portfolioData;
  const { scrollY } = useScroll();

  // Subtle parallax effect on scroll
  const contentY = useTransform(scrollY, [0, 500], [0, 50]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.1]);

  return (
    <section className="relative w-full min-h-screen h-screen flex items-center justify-center overflow-hidden bg-[#050507] text-white select-none">
      
      {/* 1. Dark Cinematic Ambient Background & Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft atmospheric cyan/teal and purple glowing flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-cyan-500/[0.08] filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/4 w-[550px] h-[550px] rounded-full bg-purple-600/[0.07] filter blur-[160px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/[0.04] filter blur-[120px] pointer-events-none" />
        
        {/* Subtle decorative glowing ambient spheres */}
        <div className="absolute top-[18%] left-[12%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_3px_rgba(34,211,238,0.7)] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[22%] right-[14%] w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_18px_3px_rgba(168,85,247,0.7)] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[35%] right-[18%] w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_2px_rgba(96,165,250,0.6)] animate-pulse" style={{ animationDuration: '5s' }} />

        {/* Deep dark vignette mask */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,rgba(0,0,0,0),#050507)]" />
      </div>

      {/* 2. HUGE 3D Human Avatar (Centered, Close-Up, Dominant) */}
      <HeroAvatarCanvas />

      {/* 3. Floating Left Social Icons (Vertical Stack) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="hidden md:flex flex-col items-center gap-6 absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-zinc-600 to-zinc-500" />
        <div className="flex flex-col gap-4">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-zinc-400 hover:text-cyan-400 hover:scale-125 transition-all duration-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          >
            <FiGithub size={19} />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-zinc-400 hover:text-cyan-400 hover:scale-125 transition-all duration-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          >
            <FiLinkedin size={19} />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            aria-label="Email"
            className="text-zinc-400 hover:text-purple-400 hover:scale-125 transition-all duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
          >
            <FiMail size={19} />
          </a>
        </div>
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 via-zinc-600 to-transparent" />
      </motion.div>

      {/* 4. Main Content Overlay (Left Intro + Right Role, arranged around Character) */}
      <motion.div 
        style={{ y: contentY, opacity: heroOpacity }}
        className="w-full h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-between py-20 lg:py-0 relative z-20 pointer-events-none"
      >
        {/* Mid-screen Container: Left Intro & Right Info */}
        <div className="w-full flex-grow flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-0 my-auto">
          
          {/* LEFT CONTENT: Introduction & Name */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto"
          >
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-zinc-400 mb-1.5 font-light"
            >
              Hello! I'm
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black tracking-tight uppercase leading-[0.95] text-white"
            >
              <span className="block text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
                KARTHICK
              </span>
              <span className="block bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-500 bg-clip-text text-transparent mt-0.5">
                PANDI
              </span>
            </motion.h1>
          </motion.div>

          {/* Spacer for the large center 3D character */}
          <div className="hidden lg:block w-72 xl:w-96 h-1 pointer-events-none" />

          {/* RIGHT CONTENT: Professional Role & Description */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto max-w-[300px] sm:max-w-[340px]"
          >
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-base sm:text-lg font-light text-cyan-400 tracking-wide mb-0.5 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
            >
              Full Stack &
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase leading-[0.95] tracking-tight mb-3"
            >
              DEVELOPER
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal"
            >
              Building modern, scalable, and interactive web applications with React, Next.js, Node.js, Python, Three.js, and AI technologies.
            </motion.p>
          </motion.div>

        </div>

        {/* Bottom Bar: Minimal Resume Link (Right) and Scroll Prompt (Center) */}
        <div className="w-full pb-6 flex items-center justify-between pointer-events-auto">
          {/* Mobile Social Links */}
          <div className="flex md:hidden items-center gap-4 text-zinc-400">
            <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-cyan-400">
              <FiGithub size={18} />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-cyan-400">
              <FiLinkedin size={18} />
            </a>
            <a href={`mailto:${personalInfo.email}`} aria-label="Email" className="hover:text-purple-400">
              <FiMail size={18} />
            </a>
          </div>

          {/* Center Minimal Scroll Prompt */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="hidden sm:flex flex-col items-center gap-1.5 mx-auto pointer-events-none"
          >
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-zinc-500">
              SCROLL
            </span>
            <div className="w-[1px] h-5 bg-gradient-to-b from-cyan-400/80 to-transparent animate-pulse" />
          </motion.div>

          {/* Minimal Resume Link (Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="ml-auto"
          >
            <Link 
              to="/resume" 
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-300 hover:text-cyan-400 transition-colors duration-300"
            >
              <span className="relative pb-0.5">
                RESUME
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </span>
              <FiArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-cyan-400" />
            </Link>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default HeroSection;
