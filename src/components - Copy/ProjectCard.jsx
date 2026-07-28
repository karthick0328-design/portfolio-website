import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiFolder } from 'react-icons/fi';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass-card flex flex-col h-full group relative overflow-hidden bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-500 rounded-3xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Image Area */}
      <div className="relative h-48 w-full overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-0">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-20"></div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative z-10 w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover:border-blue-500/50 transition-colors"
            >
              <FiFolder className="text-4xl text-blue-500" />
            </motion.div>
          </>
        )}
      </div>
      
      <div className="p-8 flex-grow flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm leading-relaxed flex-grow">
          {project.description}
        </p>
        
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-blue-500"></span> Key Features
          </h4>
          <ul className="space-y-2">
            {project.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="text-blue-500 mt-0.5">▹</span>
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
          {project.technologies.map((tech, idx) => (
            <span key={idx} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
