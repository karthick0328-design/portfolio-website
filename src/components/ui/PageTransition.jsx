import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  // Use a simpler, faster transition for mobile to prevent lag
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isMobile ? 0 : -20 }}
      transition={{ duration: isMobile ? 0.2 : 0.4, ease: "easeOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
