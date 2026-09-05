import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { 
  FiMapPin, 
  FiNavigation, 
  FiCompass, 
  FiClock, 
  FiTrendingUp 
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
    hidden: { opacity: 0, y: 35 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 90, damping: 18 } 
    }
  };

  return (
    <div id="experience" className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Map Topo / Grid Overlay */}
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-5xl">
        <SectionHeading 
          title="Career Journey & Road Map" 
          subtitle="A navigational timeline of professional milestones, development roles, and engineering impact." 
        />

        {/* GPS Navigation Route Bar / HUD */}
        <div className="mt-10 mb-14 p-4 md:p-6 rounded-3xl bg-zinc-900/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-2.5 text-blue-400 font-bold">
              <span className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
                <FiCompass className="text-lg animate-spin" style={{ animationDuration: '12s' }} />
              </span>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Active Route</div>
                <div className="text-zinc-100 font-extrabold">ROUTE #EXP-DEV // FULLSTACK</div>
              </div>
            </div>

            {/* Road Trajectory Status */}
            <div className="hidden sm:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Speed: Accelerated</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                <FiMapPin className="text-blue-400" />
                <span>Madurai, TN, India</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
              <FiNavigation className="text-sm rotate-45" />
              <span>Career Trajectory</span>
            </div>
          </div>
        </div>

        {/* Vertical Highway Road Timeline */}
        <div className="relative mt-8">
          {/* Central Road Track (Desktop: Center / Mobile: Left-aligned) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-8 md:w-10 bg-zinc-900 dark:bg-zinc-950 border-x-2 border-zinc-800 dark:border-zinc-800/80 rounded-full flex flex-col items-center justify-between py-6 shadow-inner z-0 pointer-events-none">
            {/* Road Center Dashed Line */}
            <div className="w-0.5 h-full border-r-2 border-dashed border-yellow-400/70 dark:border-yellow-400/80"></div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-12 md:space-y-16 relative z-10"
          >
            {experience.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div 
                  key={exp.id} 
                  variants={item}
                  className={`flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-12 relative`}
                >
                  {/* Waypoint Pin on the Road (Centered on desktop, left on mobile) */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 z-20 flex flex-col items-center">
                    <div className="relative w-12 h-12 rounded-full bg-zinc-900 dark:bg-zinc-950 border-2 border-blue-500 shadow-xl shadow-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {/* Concentric pulsing sonar ring */}
                      <div className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping opacity-60 pointer-events-none"></div>
                      <span className="text-blue-400 font-black text-xs">0{index + 1}</span>
                    </div>
                    <span className="mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900/90 text-blue-400 border border-blue-500/30 hidden md:block">
                      Stop #{index + 1}
                    </span>
                  </div>

                  {/* Waypoint Content Card */}
                  <div className={`w-full md:w-[calc(50%-3rem)] pl-16 md:pl-0 ${isEven ? 'md:pr-4' : 'md:pl-4'}`}>
                    <div className="group relative rounded-3xl overflow-hidden bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/90 dark:border-white/10 hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 p-7 md:p-8">
                      {/* Ambient hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Road Signboard Header */}
                      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-500/20 uppercase tracking-wider flex items-center gap-1.5">
                            <FiNavigation className="text-xs rotate-45" /> Milestone {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 shadow-sm">
                          <FiClock className="text-blue-500" />
                          <span>{exp.duration}</span>
                        </div>
                      </div>

                      {/* Role & Company Landmark */}
                      <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-blue-500 transition-colors">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 text-blue-600 dark:text-blue-400 font-bold text-sm md:text-base">
                          <FiMapPin className="shrink-0 text-blue-500" />
                          <span>{exp.company}</span>
                        </div>
                      </div>

                      {/* Road Description */}
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-6">
                        {exp.description}
                      </p>

                      {/* Key Route Deliverables / Milestones */}
                      <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
                        <h4 className="text-[11px] uppercase tracking-wider text-zinc-800 dark:text-zinc-300 font-bold mb-3 flex items-center gap-1.5">
                          <FiTrendingUp className="text-blue-500" />
                          <span>Key Impact & Milestones</span>
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-sm shadow-blue-500/50"></span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Empty Spacer on opposite side for symmetrical layout */}
                  <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Experience;

