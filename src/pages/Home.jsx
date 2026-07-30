import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { portfolioData } from '../data/portfolioData';
import { FiDownload, FiArrowRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import MagneticButton from '../components/ui/MagneticButton';
import Typewriter from '../components/ui/Typewriter';

import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Education from './Education';
import Projects from './Projects';
import Resume from './Resume';
import Contact from './Contact';

const Home = () => {
  const { personalInfo } = portfolioData;
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen pt-24 pb-12 flex items-center relative overflow-hidden">
      
      {/* Aurora Background Effect */}
      <div className="hidden md:block absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/20 mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-purple-500/20 mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-3/5 text-center lg:text-left flex flex-col items-center lg:items-start mt-12 lg:mt-0"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 backdrop-blur-md mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Available for Work</span>
            </motion.div>

            <h2 className="text-2xl md:text-3xl text-zinc-600 dark:text-zinc-400 font-medium mb-2">
              Hi 👋 I'm
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight leading-tight">
              {personalInfo.name}
            </h1>
            
            <div className="text-xl md:text-3xl font-medium text-zinc-600 dark:text-zinc-300 mb-8 h-10">
              <Typewriter words={[personalInfo.role1, personalInfo.role2, personalInfo.role3]} />
            </div>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-xl leading-relaxed">
              Building fast, scalable, and AI-powered web applications with modern architectures.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <MagneticButton 
                onClick={() => navigate('/projects')}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-zinc-900 dark:bg-white px-8 font-medium text-white dark:text-zinc-900 w-full sm:w-auto transition-all hover:scale-105"
              >
                <span className="mr-2">View Projects</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20 dark:bg-black/10" />
                </div>
              </MagneticButton>
              
              <MagneticButton 
                onClick={() => navigate('/resume')}
                className="group inline-flex h-14 items-center justify-center rounded-full border border-zinc-300 dark:border-white/20 bg-transparent px-8 font-medium text-zinc-900 dark:text-white w-full sm:w-auto transition-all hover:bg-zinc-100 dark:hover:bg-white/5 hover:scale-105"
              >
                <span className="mr-2">Download Resume</span>
                <FiDownload className="group-hover:-translate-y-1 transition-transform" />
              </MagneticButton>
            </div>

            <div className="flex items-center gap-6 mt-12">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest">Connect</p>
              <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700"></div>
              <div className="flex gap-4">
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <FiGithub size={24} />
                </a>
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-blue-500 transition-colors">
                  <FiLinkedin size={24} />
                </a>
                <a href={`mailto:${personalInfo.email}`} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <FiMail size={24} />
                </a>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="w-full lg:w-2/5 flex justify-center relative perspective-1000"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-72 h-72 md:w-[400px] md:h-[400px]"
            >
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full blur-[80px] opacity-30"></div>
              
              {/* Image Container with Border Gradient */}
              <div className="absolute inset-0 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-400 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                  <img 
                    src="/Karthick.jpeg" 
                    alt={personalInfo.name} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              
              {/* Floating Decorative Elements */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border border-dashed border-zinc-400/30 rounded-full pointer-events-none"
              ></motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
      
      {/* Additional Sections */}
      <About />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <Resume />
      <Contact />
    </>
  );
};

export default Home;
