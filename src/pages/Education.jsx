import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { 
  FiMapPin, 
  FiAward, 
  FiCalendar, 
  FiCompass 
} from 'react-icons/fi';

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
      transition: { type: "spring", stiffness: 90, damping: 18 } 
    }
  };

  return (
    <div id="education" className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Map grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-5xl">
        <SectionHeading 
          title="Academic Route & Education" 
          subtitle="The academic road map, degrees, and institutions that formed the foundation of my engineering expertise." 
        />

        {/* Academic Route HUD Banner */}
        <div className="mt-10 mb-14 p-4 md:p-6 rounded-3xl bg-zinc-900/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-2.5 text-purple-400 font-bold">
              <span className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
                <FiCompass className="text-lg" />
              </span>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Degree Transit Line</div>
                <div className="text-zinc-100 font-extrabold">LINE #EDU-COMP-SCI // MASTER & BACHELOR</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5">
                <FiAward className="text-purple-400" /> MCA + B.Sc Computer Science
              </span>
            </div>
          </div>
        </div>

        {/* Road / Transit Map Stations Layout */}
        <div className="relative mt-8">
          {/* Connecting Road Line between Stations (Desktop Horizontal / Mobile Vertical) */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 -translate-y-1/2 h-8 bg-zinc-900 dark:bg-zinc-950 border-y-2 border-zinc-800 dark:border-zinc-800/80 rounded-full shadow-inner z-0 pointer-events-none">
            {/* Horizontal Road Dashes */}
            <div className="w-full h-full flex items-center justify-around px-8">
              <div className="w-full border-t-2 border-dashed border-yellow-400/70 dark:border-yellow-400/80"></div>
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10"
          >
            {education.map((edu, index) => {
              const isFirst = index === 0;

              return (
                <motion.div 
                  key={edu.id} 
                  variants={item}
                  className="relative flex flex-col"
                >
                  {/* Station Marker Node */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-11 h-11 rounded-2xl bg-zinc-900 dark:bg-zinc-950 border-2 border-purple-500 shadow-xl shadow-purple-500/25 flex items-center justify-center">
                      <span className="text-purple-400 font-black text-xs">S{index + 1}</span>
                      <div className="absolute -inset-1 rounded-2xl bg-purple-500/20 animate-pulse pointer-events-none"></div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                        Station 0{index + 1} {isFirst ? '— Master Level' : '— Undergraduate'}
                      </span>
                      <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        <FiMapPin className="text-purple-400 text-xs" /> Madurai, Tamil Nadu
                      </div>
                    </div>
                  </div>

                  {/* Station Card */}
                  <div className="glass-card p-8 rounded-3xl relative overflow-hidden group border border-zinc-200/90 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl hover:border-purple-500/60 dark:hover:border-purple-500/60 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex-grow flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div>
                      {/* Timeline Badge */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">
                          <FiCalendar className="text-xs" /> {edu.year}
                        </span>
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                          {isFirst ? 'Post Graduate' : 'Graduate'}
                        </span>
                      </div>

                      {/* Degree Title */}
                      <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-2 leading-snug group-hover:text-purple-500 transition-colors">
                        {edu.degree}
                      </h3>
                    </div>

                    {/* Institution Landmark Footer */}
                    <div className="mt-8 pt-5 border-t border-zinc-200/80 dark:border-zinc-800/80">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl shrink-0 text-purple-500">
                          🎓
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Institution</div>
                          <h4 className="text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-200 leading-snug">
                            {edu.institution}
                          </h4>
                        </div>
                      </div>
                    </div>
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

export default Education;

