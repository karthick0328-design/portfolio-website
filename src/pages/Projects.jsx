import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { portfolioData } from '../data/portfolioData';
import { 
  FiSearch, 
  FiGithub, 
  FiLayers, 
  FiArrowRight, 
  FiChevronLeft, 
  FiChevronRight, 
  FiPlay, 
  FiPause, 
  FiGrid 
} from 'react-icons/fi';

const categories = [
  'All Projects',
  'AI & Full Stack',
  'Web Applications',
  '3D & Creative Tech'
];

const Projects = () => {
  const { projects } = portfolioData;
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive cardsPerView detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1200) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Reset current index if filtered list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, searchQuery]);

  const maxIndex = Math.max(0, filteredProjects.length - cardsPerView);

  const nextSlide = useCallback(() => {
    if (filteredProjects.length <= cardsPerView) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [filteredProjects.length, cardsPerView, maxIndex]);

  const prevSlide = useCallback(() => {
    if (filteredProjects.length <= cardsPerView) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [filteredProjects.length, cardsPerView, maxIndex]);

  // Automatic moving one-by-one timer (every 3.2 seconds)
  useEffect(() => {
    if (!isPlaying || isHovered || viewMode !== 'carousel' || filteredProjects.length <= cardsPerView) {
      return;
    }

    const interval = setInterval(() => {
      nextSlide();
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, viewMode, filteredProjects.length, cardsPerView, nextSlide]);

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

        {/* Filter Controls, Search & Carousel Mode Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 mt-12">
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

          {/* Search Input & View Toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
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

            {/* View Mode Toggle (Auto Carousel / Full Grid) */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setViewMode('carousel')}
                title="Auto-sliding Carousel"
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <FiPlay className="text-sm" />
                <span className="hidden sm:inline">Slider</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Full Grid View"
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <FiGrid className="text-sm" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Top Navigation Bar & Status */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <FiLayers className="text-blue-500" />
            <span>
              Showing <strong className="text-zinc-900 dark:text-white">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          {viewMode === 'carousel' && filteredProjects.length > cardsPerView && (
            <div className="flex items-center gap-3">
              {/* Autoplay status / Pause button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-colors"
                title={isPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
              >
                {isPlaying ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <FiPause className="text-xs text-emerald-500" />
                    <span className="text-[11px] hidden sm:inline">Auto-moving</span>
                  </>
                ) : (
                  <>
                    <FiPlay className="text-xs text-blue-500" />
                    <span className="text-[11px] hidden sm:inline">Paused</span>
                  </>
                )}
              </button>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevSlide}
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all active:scale-90"
                  aria-label="Previous project"
                >
                  <FiChevronLeft className="text-base" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all active:scale-90"
                  aria-label="Next project"
                >
                  <FiChevronRight className="text-base" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Projects Display Area */}
        {filteredProjects.length > 0 ? (
          viewMode === 'carousel' ? (
            /* Automatic Sliding Carousel Track (Moves one by one) */
            <div
              className="relative w-full overflow-hidden py-4 -mx-3 px-3"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                className="flex"
                style={{
                  width: `${(filteredProjects.length * 100) / cardsPerView}%`
                }}
                animate={{
                  x: `-${(currentIndex * 100) / filteredProjects.length}%`
                }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 20,
                  mass: 0.9
                }}
              >
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="px-3 md:px-4 h-full flex-shrink-0"
                    style={{
                      width: `${100 / filteredProjects.length}%`
                    }}
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </motion.div>

              {/* Progress Dots Navigation */}
              {filteredProjects.length > cardsPerView && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx
                          ? 'w-8 bg-gradient-to-r from-blue-600 to-indigo-600'
                          : 'w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8 py-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="h-full">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="p-12 text-center rounded-3xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 max-w-lg mx-auto mt-8">
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
          </div>
        )}

        {/* GitHub Callout Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 dark:from-blue-950/60 dark:via-zinc-900/80 dark:to-indigo-950/60 backdrop-blur-2xl border border-blue-500/20 dark:border-white/10 shadow-2xl relative overflow-hidden"
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



