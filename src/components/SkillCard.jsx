import React from 'react';
import { motion } from 'framer-motion';

const SkillCard = ({ title, skills }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card p-8 h-full"
    >
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:text-secondary transition-all"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillCard;
