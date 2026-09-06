import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { 
  FiNavigation, 
  FiClock, 
  FiCheckCircle,
  FiFlag,
  FiBookOpen
} from 'react-icons/fi';
import { FaCarSide, FaUniversity } from 'react-icons/fa';

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

  const academicSpecializations = {
    1: [
      "Data Structures & Object-Oriented Programming (OOP)",
      "Core Algorithms & Computational Complexity",
      "Relational Database Management Systems (RDBMS & SQL)",
      "Web Technologies, JavaScript & Frontend Fundamentals"
    ],
    2: [
      "Advanced Full Stack Web Architecture & Frameworks",
      "Cloud Computing, Distributed Systems & Microservices",
      "Artificial Intelligence & Machine Learning Foundations",
      "Software System Design & Engineering Methodologies"
    ]
  };

  return (
    <div id="education" className="min-h-screen pt-24 pb-28 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-1/4 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Topographic Road Map Grid Overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 max-w-5xl">
        <SectionHeading 
          title="Education" 
          subtitle="My academic background & qualifications" 
        />

        {/* Visual Highway Road Timeline */}
        <div className="relative mt-8">
          {/* Real Highway Road Asphalt Track (Center on Desktop, Left on Mobile) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 md:w-20 bg-zinc-900 border-x-4 border-zinc-700 rounded-3xl flex flex-col items-center justify-between shadow-2xl z-0 pointer-events-none overflow-hidden">
            {/* White Shoulder Solid Lines */}
            <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-white/40" />
            <div className="absolute right-1.5 top-0 bottom-0 w-1 bg-white/40" />

            {/* Animated Moving Yellow Dashed Center Line */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 overflow-hidden flex flex-col items-center">
              <motion.div 
                animate={{ y: ["-50%", "0%"] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="w-full flex flex-col items-center gap-6 py-2"
                style={{ height: "200%" }}
              >
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="w-1.5 h-10 bg-amber-400 rounded-sm shrink-0 shadow-sm shadow-amber-400/50" />
                ))}
              </motion.div>
            </div>

            {/* Car that smoothly drives down the entire length of the roadmap */}
            <motion.div 
              animate={{ 
                top: ["2%", "35%", "70%", "94%", "2%"]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.35, 0.7, 0.95, 1]
              }}
              className="absolute left-1/2 -translate-x-1/2 w-8 h-14 bg-gradient-to-b from-purple-500 to-indigo-700 rounded-xl shadow-xl shadow-purple-500/60 flex flex-col items-center justify-between py-1.5 border-2 border-purple-300 z-10"
            >
              {/* Headlight Beams */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-10 bg-gradient-to-b from-yellow-300/40 to-transparent blur-[3px] pointer-events-none" />
              
              {/* Front Headlights */}
              <div className="flex justify-between w-full px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-200 shadow-md shadow-yellow-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-200 shadow-md shadow-yellow-200" />
              </div>

              {/* Windshield & Car Body Icon */}
              <FaCarSide className="text-xs text-white rotate-90" />

              {/* Rear Taillights */}
              <div className="flex justify-between w-full px-1">
                <div className="w-1.5 h-1 rounded-sm bg-red-500 shadow-sm shadow-red-500" />
                <div className="w-1.5 h-1 rounded-sm bg-red-500 shadow-sm shadow-red-500" />
              </div>
            </motion.div>
          </div>

          {/* Road Start Marker */}
          <div className="flex justify-center md:justify-center mb-12 pl-12 md:pl-0 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/30">
              <FiFlag className="text-sm" /> Academic Origin Checkpoint // 2020
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
            className="space-y-16 md:space-y-20 relative z-10"
          >
            {education.map((edu, index) => {
              const isEven = index % 2 === 0;
              const specializations = academicSpecializations[edu.id] || [];

              return (
                <motion.div 
                  key={edu.id} 
                  variants={item}
                  className={`flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-14 relative`}
                >
                  {/* Waypoint GPS Landmark Pin on the Road */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 z-20 flex flex-col items-center">
                    <div className="relative w-14 h-14 rounded-2xl bg-zinc-900 border-2 border-purple-400 shadow-2xl shadow-purple-400/30 flex flex-col items-center justify-center text-white">
                      <div className="text-[9px] font-black uppercase text-purple-400 tracking-tighter">STOP</div>
                      <span className="text-white font-black text-sm">0{index + 1}</span>
                      {/* Sonar Radar Pulse */}
                      <div className="absolute -inset-1.5 rounded-2xl bg-purple-400/25 animate-ping opacity-75 pointer-events-none" />
                    </div>
                  </div>

                  {/* Waypoint Content Road Card */}
                  <div className={`w-full md:w-[calc(50%-3.5rem)] pl-16 md:pl-0 ${isEven ? 'md:pr-4' : 'md:pl-4'}`}>
                    <div className="group relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 p-6 md:p-8">
                      {/* Highway Signboard Header Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        {/* Highway Exit Sign */}
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-600/30 border border-purple-400">
                            <FiNavigation className="rotate-45" /> EXIT #{index + 1}
                          </span>
                          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                            {index === 0 ? 'Undergraduate Degree' : 'Postgraduate Degree'}
                          </span>
                        </div>

                        {/* Timeline Milepost */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">
                          <FiClock />
                          <span>{edu.year}</span>
                        </div>
                      </div>

                      {/* Degree & Institution Road Sign */}
                      <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {edu.degree}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-purple-600 dark:text-purple-400 font-bold text-sm md:text-base">
                          <FaUniversity className="shrink-0 text-purple-500" />
                          <span>{edu.institution}</span>
                        </div>
                      </div>

                      {/* Key Academic Specializations / Focus Modules */}
                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                        <h4 className="text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-black mb-3 flex items-center gap-2">
                          <FiBookOpen className="text-purple-500 text-sm" />
                          <span>Key Focus & Core Competencies</span>
                        </h4>
                        <ul className="space-y-2.5">
                          {specializations.map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                              <FiCheckCircle className="text-purple-500 mt-0.5 shrink-0 text-sm" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Empty Spacer on opposite side for symmetrical layout */}
                  <div className="hidden md:block md:w-[calc(50%-3.5rem)]" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Road Destination / Next Horizon Pin */}
          <div className="flex justify-center md:justify-center mt-12 pl-12 md:pl-0 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/30 border border-purple-400">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" /> Academic Milestone Complete // Ready for Professional Engineering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
