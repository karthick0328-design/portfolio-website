import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from '../../pages/Home';
import About from '../../pages/About';
import Skills from '../../pages/Skills';
import Experience from '../../pages/Experience';
import Projects from '../../pages/Projects';
import Education from '../../pages/Education';
import Resume from '../../pages/Resume';
import Contact from '../../pages/Contact';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/education" element={<Education />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default AnimatedRoutes;
