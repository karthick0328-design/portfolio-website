import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';

const About = () => {
  const { about } = portfolioData;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="About Me" subtitle="My journey, philosophy, and achievements." />
        
        <div className="flex flex-col lg:flex-row gap-12 items-stretch mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-2/3 glass-card p-8 md:p-10 relative overflow-hidden group"
          >
            <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
            
            <h3 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
              The Journey
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed text-lg">
              {about.introduction}
            </p>
            
            <h3 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-cyan-400 rounded-full"></span>
              Career Objective
            </h3>
            <div className="relative">
              <span className="absolute -top-4 -left-2 text-6xl text-zinc-200 dark:text-zinc-800 font-serif opacity-50">"</span>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg pl-6 italic relative z-10">
                {about.objective}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/3 flex flex-col gap-6"
          >
            {about.stats.map((stat, index) => {
              // Extract numeric value for CountUp
              const numValue = parseInt(stat.value.replace(/[^0-9]/g, ''), 10) || 0;
              const suffix = stat.value.replace(/[0-9]/g, '');

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  className="glass-card p-6 flex-grow flex flex-col items-center justify-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-2 relative z-10">
                    <CountUp end={numValue} duration={2.5} enableScrollSpy scrollSpyOnce />
                    {suffix}
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest text-xs text-center relative z-10">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>


        
      </div>
    </div>
  );
};

export default About;
