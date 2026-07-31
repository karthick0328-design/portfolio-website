import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from 'react-icons/fi';
import { portfolioData } from '../data/portfolioData';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white/5 dark:bg-black/20 border-t border-zinc-200 dark:border-white/10 pt-16 pb-8 relative z-20 backdrop-blur-md">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-4 inline-flex items-center gap-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">KP</span>
              <span className="opacity-70">.dev</span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 max-w-md leading-relaxed">
              Crafting premium, highly performant web experiences. Focused on intuitive design, robust architecture, and AI integrations.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-6 text-zinc-900 dark:text-white">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link to="/projects" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Projects</Link></li>
              <li><Link to="/casestudies" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Case Studies</Link></li>
              <li><Link to="/faq" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link to="/resume" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Resume</Link></li>
              <li><Link to="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-6 text-zinc-900 dark:text-white">Connect</h3>
            <div className="flex space-x-4">
              <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-100 dark:bg-white/5 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all">
                <FiGithub size={20} />
              </a>
              <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-100 dark:bg-white/5 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-blue-500 transition-all">
                <FiLinkedin size={20} />
              </a>
              <a href={`mailto:${portfolioData.personalInfo.email}`} className="p-3 bg-zinc-100 dark:bg-white/5 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all">
                <FiMail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 dark:text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} {portfolioData.personalInfo.name}. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center justify-center p-3 bg-zinc-900 dark:bg-white/10 text-white rounded-full hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg"
            aria-label="Back to top"
          >
            <FiArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
