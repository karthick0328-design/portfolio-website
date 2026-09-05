import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiZap, FiCode, FiArrowRight } from 'react-icons/fi';

const ProjectCard = ({ project }) => {
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
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 group-hover:filter group-hover:brightness-95"
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
          <a
            href={isGithubRepo ? project.github : 'https://github.com/karthick0328-design'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white shadow-xl border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-xs font-bold px-5"
            title="View Source on GitHub"
          >
            <FiGithub className="text-base text-blue-400" /> View Repository
          </a>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-7 flex-grow flex flex-col relative z-10 bg-transparent">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">
            {project.title}
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

        {/* Action Button Footer */}
        <div className="pt-2">
          <a
            href={isGithubRepo ? project.github : 'https://github.com/karthick0328-design'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-zinc-900 dark:bg-zinc-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white font-semibold text-xs border border-zinc-800 dark:border-zinc-700 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-blue-500/25 active:scale-[0.98] group/btn"
          >
            <FiGithub className="text-base text-blue-400 group-hover/btn:text-white transition-colors" />
            <span>View Source Code on GitHub</span>
            <FiArrowRight className="text-sm group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;


