import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from '../../pages/Home';
import About from '../../pages/About';
import Skills from '../../pages/Skills';
import Experience from '../../pages/Experience';
import Projects from '../../pages/Projects';
import Education from '../../pages/Education';
import Resume from '../../pages/Resume';
import Contact from '../../pages/Contact';
import FAQ from '../../pages/FAQ';
import CaseStudies from '../../pages/CaseStudies';

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
      <Route path="/faq" element={<FAQ />} />
      <Route path="/casestudies" element={<CaseStudies />} />
    </Routes>
  );
};

export default AnimatedRoutes;
