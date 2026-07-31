import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';

const CaseStudies = () => {
  const { caseStudies } = portfolioData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-5xl">
        <SectionHeading title="UI/UX Case Studies" subtitle="Deep dive into my design process and problem-solving." />
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 space-y-16"
        >
          {caseStudies.map((study, index) => (
            <motion.div key={study.id} variants={item} className="flex flex-col lg:flex-row gap-10 items-center">
              <div className={`w-full lg:w-1/2 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="rounded-2xl overflow-hidden glass-card border border-zinc-200 dark:border-white/10 relative group">
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={study.image} alt={study.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              
              <div className={`w-full lg:w-1/2 flex flex-col justify-center ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <span className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-2">{study.role}</span>
                <h3 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">{study.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg leading-relaxed">
                  {study.description}
                </p>
                
                <a href={study.link} className="inline-flex items-center gap-2 text-zinc-900 dark:text-white font-medium hover:text-blue-500 dark:hover:text-blue-400 transition-colors self-start pb-1 border-b-2 border-blue-500">
                  View Full Case Study
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CaseStudies;
