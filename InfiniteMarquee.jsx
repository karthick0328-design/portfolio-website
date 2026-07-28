import React from 'react';
import { motion } from 'framer-motion';

const InfiniteMarquee = ({ items, direction = 'left', speed = 40 }) => {
  // Duplicate items to ensure smooth infinite scrolling
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative flex overflow-hidden w-full py-4 fade-edges">
      <motion.div
        className="flex whitespace-nowrap gap-4 shrink-0"
        animate={{ 
          x: direction === 'left' ? [0, -1035] : [-1035, 0] 
        }}
        transition={{ 
          ease: "linear", 
          duration: speed, 
          repeat: Infinity 
        }}
      >
        {marqueeItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-6 py-3 bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full text-zinc-800 dark:text-zinc-200 font-medium whitespace-nowrap hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors backdrop-blur-sm"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteMarquee;
