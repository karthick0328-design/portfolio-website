import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { portfolioData } from '../data/portfolioData';
import { 
  FiSearch, 
  FiGithub, 
  FiArrowRight, 
  FiChevronLeft, 
  FiChevronRight, 
  FiPlay, 
  FiPause, 
  FiGrid, 
  FiSliders,
  FiMessageSquare
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
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState('showcase'); // 'showcase' | 'grid'
  const [direction, setDirection] = useState(1);

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
        (project.features && project.features.some((feat) => feat.toLowerCase().includes(query))) ||
        (project.toolsAndFeaturesText && project.toolsAndFeaturesText.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Reset active slide if filtered projects change
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [selectedCategory, searchQuery]);

  const totalSlides = filteredProjects.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(1);
    setActiveSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(-1);
    setActiveSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setDirection(index > activeSlideIndex ? 1 : -1);
    setActiveSlideIndex(index);
  };

  // Autoplay slider (every 4.5 seconds)
  useEffect(() => {
    if (!isPlaying || isHovered || viewMode !== 'showcase' || totalSlides <= 1) {
      return;
    }

    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, viewMode, totalSlides, nextSlide]);

  // Current active project in showcase mode
  const currentProject = filteredProjects[activeSlideIndex] || filteredProjects[0] || projects[0];

  return (
    <div id="projects" className="min-h-screen pt-24 pb-28 relative overflow-hidden bg-white dark:bg-[#070a12] text-zinc-900 dark:text-white transition-colors duration-300">
      {/* Deep Atmospheric Backdrop Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-purple-200/40 via-indigo-200/30 to-blue-200/20 dark:from-purple-900/15 dark:via-indigo-900/15 dark:to-blue-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-0 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <SectionHeading
          title="Featured Projects"
          subtitle="Explore selected production systems, AI platforms, and creative web applications."
        />

        {/* Toolbar: Category Filters, Search & View Mode */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mb-10 mt-10">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-zinc-100/90 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/90 dark:border-white/10 shadow-inner">
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
                      layoutId="activeProjCategory"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-blue-500/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input & View Mode Toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="relative w-full sm:w-64 lg:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or stack..."
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-xl bg-white dark:bg-white/5 backdrop-blur-md border border-zinc-200/90 dark:border-white/10 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-100/90 dark:bg-white/5 border border-zinc-200/90 dark:border-white/10">
              <button
                onClick={() => setViewMode('showcase')}
                title="Featured Showcase Slider"
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'showcase'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <FiSliders className="text-sm" />
                <span className="hidden sm:inline">Showcase</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
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

        {/* ===================== FEATURED SHOWCASE SLIDER VIEW ===================== */}
        {filteredProjects.length > 0 ? (
          viewMode === 'showcase' ? (
            <div
              className="relative w-full my-6 select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Outer Left Circular Navigation Button */}
              {totalSlides > 1 && (
                <button
                  onClick={prevSlide}
                  className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-white/95 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-white/15 backdrop-blur-xl shadow-xl dark:shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105 group"
                  aria-label="Previous project"
                >
                  <FiChevronLeft className="text-xl group-hover:-translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Outer Right Circular Navigation Button */}
              {totalSlides > 1 && (
                <button
                  onClick={nextSlide}
                  className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-white/95 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-white/15 backdrop-blur-xl shadow-xl dark:shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105 group"
                  aria-label="Next project"
                >
                  <FiChevronRight className="text-xl group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Slide Card Container */}
              <div className="relative min-h-[540px] md:min-h-[500px] w-full rounded-3xl bg-zinc-50/90 dark:bg-[#090D16]/90 border border-zinc-200/90 dark:border-white/10 backdrop-blur-2xl shadow-xl dark:shadow-2xl p-6 sm:p-8 md:p-12 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentProject.id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                  >
                    {/* LEFT COLUMN: Number, Title, Subtitle, Tools & Features */}
                    <div className="lg:col-span-5 flex flex-col justify-center text-left">
                      {/* Top Header Row with Big Number & Title */}
                      <div className="flex items-start gap-4 md:gap-6">
                        <span className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-tight select-none leading-none ${currentProject.numberColor || 'text-zinc-300 dark:text-zinc-500/35'}`}>
                          {currentProject.number || `0${activeSlideIndex + 1}`}
                        </span>
                        <div className="flex flex-col">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            {currentProject.shortTitle || currentProject.title.split('-')[0].trim()}
                          </h3>
                          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-medium mt-1">
                            {currentProject.subtitle || currentProject.title}
                          </p>
                        </div>
                      </div>

                      {/* TOOLS & FEATURES Metadata Section */}
                      <div className="mt-8 md:mt-10">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                          TOOLS & FEATURES
                        </h4>
                        <p className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
                          {currentProject.toolsAndFeaturesText || currentProject.technologies.join(', ')}
                        </p>
                      </div>

                      {/* Project Description Highlights */}
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-4 leading-relaxed line-clamp-3">
                        {currentProject.description}
                      </p>

                      {/* Action Links Bar */}
                      <div className="flex flex-wrap items-center gap-3 mt-8">
                        {currentProject.github && currentProject.github !== '#' && (
                          <a
                            href={currentProject.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs md:text-sm shadow-md transition-all hover:scale-105 active:scale-95 group/btn"
                          >
                            <FiGithub className="text-base" />
                            <span>View Source Code</span>
                            <FiArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Ultra-Sleek Product & UI Mockup Card with Dynamic Project Color */}
                    <div className="lg:col-span-7">
                      <div className={`relative rounded-2xl md:rounded-3xl border ${currentProject.accentBorder || 'border-zinc-200 dark:border-white/15'} bg-white dark:bg-[#0b0f19] shadow-2xl overflow-hidden group/mockup transition-all duration-500`}>
                        {/* Dynamic Atmospheric Gradient Background Mesh matching project */}
                        <div className={`absolute top-0 left-0 right-0 h-72 bg-gradient-to-br ${currentProject.glowColor || 'from-purple-700/30 via-indigo-900/25 to-transparent'} blur-2xl pointer-events-none transition-all duration-700`} />

                        {/* Top Mockup Browser / App Navigation Bar */}
                        <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-white/10 bg-zinc-100/90 dark:bg-black/40 backdrop-blur-md text-xs text-zinc-600 dark:text-zinc-400">
                          {/* Brand / Title Dot */}
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${currentProject.pillBadge || 'bg-blue-500'} shadow-sm animate-pulse`}></span>
                            <span className="font-bold text-zinc-900 dark:text-white text-xs tracking-wide">
                              {currentProject.navBrand || `${currentProject.shortTitle}.app`}
                            </span>
                          </div>

                          {/* Navigation Links */}
                          <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                            <span className="text-zinc-900 dark:text-white font-semibold">Home</span>
                            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">Services</span>
                            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">Features</span>
                            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">Integrations</span>
                            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">Pricing</span>
                            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">Docs</span>
                          </div>

                          {/* Code Repository Action Pill */}
                          <a
                            href={currentProject.github || 'https://github.com/karthick0328-design'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-3 py-1 rounded-md bg-gradient-to-r ${currentProject.btnGradient || 'from-blue-600 to-indigo-600'} text-white text-[11px] font-semibold transition-all hover:opacity-90 shadow-sm flex items-center gap-1`}
                          >
                            <FiGithub className="text-[10px]" />
                            <span>Code</span>
                          </a>
                        </div>

                        {/* Main Mockup Hero Area */}
                        <div className="relative z-10 p-6 md:p-8 flex flex-col items-center text-center">
                          {/* Main Hero Headline with Project Highlight Accent */}
                          <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight max-w-lg leading-snug">
                            {currentProject.mockupHighlight ? (
                              <>
                                {currentProject.mockupHeadline.split(currentProject.mockupHighlight)[0]}
                                <span className={`bg-gradient-to-r ${currentProject.gradient || 'from-purple-500 to-indigo-500'} bg-clip-text text-transparent`}>
                                  {currentProject.mockupHighlight}
                                </span>
                                {currentProject.mockupHeadline.split(currentProject.mockupHighlight)[1]}
                              </>
                            ) : (
                              currentProject.mockupHeadline || currentProject.title
                            )}
                          </h4>

                          {/* Feature Badges / Highlights */}
                          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-xs text-zinc-700 dark:text-zinc-300">
                            {currentProject.mockupPills ? (
                              currentProject.mockupPills.map((pill, idx) => (
                                <span key={idx} className="flex items-center gap-1.5 font-medium">
                                  <span>{pill.icon}</span>
                                  <span>{pill.text}</span>
                                </span>
                              ))
                            ) : (
                              <>
                                <span className="flex items-center gap-1.5 font-medium">
                                  <span>🔊</span> Human-like Interaction
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                  <span>🎙️</span> Real-time Audio
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                  <span>⚡</span> Interactive Waves
                                </span>
                              </>
                            )}
                          </div>

                          {/* Guarantees / Status Pill */}
                          <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-300/90">
                            <span>💡</span>
                            <span>{currentProject.badgeText || "High Speed Engine - Zero Watermark"}</span>
                          </div>

                          {/* Bottom Layered Dashboard with Real Project Image Fully Covering Space */}
                          <div className="w-full mt-6 rounded-2xl border border-zinc-200 dark:border-white/15 bg-zinc-100/90 dark:bg-zinc-950 p-2.5 sm:p-3.5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                            {/* Floating Heart / Notification Pill */}
                            <div className="absolute top-2.5 left-5 z-20 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center gap-1 shadow-lg shadow-rose-500/30 transform -rotate-3">
                              <span>❤️</span>
                              <span>20</span>
                            </div>

                            {/* Inner Dashboard Layer showcasing real project image with expansive full coverage */}
                            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-inner flex flex-col gap-2 text-left h-64 sm:h-72 md:h-80 overflow-hidden relative group/img">
                              {/* Dashboard Top Header Bar */}
                              <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-black/60 backdrop-blur-md z-10">
                                <div className="flex items-center gap-2">
                                  <span className={`font-extrabold text-xs ${currentProject.brandColor || 'text-purple-600 dark:text-purple-400'} flex items-center gap-1`}>
                                    <span className={`w-2 h-2 rounded-full ${currentProject.pillBadge || 'bg-purple-500'} inline-block`}></span>
                                    {currentProject.navBrand || `${currentProject.shortTitle}.app`}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden sm:inline truncate max-w-xs">
                                    Hi {currentProject.dashboardUser || 'Karthick'}, Welcome to {currentProject.shortTitle} Dashboard
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 text-[9px] text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/10">
                                    <span>🔍</span>
                                    <span>Type people and groups...</span>
                                  </div>
                                  <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${currentProject.gradient || 'from-blue-600 to-indigo-600'} text-white flex items-center justify-center text-[9px] font-bold shadow-sm`}>
                                    {currentProject.dashboardUser?.[0] || 'K'}
                                  </div>
                                </div>
                              </div>

                              {/* Real Image Canvas / Layer covering the full space */}
                              <div className="relative w-full h-full overflow-hidden rounded-b-lg">
                                {currentProject.image ? (
                                  <>
                                    <img
                                      src={currentProject.image}
                                      alt={currentProject.title}
                                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/img:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />
                                  </>
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-br ${currentProject.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                                    {currentProject.title}
                                  </div>
                                )}

                                {/* Overlay Status Bar inside the image */}
                                <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10 shadow-sm">
                                    {currentProject.category}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 shadow-sm">
                                    {currentProject.status || 'Live'}
                                  </span>
                                </div>
                              </div>

                              {/* Floating Support AI Widget Bubble matching project theme */}
                              <div className="absolute bottom-2.5 right-2.5 sm:right-3.5 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-[10px] sm:text-[11px] font-bold shadow-xl border border-zinc-200 dark:border-zinc-700 hover:scale-105 transition-transform cursor-pointer">
                                <span>Have a quick question?</span>
                                <span className={`${currentProject.bubbleColor || 'text-purple-600 dark:text-purple-400'} flex items-center gap-1 font-extrabold`}>
                                  Talk with {currentProject.supportAgent || 'Voice AI'} <FiMessageSquare className="text-xs" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Carousel Controls & Indicator Dots */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
                {/* Autoplay Play/Pause Status */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-100/90 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 transition-colors shadow-sm"
                  title={isPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
                >
                  {isPlaying ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <FiPause className="text-xs text-emerald-500" />
                      <span>Auto-moving</span>
                    </>
                  ) : (
                    <>
                      <FiPlay className="text-xs text-blue-500" />
                      <span>Paused</span>
                    </>
                  )}
                </button>

                {/* Progress Indicator Dots */}
                <div className="flex items-center gap-2">
                  {filteredProjects.map((proj, idx) => (
                    <button
                      key={proj.id}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeSlideIndex === idx
                          ? 'w-8 bg-gradient-to-r from-blue-500 to-indigo-500'
                          : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Slide Count Indicator */}
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <span className="text-zinc-900 dark:text-white font-bold">{activeSlideIndex + 1}</span> / {totalSlides}
                </div>
              </div>
            </div>
          ) : (
            /* ===================== GRID VIEW ===================== */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8 py-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="h-full">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )
        ) : (
          /* Empty Search Filter State */
          <div className="p-12 text-center rounded-3xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200 dark:border-white/10 max-w-lg mx-auto mt-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No projects found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              No projects matched your filter query &quot;{searchQuery}&quot;. Try searching for &quot;React&quot;, &quot;AI&quot;, &quot;Voice&quot;, or &quot;Full Stack&quot;.
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
          className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-950/60 dark:via-zinc-900/80 dark:to-indigo-950/60 backdrop-blur-2xl border border-blue-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl relative overflow-hidden"
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



