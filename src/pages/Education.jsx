import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { 
  FiMapPin, 
  FiAward, 
  FiCalendar, 
  FiArrowRight
} from 'react-icons/fi';
import { FaSubway, FaGraduationCap } from 'react-icons/fa';

const Education = () => {
  const { education } = portfolioData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 35 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 85, damping: 16 } 
    }
  };

  return (
    <div id="education" className="min-h-screen pt-24 pb-28 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Transit Map Grid Overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 max-w-5xl">
        <SectionHeading 
          title="Academic Route & Transit Line" 
          subtitle="The academic transit route, institutional station stops, and degrees forming my computer science foundation." 
        />

        {/* Metro Transit Line Map HUD Header */}
        <div className="mt-10 mb-16 p-5 md:p-6 rounded-3xl bg-zinc-900 text-white shadow-2xl border border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-transparent to-blue-950/40 pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-600/30 border border-purple-500/50 text-purple-400 shadow-lg shadow-purple-500/20">
                <FaSubway className="text-2xl" />
              </div>
              <div>
                <div className="text-[11px] text-purple-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" /> TRANSIT METRO MAP
                </div>
                <div className="text-zinc-100 font-extrabold text-base md:text-lg">
                  PURPLE LINE // CS ACADEMIC ROUTE
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-2 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-2">
                <FiAward className="text-purple-400 text-sm" />
                <span>2 Milestone Degrees Completed</span>
              </span>
            </div>
          </div>
        </div>

        {/* Visual Metro / Transit Rail Road Route */}
        <div className="relative mt-8">
          {/* Horizontal Transit Railway Line (Desktop) */}
          <div className="hidden md:block absolute top-[110px] left-16 right-16 h-10 bg-zinc-900 border-2 border-purple-500/50 rounded-full shadow-2xl z-0 pointer-events-none overflow-hidden">
            {/* Railroad Track Ties */}
            <div className="absolute inset-0 flex justify-between items-center px-6">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-1.5 h-6 bg-zinc-700/80 rounded-sm" />
              ))}
            </div>

            {/* Glowing Rail Line Center Track */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full shadow-lg shadow-purple-500/50" />

            {/* Moving Metro Train */}
            <motion.div 
              animate={{ 
                x: ["0%", "450%", "0%"]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute left-8 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-white text-zinc-900 font-black text-[10px] flex items-center gap-1.5 shadow-xl border border-purple-400 z-10"
            >
              <FaSubway className="text-purple-600 text-xs" />
              <span>EDU-EXPRESS</span>
            </motion.div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 relative z-10"
          >
            {education.map((edu, index) => {
              const isFirst = index === 0;

              return (
                <motion.div 
                  key={edu.id} 
                  variants={item}
                  className="relative flex flex-col"
                >
                  {/* Station Platform Indicator Bar */}
                  <div className="flex items-center justify-between mb-4 bg-zinc-900 text-white p-3.5 rounded-2xl border-2 border-purple-500/40 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-purple-500/30">
                        S{index + 1}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                          {isFirst ? 'TERMINAL STATION 01' : 'ORIGIN STATION 02'}
                        </div>
                        <div className="text-xs font-bold text-zinc-200">
                          {isFirst ? 'Postgraduate Junction' : 'Undergraduate Origin'}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <FiMapPin className="text-purple-400" /> Madurai
                    </div>
                  </div>

                  {/* Main Station Destination Card */}
                  <div className="p-7 md:p-8 rounded-3xl relative overflow-hidden group border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-500 dark:hover:border-purple-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Year Badge & Status */}
                      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">
                          <FiCalendar /> {edu.year}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {isFirst ? 'MCA Program' : 'B.Sc Program'}
                        </span>
                      </div>

                      {/* Degree Title */}
                      <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-3 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {edu.degree}
                      </h3>
                    </div>

                    {/* Institution Landmark Station Footer */}
                    <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center text-xl shrink-0 text-purple-600 dark:text-purple-400 shadow-md shadow-purple-500/10">
                          <FaGraduationCap className="text-2xl" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">Institution Campus</div>
                          <h4 className="text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-100 leading-snug">
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

          {/* Transit Route Summary Footer Banner */}
          <div className="mt-12 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center flex items-center justify-center gap-3 text-xs md:text-sm text-zinc-300">
            <span className="font-bold text-purple-400 flex items-center gap-1.5">
              <FaSubway /> CS Route Track:
            </span>
            <span>The American College (B.Sc CS)</span>
            <FiArrowRight className="text-purple-400" />
            <span>KLN College of Engineering (MCA)</span>
            <FiArrowRight className="text-emerald-400" />
            <span className="text-emerald-400 font-bold">Full Stack Professional</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
