import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { portfolioData } from '../data/portfolioData';
import { FiSearch, FiGithub, FiLayers, FiArrowRight } from 'react-icons/fi';

const categories = [
  'All Projects',
  'AI & Full Stack',
  'Web Applications',
  'UI/UX & Frontend',
  '3D & Creative Tech'
];

const Projects = () => {
  const { projects } = portfolioData;
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All Projects' || project.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query)) ||
        (project.features && project.features.some((feat) => feat.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const liveProjectsCount = useMemo(() => {
    return projects.filter((p) => p.live && p.live.startsWith('http')).length;
  }, [projects]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 16 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div id="projects" className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-10 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-10 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading
          title="Featured Projects"
          subtitle="Explore my complete portfolio of live web applications, AI tools, 3D experiences, and open-source contributions."
        />

        {/* Quick Highlights / Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10 mb-12">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400">{projects.length}+</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">Showcased Projects</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">{liveProjectsCount}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">Live Deployments</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400">10+</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">Tech Frameworks</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-black text-cyan-600 dark:text-cyan-400">100%</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">Open Source / Active</div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBadge"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech, stack, or title..."
              className="w-full pl-9 pr-4 py-2.5 text-xs md:text-sm rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white placeholder-zinc-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results status */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <FiLayers className="text-blue-500" />
            <span>
              Showing <strong className="text-zinc-900 dark:text-white">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Projects');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={item}
                  layout
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-12 text-center rounded-3xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 max-w-lg mx-auto mt-8"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                No projects matched your filter query &quot;{searchQuery}&quot;. Try searching for &quot;React&quot;, &quot;AI&quot;, &quot;3D&quot;, or &quot;TypeScript&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Projects');
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Show All Projects
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GitHub Callout Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 dark:from-blue-950/60 dark:via-zinc-900/80 dark:to-indigo-950/60 backdrop-blur-2xl border border-blue-500/20 dark:border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
                <FiGithub className="text-sm" /> Open Source & Repositories
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Explore More on GitHub
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm mt-2 leading-relaxed">
                Check out active repositories, experiments, open-source libraries, and collaborative projects on my GitHub profile{' '}
                <strong className="text-blue-600 dark:text-blue-400">@karthick0328-design</strong>.
              </p>
            </div>

            <a
              href="https://github.com/karthick0328-design"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm hover:scale-105 transition-all shadow-xl hover:shadow-2xl flex-shrink-0 group"
            >
              <FiGithub className="text-lg" />
              <span>Visit GitHub Profile</span>
              <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;

