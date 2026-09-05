import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import { 
  FiArrowRight, 
  FiGithub, 
  FiLinkedin, 
  FiMail, 
  FiLayers, 
  FiCode, 
  FiCpu,
  FiSend
} from 'react-icons/fi';
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiNodedotjs, 
  SiPython, 
  SiThreedotjs 
} from 'react-icons/si';
import MagneticButton from '../ui/MagneticButton';
import Typewriter from '../ui/Typewriter';
import HeroAvatarCanvas from './HeroAvatarCanvas';

const HeroSection = () => {
  const { personalInfo } = portfolioData;
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Parallax transforms for layered depth
  const backdropY = useTransform(scrollY, [0, 600], [0, 140]);
  const textContentY = useTransform(scrollY, [0, 600], [0, 60]);
  const avatarY = useTransform(scrollY, [0, 600], [0, -40]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.2]);

  const techStack = [
    { name: 'React.js', icon: SiReact, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
    { name: 'Next.js', icon: SiNextdotjs, color: 'text-zinc-100 border-zinc-500/20 bg-zinc-500/5' },
    { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
    { name: 'Node.js', icon: SiNodedotjs, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { name: 'Python', icon: SiPython, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
    { name: 'Three.js', icon: SiThreedotjs, color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
  ];

  const handleViewWork = () => {
    const projectsElement = document.getElementById('projects');
    if (projectsElement) {
      projectsElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/projects');
    }
  };

  const handleContact = () => {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 lg:py-0 flex items-center justify-center overflow-hidden bg-background">
      {/* 1. Cinematic Background Atmosphere & Light Flares */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Ambient Aurora Blobs */}
        <div className="absolute -top-[25%] -left-[10%] w-[650px] h-[650px] rounded-full bg-cyan-500/15 filter blur-[140px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[30%] -right-[15%] w-[600px] h-[600px] rounded-full bg-purple-600/15 filter blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute -bottom-[20%] left-[25%] w-[700px] h-[700px] rounded-full bg-blue-600/15 filter blur-[160px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Radial Vignette Mask */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      {/* 2. Deep Backdrop Typography (Layered behind 3D avatar for 3D/2D depth) */}
      <motion.div 
        style={{ y: backdropY }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none flex flex-col items-center justify-center opacity-[0.035] dark:opacity-[0.055] overflow-hidden"
      >
        <span className="text-[14vw] font-black tracking-tighter uppercase leading-none whitespace-nowrap bg-gradient-to-b from-zinc-900 to-transparent dark:from-white dark:to-transparent bg-clip-text text-transparent">
          KARTHICK
        </span>
        <span className="text-[11vw] font-black tracking-widest uppercase leading-none whitespace-nowrap bg-gradient-to-t from-zinc-900 to-transparent dark:from-white dark:to-transparent bg-clip-text text-transparent">
          DEVELOPER
        </span>
      </motion.div>

      {/* 3. Main Hero Content Container */}
      <motion.div 
        style={{ opacity: heroOpacity }}
        className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-6rem)]">
          
          {/* Left Column: Typography, Badges, Tech Stack, CTAs (Span 7) */}
          <motion.div 
            style={{ y: textContentY }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-20 pt-8 lg:pt-0"
          >
            {/* Availability Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/5 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/10 backdrop-blur-xl mb-6 shadow-sm shadow-black/5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 tracking-wider uppercase">
                Available for Work & Collaboration
              </span>
            </motion.div>

            {/* Greeting & Name */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl font-mono text-zinc-500 dark:text-zinc-400 mb-2 tracking-wide"
            >
              Hi there, I'm
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight text-zinc-900 dark:text-white mb-4 leading-[1.08]"
            >
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                Karthick
              </span>{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Pandi
              </span>
            </motion.h1>

            {/* Role & Animated Typewriter Subtitle */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2 h-12"
            >
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">&gt;</span>
              <span className="text-cyan-500 dark:text-cyan-400 font-bold">Full Stack Developer</span>
              <span className="hidden sm:inline text-zinc-400 dark:text-zinc-600 font-light">|</span>
              <div className="hidden sm:block text-zinc-600 dark:text-zinc-300 text-xl md:text-2xl font-mono">
                <Typewriter words={["AI Applications", "3D Web Experiences", "Modern UI/UX", "Scalable Systems"]} />
              </div>
            </motion.div>

            {/* Bio Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mb-8 leading-relaxed font-normal"
            >
              Building fast, scalable, and AI-powered web applications with modern architectures, 
              interactive 3D graphics, and responsive human-centered interfaces.
            </motion.p>

            {/* Core Tech Stack Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="w-full mb-10"
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                {techStack.map((tech, idx) => {
                  const Icon = tech.icon;
                  return (
                    <motion.div
                      key={tech.name}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${tech.color} shadow-sm`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
                        {tech.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* CTAs & Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              {/* Primary CTA: View My Work */}
              <MagneticButton 
                onClick={handleViewWork}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 p-[1px] font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-500 w-full sm:w-auto"
              >
                <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-zinc-950 px-8 py-3 text-white transition-all duration-300 group-hover:bg-opacity-80">
                  <FiLayers className="mr-2.5 w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold tracking-wide">View My Work</span>
                  <FiArrowRight className="ml-2.5 w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </MagneticButton>

              {/* Secondary CTA: Contact Me */}
              <MagneticButton 
                onClick={handleContact}
                className="group inline-flex h-14 items-center justify-center rounded-2xl border border-zinc-300 dark:border-white/15 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl px-8 font-medium text-zinc-900 dark:text-white transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:border-zinc-400 dark:hover:border-white/30 hover:scale-[1.02] shadow-sm w-full sm:w-auto"
              >
                <FiSend className="mr-2.5 w-4 h-4 text-purple-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                <span className="font-semibold tracking-wide">Contact Me</span>
              </MagneticButton>
            </motion.div>

            {/* Social Links & Quick Connect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="flex items-center gap-6 mt-10 pt-6 border-t border-zinc-200/60 dark:border-white/10 w-full justify-center lg:justify-start"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Connect
              </span>
              <div className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-3">
                <a 
                  href={personalInfo.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="GitHub"
                  className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition-all hover:scale-110 shadow-sm"
                >
                  <FiGithub size={18} />
                </a>
                <a 
                  href={personalInfo.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="LinkedIn"
                  className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all hover:scale-110 shadow-sm"
                >
                  <FiLinkedin size={18} />
                </a>
                <a 
                  href={`mailto:${personalInfo.email}`} 
                  aria-label="Email"
                  className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400 hover:border-purple-500/30 transition-all hover:scale-110 shadow-sm"
                >
                  <FiMail size={18} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Human Avatar Centerpiece (Span 5) */}
          <motion.div 
            style={{ y: avatarY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* 3D Human Avatar Canvas */}
            <div className="w-full relative z-10">
              <HeroAvatarCanvas />
            </div>

            {/* Floating Glassmorphism Badge 1: Top Right */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="hidden sm:flex absolute -top-4 right-0 lg:-right-4 z-20 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-zinc-900/80 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-cyan-500/5"
            >
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md">
                <FiCode size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Specialization</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">Full Stack & 3D Web</p>
              </div>
            </motion.div>

            {/* Floating Glassmorphism Badge 2: Bottom Left */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="hidden sm:flex absolute -bottom-2 left-0 lg:-left-6 z-20 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-zinc-900/80 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/5"
            >
              <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-600 text-white shadow-md">
                <FiCpu size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Architecture</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">Scalable & AI Systems</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </motion.div>

      {/* 4. Bottom Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 pointer-events-none opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          Scroll to explore
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-zinc-400/40 flex items-start justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
