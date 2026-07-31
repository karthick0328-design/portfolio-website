import React from 'react';
import SectionHeading from '../components/SectionHeading';
import InfiniteMarquee from '../components/ui/InfiniteMarquee';
import { portfolioData } from '../data/portfolioData';

const Skills = () => {
  const { skills } = portfolioData;

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="hidden md:block absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="hidden md:block absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="My Skills" subtitle="Technologies and tools I work with." />
        
        <div className="flex flex-col gap-12 mt-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white pl-4 border-l-4 border-blue-500">Frontend Development</h3>
            <InfiniteMarquee items={skills.frontend} direction="left" speed={30} />
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white pl-4 border-l-4 border-purple-500">Backend Development</h3>
            <InfiniteMarquee items={skills.backend} direction="right" speed={35} />
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white pl-4 border-l-4 border-cyan-400">Database</h3>
            <InfiniteMarquee items={skills.database} direction="left" speed={40} />
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white pl-4 border-l-4 border-green-400">Tools & Platforms</h3>
            <InfiniteMarquee items={skills.tools} direction="right" speed={25} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white pl-4 border-l-4 border-pink-500">UI/UX Design</h3>
            <InfiniteMarquee items={skills.uiux} direction="left" speed={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
