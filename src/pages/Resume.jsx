import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { FiDownload, FiBriefcase, FiBookOpen, FiCode } from 'react-icons/fi';
import MagneticButton from '../components/ui/MagneticButton';
import { portfolioData } from '../data/portfolioData';
import resumePdf from '../assets/my-resume.pdf';

const Resume = () => {
  const { experience, education, skills, personalInfo } = portfolioData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        <div className="md:flex md:justify-between md:items-end mb-16 gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-10">
          <div className="w-full">
            <SectionHeading title="Interactive Resume" subtitle="A quick overview of my qualifications." />
          </div>
          
          <div className="flex justify-center md:justify-end w-full md:w-auto mt-[-2rem] md:mt-0">
            <a href={resumePdf} download="Karthick_Pandi_Resume.pdf" className="shrink-0 w-full sm:w-auto">
              <MagneticButton className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <span>Download PDF</span>
                <FiDownload size={20} />
              </MagneticButton>
            </a>
          </div>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column: Experience */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={item} className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <FiBriefcase size={20} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Experience</h3>
            </motion.div>

            {experience.map((exp) => (
              <motion.div key={exp.id} variants={item} className="glass-card p-8 border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 relative group overflow-hidden hover:border-blue-500/30 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{exp.role}</h4>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full w-fit">
                    {exp.duration}
                  </span>
                </div>
                <h5 className="text-zinc-600 dark:text-zinc-400 font-medium mb-4">{exp.company}</h5>
                <ul className="space-y-2">
                  {exp.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div variants={item} className="flex items-center gap-3 mb-6 mt-12">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <FiBookOpen size={20} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Education</h3>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {education.map((edu) => (
                <motion.div key={edu.id} variants={item} className="glass-card p-6 border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2 block">{edu.year}</span>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 leading-tight">{edu.degree}</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">{edu.institution}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Skills & Info */}
          <div className="space-y-8">
            <motion.div variants={item} className="glass-card p-8 border border-zinc-200 dark:border-white/10 bg-zinc-900 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-20"></div>
              <h4 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
                <FiCode className="text-blue-400" /> Core Skills
              </h4>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <h5 className="text-sm text-zinc-400 uppercase tracking-wider mb-3">Frontend</h5>
                  <div className="flex flex-wrap gap-2">
                    {skills.frontend.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/10 rounded-md text-sm font-medium text-zinc-200">{skill}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm text-zinc-400 uppercase tracking-wider mb-3">Backend</h5>
                  <div className="flex flex-wrap gap-2">
                    {skills.backend.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/10 rounded-md text-sm font-medium text-zinc-200">{skill}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm text-zinc-400 uppercase tracking-wider mb-3">Database</h5>
                  <div className="flex flex-wrap gap-2">
                    {skills.database.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/10 rounded-md text-sm font-medium text-zinc-200">{skill}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm text-zinc-400 uppercase tracking-wider mb-3">Tools</h5>
                  <div className="flex flex-wrap gap-2">
                    {skills.tools.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/10 rounded-md text-sm font-medium text-zinc-200">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="glass-card p-8 border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40">
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Contact Info</h4>
              <ul className="space-y-4">
                <li>
                  <span className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Email</span>
                  <a href={`mailto:${personalInfo.email}`} className="text-zinc-900 dark:text-white font-medium hover:text-blue-500 transition-colors break-all">{personalInfo.email}</a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Location</span>
                  <span className="text-zinc-900 dark:text-white font-medium">{personalInfo.location}</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resume;
