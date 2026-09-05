import React from 'react';
import HeroSection from './src/components/hero/HeroSection';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Education from './Education';
import Projects from './Projects';
import Resume from './Resume';
import Contact from './Contact';

const Home = () => {
  return (
    <>
      <HeroSection />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <Resume />
      <Contact />
    </>
  );
};

export default Home;
