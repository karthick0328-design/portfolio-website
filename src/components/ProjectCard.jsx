import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiZap, FiGlobe, FiCode } from 'react-icons/fi';

const ProjectCard = ({ project }) => {
  const isExternalLive = project.live && project.live !== '#';
  const isGithubRepo = project.github && project.github !== '#';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
    >
      {/* Ambient Gradient Glow on Card Hover */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-cyan-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      {/* Header Banner / Visual Area */}
      <div className="relative h-52 w-full overflow-hidden bg-zinc-950 flex items-center justify-center z-10">
        {project.image ? (
          <>
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108 group-hover:filter group-hover:brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${project.gradient || 'from-blue-600 to-indigo-700'} p-6 flex flex-col justify-between relative overflow-hidden`}>
            {/* Tech grid background illustration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40"></div>
            <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-inner">
                <FiCode className="text-xl" />
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white/90 border border-white/10">
                {project.technologies?.[0] || 'Modern Stack'}
              </span>
            </div>

            <div className="relative z-10">
              <div className="text-xl font-black text-white tracking-tight drop-shadow-md">
                {project.title}
              </div>
            </div>
          </div>
        )}

        {/* Top Badges (Category & Status) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          {project.category && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-zinc-900/80 dark:bg-black/80 backdrop-blur-md text-blue-400 border border-blue-500/30 shadow-md">
              {project.category}
            </span>
          )}
          {project.status && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {project.status}
            </span>
          )}
        </div>

        {/* Quick Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          {isExternalLive && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 flex items-center gap-1.5 text-xs font-bold px-4"
              title="Open Live Website"
            >
              <FiGlobe className="text-base" /> Live Demo
            </a>
          )}
          {isGithubRepo && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 flex items-center gap-1.5 text-xs font-bold px-4"
              title="View Source on GitHub"
            >
              <FiGithub className="text-base" /> GitHub
            </a>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-7 flex-grow flex flex-col relative z-10 bg-transparent">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors flex items-center justify-between gap-2">
            <span>{project.title}</span>
            {isExternalLive && (
              <a 
                href={project.live} 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-400 transition-opacity"
              >
                <FiExternalLink className="text-base" />
              </a>
            )}
          </h3>
        </div>

        {/* Description */}
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Key Features Highlights */}
        {project.features && project.features.length > 0 && (
          <div className="mb-6">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300 mb-2.5 flex items-center gap-1.5">
              <FiZap className="text-blue-500 text-xs" />
              <span>Core Highlights</span>
            </h4>
            <ul className="space-y-1.5">
              {project.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 flex-shrink-0"></span>
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 mb-5">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700/60 transition-colors hover:border-blue-500/40"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons Footer */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {isExternalLive ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md hover:shadow-blue-500/25 active:scale-95"
            >
              <FiGlobe className="text-sm" /> Live Demo
            </a>
          ) : (
            <div className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 font-medium text-xs cursor-not-allowed">
              Internal Tool
            </div>
          )}

          {isGithubRepo ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-300 dark:border-zinc-700 transition-all active:scale-95"
            >
              <FiGithub className="text-sm" /> View Code
            </a>
          ) : (
            <a
              href="https://github.com/karthick0328-design"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-300 dark:border-zinc-700 transition-all active:scale-95"
            >
              <FiGithub className="text-sm" /> GitHub Profile
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;

