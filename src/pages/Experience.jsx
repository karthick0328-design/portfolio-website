import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { 
  FiMapPin, 
  FiClock, 
  FiTrendingUp,
  FiCheckCircle,
  FiBriefcase,
  FiZap
} from 'react-icons/fi';

const Experience = () => {
  const { experience } = portfolioData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25 }
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
    <div id="experience" className="min-h-screen pt-24 pb-28 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Topographic Road Map Grid Overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 max-w-5xl">
        <SectionHeading 
          title="Work Experience" 
          subtitle="My professional journey & roles" 
        />

        {/* Modern Sleek Tech Roadmap Timeline */}
        <div className="relative mt-12">
          {/* Vertical Glowing Cyber Milestone Spine */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-600 rounded-full z-0 pointer-events-none">
            {/* Ambient Line Glow */}
            <div className="absolute inset-0 w-full h-full bg-blue-500/40 blur-[4px]" />
            
            {/* Traveling Kinetic Light Tracer Packet */}
            <motion.div 
              animate={{ 
                top: ["0%", "45%", "85%", "100%", "0%"]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.45, 0.85, 0.98, 1]
              }}
              className="absolute left-1/2 -translate-x-1/2 w-3.5 h-12 -mt-6 bg-gradient-to-b from-transparent via-white to-cyan-400 rounded-full shadow-[0_0_16px_rgba(6,182,212,0.9)]"
            />
          </div>

          {/* Road Origin Marker */}
          <div className="flex justify-start md:justify-center mb-12 pl-14 md:pl-0 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-blue-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider border border-blue-500/30 shadow-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Engineering Milestone Checkpoint // 2025
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
            className="space-y-14 md:space-y-18 relative z-10"
          >
            {experience.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div 
                  key={exp.id} 
                  variants={item}
                  className={`flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-14 relative`}
                >
                  {/* Waypoint Milestone Node Badge on the Line */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 z-20 flex flex-col items-center">
                    <div className="relative w-12 h-12 rounded-2xl bg-zinc-900 border-2 border-cyan-400 shadow-xl shadow-cyan-400/30 flex flex-col items-center justify-center text-white">
                      <span className="text-cyan-400 font-black text-xs">0{index + 1}</span>
                      <span className="text-[8px] uppercase tracking-tighter text-zinc-400 font-bold">STOP</span>
                      {/* Pulse Ring */}
                      <div className="absolute -inset-1.5 rounded-2xl bg-cyan-400/20 animate-ping opacity-60 pointer-events-none" />
                    </div>
                  </div>

                  {/* Waypoint Content Card */}
                  <div className={`w-full md:w-[calc(50%-3.5rem)] pl-16 md:pl-0 ${isEven ? 'md:pr-4' : 'md:pl-4'}`}>
                    <div className="group relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 p-6 md:p-8">
                      {/* Header Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-blue-500/20">
                            <FiBriefcase className="text-sm" /> Station 0{index + 1}
                          </span>
                          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                            Engineering Station
                          </span>
                        </div>

                        {/* Year Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold">
                          <FiClock className="text-cyan-500" />
                          <span>{exp.duration}</span>
                        </div>
                      </div>

                      {/* Role & Company */}
                      <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-blue-600 dark:text-cyan-400 font-bold text-sm md:text-base">
                          <FiMapPin className="shrink-0 text-amber-500" />
                          <span>{exp.company}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-6 font-normal">
                        {exp.description}
                      </p>

                      {/* Accomplishments */}
                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                        <h4 className="text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-black mb-3 flex items-center gap-2">
                          <FiTrendingUp className="text-blue-500 text-sm" />
                          <span>Key Impact & Accomplishments</span>
                        </h4>
                        <ul className="space-y-2.5">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                              <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0 text-sm" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Symmetrical Layout Spacer */}
                  <div className="hidden md:block md:w-[calc(50%-3.5rem)]" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Road Destination Checkpoint */}
          <div className="flex justify-start md:justify-center mt-12 pl-14 md:pl-0 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20">
              <FiZap className="text-sm" /> Open to Next High-Impact Engineering Roles
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
