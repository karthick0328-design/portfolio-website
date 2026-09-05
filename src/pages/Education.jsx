import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { 
  FiMapPin, 
  FiCalendar, 
  FiAward, 
  FiBookOpen, 
  FiCheckCircle, 
  FiArrowRight 
} from 'react-icons/fi';
import { FaGraduationCap, FaUniversity } from 'react-icons/fa';

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
      "Advanced Full Stack Web Architecture",
      "Cloud Computing & Distributed Databases",
      "AI & Machine Learning Foundations",
      "Software Design Patterns & System Design"
    ],
    2: [
      "Data Structures & Object-Oriented Programming",
      "Core Algorithms & Computational Logic",
      "Database Management Systems (RDBMS)",
      "Web Technologies & Frontend Development"
    ]
  };

  return (
    <div id="education" className="min-h-screen pt-24 pb-28 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 max-w-5xl">
        <SectionHeading 
          title="Education & Academic Pathway" 
          subtitle="The academic degrees, rigorous computer science foundations, and engineering milestones behind my technical skills." 
        />

        {/* Academic Pathway Header Banner */}
        <div className="mt-10 mb-16 p-5 md:p-6 rounded-3xl bg-zinc-900 text-white shadow-2xl border border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-transparent to-blue-950/40 pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-600/30 border border-purple-500/50 text-purple-400 shadow-lg shadow-purple-500/20">
                <FaGraduationCap className="text-2xl" />
              </div>
              <div>
                <div className="text-[11px] text-purple-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" /> ACADEMIC TIMELINE
                </div>
                <div className="text-zinc-100 font-extrabold text-base md:text-lg">
                  Computer Science & Engineering Foundation
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-2 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-2">
                <FiAward className="text-purple-400 text-sm" />
                <span>MCA + B.Sc Computer Science</span>
              </span>
            </div>
          </div>
        </div>

        {/* Education Pathway Milestone Cards */}
        <div className="relative mt-8">
          {/* Connecting Pathway Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-20 right-20 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full shadow-lg shadow-purple-500/30 z-0 pointer-events-none" />

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10"
          >
            {education.map((edu, index) => {
              const isFirst = index === 0;
              const specializations = academicSpecializations[edu.id] || [];

              return (
                <motion.div 
                  key={edu.id} 
                  variants={item}
                  className="relative flex flex-col group"
                >
                  {/* Milestone Step Header */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-xl ${isFirst ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'} text-xs font-black flex items-center justify-center shadow-lg`}>
                        0{index + 1}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {isFirst ? 'Master Specialization' : 'Undergraduate Origin'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      <FiMapPin className="text-purple-500" />
                      <span>Madurai, India</span>
                    </div>
                  </div>

                  {/* Main Academic Card */}
                  <div className="p-7 md:p-8 rounded-3xl relative overflow-hidden bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex-grow flex flex-col justify-between">
                    {/* Top ambient hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div>
                      {/* Duration Badge & Program Type */}
                      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">
                          <FiCalendar /> {edu.year}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {isFirst ? 'Postgraduate' : 'Graduate'}
                        </span>
                      </div>

                      {/* Degree Title */}
                      <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {edu.degree}
                      </h3>

                      {/* Institution Banner */}
                      <div className="flex items-center gap-2.5 mb-6 text-purple-600 dark:text-purple-400 font-bold text-sm">
                        <FaUniversity className="text-purple-500 shrink-0" />
                        <span>{edu.institution}</span>
                      </div>

                      {/* Core Specialization Modules */}
                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                        <h4 className="text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-black mb-3 flex items-center gap-2">
                          <FiBookOpen className="text-purple-500" />
                          <span>Key Focus Areas</span>
                        </h4>
                        <ul className="space-y-2">
                          {specializations.map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                              <FiCheckCircle className="text-purple-500 mt-0.5 shrink-0 text-sm" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer Milestone Completed Tag */}
                    <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <FiCheckCircle /> Completed with Distinction
                      </span>
                      <span className="font-mono text-[11px]">TN, India</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Academic Journey Flow Footer Banner */}
          <div className="mt-12 p-4 rounded-2xl bg-zinc-900 text-white border border-zinc-800 text-center flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm shadow-xl">
            <span className="font-black text-purple-400 flex items-center gap-1.5">
              <FaGraduationCap className="text-base" /> Academic Progression:
            </span>
            <span className="text-zinc-300">The American College (B.Sc CS)</span>
            <FiArrowRight className="text-purple-400" />
            <span className="text-zinc-300">KLN College of Engineering (MCA)</span>
            <FiArrowRight className="text-emerald-400" />
            <span className="text-emerald-400 font-bold">Full Stack Professional</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
