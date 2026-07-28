import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';

const Education = () => {
  const { education } = portfolioData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      <div className="hidden md:block absolute top-1/4 right-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">
        <SectionHeading title="Education" subtitle="My academic background." />
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {education.map((edu) => (
            <motion.div 
              key={edu.id} 
              variants={item}
              className="glass-card p-8 relative overflow-hidden group border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-colors h-full flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold border border-purple-500/20 mb-4">
                  {edu.year}
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
                  {edu.degree}
                </h3>
              </div>
              
              <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shrink-0">
                    🎓
                  </div>
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-snug">
                    {edu.institution}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Education;
