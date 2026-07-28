import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ title, subtitle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <div className="w-24 h-1 bg-primary dark:bg-accent mx-auto rounded-full mb-4"></div>
      )}
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
