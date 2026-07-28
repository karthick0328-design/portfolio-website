import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';

const Experience = () => {
  const { experience } = portfolioData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -30 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      <div className="hidden md:block absolute top-1/3 left-0 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">
        <SectionHeading title="Work Experience" subtitle="My professional journey and impact." />
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 space-y-8"
        >
          {experience.map((exp) => (
            <motion.div 
              key={exp.id} 
              variants={item}
              className="glass-card p-8 md:p-10 relative overflow-hidden group border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{exp.role}</h3>
                  <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                    {exp.company}
                  </h4>
                </div>
                <div className="self-start md:self-auto shrink-0 inline-block px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20">
                  {exp.duration}
                </div>
              </div>
              
              <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed text-base">
                {exp.description}
              </p>
              
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h5 className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold mb-4">Key Achievements</h5>
                <ul className="list-none space-y-3">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                      <span className="text-blue-500 mt-1 shrink-0">✧</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;
