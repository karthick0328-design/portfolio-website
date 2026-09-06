import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolioData';
import HeroAvatarCanvas from './HeroAvatarCanvas';
import { useVoiceAssistant } from '../../features/voice';
import { speechSynthesisService } from '../../features/voice/services/speechSynthesisService';

const INTRO_TEXT = "Hello! I'm Karthick Pandi. I'm a Full Stack Developer building modern, scalable, and interactive web applications with React, Next.js, Node.js, Python, Three.js, and AI technologies. Welcome to my portfolio!";

const HeroSection = () => {
  const { personalInfo } = portfolioData;
  const { scrollY } = useScroll();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { 
    isSpeaking: isVoiceSpeaking, 
    stopSpeaking: stopVoiceSpeaking 
  } = useVoiceAssistant();

  const activeIsSpeaking = isSpeaking || isVoiceSpeaking;

  // Function to speak intro narration safely
  const speakIntro = useCallback(() => {
    try {
      if (isVoiceSpeaking) {
        stopVoiceSpeaking();
      }
      setIsSpeaking(true);
      speechSynthesisService.speak(INTRO_TEXT, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    } catch (e) {
      console.warn('Speech synthesis non-blocking error:', e);
      setIsSpeaking(false);
    }
  }, [isVoiceSpeaking, stopVoiceSpeaking]);

  // Toggle speak on avatar click
  const toggleSpeak = () => {
    if (isSpeaking) {
      speechSynthesisService.stop();
      setIsSpeaking(false);
    } else {
      speakIntro();
    }
  };

  // Clean up any speech on unmount
  useEffect(() => {
    return () => {
      speechSynthesisService.stop();
    };
  }, []);

  // Subtle parallax effect on scroll (smooth transform)
  const contentY = useTransform(scrollY, [0, 400], [0, 30]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0.15]);

  return (
    <section id="hero" className="relative w-full min-h-[100svh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#f8fafc] dark:bg-[#050507] text-zinc-900 dark:text-white select-none transition-colors duration-500 touch-pan-y">
      
      {/* 1. Ambient Background & Glows (Desktop only for peak mobile performance) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="hidden md:block absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-cyan-500/[0.08] dark:bg-cyan-500/[0.06] filter blur-[150px] pointer-events-none transition-opacity duration-500" />
        <div className="hidden md:block absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/4 w-[550px] h-[550px] rounded-full bg-purple-600/[0.07] dark:bg-purple-600/[0.05] filter blur-[160px] pointer-events-none transition-opacity duration-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,rgba(248,250,252,0),#f8fafc)] dark:bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,rgba(0,0,0,0),#050507)] transition-colors duration-500" />
      </div>

      {/* 2. 3D Human Avatar (Centered, Clear Viewport for Face and Lip-Sync) */}
      <HeroAvatarCanvas isSpeaking={activeIsSpeaking} onToggleSpeak={toggleSpeak} />

      {/* 3. Floating Left Social Icons (Desktop) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="hidden md:flex flex-col items-center gap-6 absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-zinc-400 to-zinc-300 dark:via-zinc-600 dark:to-zinc-500" />
        <div className="flex flex-col gap-4">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-zinc-600 hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400 hover:scale-125 transition-all duration-300"
          >
            <FiGithub size={19} />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-zinc-600 hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400 hover:scale-125 transition-all duration-300"
          >
            <FiLinkedin size={19} />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            aria-label="Email"
            className="text-zinc-600 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 hover:scale-125 transition-all duration-300"
          >
            <FiMail size={19} />
          </a>
        </div>
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-300 via-zinc-400 to-transparent dark:from-zinc-500 dark:via-zinc-600 dark:to-transparent" />
      </motion.div>

      {/* 4. Main Content Overlay: Name at top of head, clear 3D avatar face, role at bottom */}
      <motion.div 
        style={{ y: contentY, opacity: heroOpacity }}
        className="w-full h-full max-w-7xl mx-auto px-5 sm:px-12 lg:px-16 flex flex-col justify-between pt-16 sm:pt-20 pb-6 sm:pb-8 lg:py-0 relative z-30 pointer-events-none"
      >
        {/* Responsive Content Container: Name at Top of Head on mobile */}
        <div className="w-full flex-grow flex flex-col lg:flex-row items-center lg:items-center justify-between gap-2 sm:gap-4 lg:gap-0 my-auto">
          
          {/* TOP (Mobile) / LEFT (Desktop): Hello I'm Karthick Pandi at Top of Head */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto z-30 relative pt-1 sm:pt-3 lg:pt-0"
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-zinc-500 dark:text-zinc-400 mb-1 font-bold"
            >
              Hello! I'm
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight uppercase leading-tight text-zinc-900 dark:text-white"
            >
              <span className="inline lg:block text-zinc-900 dark:text-white mr-2 lg:mr-0">
                KARTHICK
              </span>
              <span className="inline lg:block bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-500 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-400 bg-clip-text text-transparent">
                PANDI
              </span>
            </motion.h1>
          </motion.div>

          {/* Center Clear Zone: Leaves entire Face, Eyes, Nose & Lip-Sync mouth completely unobstructed */}
          <div className="w-full h-[240px] xs:h-[270px] sm:h-[300px] lg:h-0 lg:w-72 xl:w-96 pointer-events-none flex-shrink-0" />

          {/* BOTTOM (Mobile: Positioned over Avatar Chest) / RIGHT (Desktop): Role & Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto max-w-[320px] sm:max-w-[360px] z-30 relative pb-2 sm:pb-4 lg:pb-0"
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-xs sm:text-sm md:text-base font-extrabold text-cyan-600 dark:text-cyan-400 tracking-wide mb-0.5"
            >
              Full Stack &
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white uppercase leading-[0.95] tracking-tight mb-2 drop-shadow-sm"
            >
              DEVELOPER
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium drop-shadow-sm"
            >
              Building modern, scalable, and interactive web applications with React, Next.js, Node.js, Python, Three.js, and AI technologies.
            </motion.p>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <div className="w-full pb-3 sm:pb-6 flex items-center justify-between pointer-events-auto">
          {/* Mobile Social Links */}
          <div className="flex md:hidden items-center gap-4 text-zinc-600 dark:text-zinc-400">
            <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-cyan-600 dark:hover:text-cyan-400">
              <FiGithub size={18} />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-cyan-600 dark:hover:text-cyan-400">
              <FiLinkedin size={18} />
            </a>
            <a href={`mailto:${personalInfo.email}`} aria-label="Email" className="hover:text-purple-600 dark:hover:text-purple-400">
              <FiMail size={18} />
            </a>
          </div>

          {/* Center Scroll Prompt */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="hidden sm:flex flex-col items-center gap-1.5 mx-auto pointer-events-none"
          >
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-500">
              SCROLL
            </span>
            <div className="w-[1px] h-5 bg-gradient-to-b from-cyan-500/80 dark:from-cyan-400/80 to-transparent animate-pulse" />
          </motion.div>

          {/* Minimal Resume Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="ml-auto"
          >
            <Link 
              to="/resume" 
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-700 hover:text-cyan-600 dark:text-zinc-300 dark:hover:text-cyan-400 transition-colors duration-300"
            >
              <span className="relative pb-0.5">
                RESUME
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-600 dark:bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </span>
              <FiArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-cyan-600 dark:text-cyan-400" />
            </Link>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default HeroSection;
