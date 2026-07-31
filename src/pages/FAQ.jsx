import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { FiChevronDown } from 'react-icons/fi';

const FAQ = () => {
  const { faq } = portfolioData;
  const [openId, setOpenId] = useState(null);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">
        <SectionHeading title="Frequently Asked Questions" subtitle="Some common questions I get asked." />
        
        <div className="mt-16 space-y-4">
          {faq.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={item.id} 
              className="glass-card border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 rounded-xl overflow-hidden"
            >
              <button 
                onClick={() => toggleOpen(item.id)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">{item.question}</span>
                <FiChevronDown className={`transform transition-transform duration-300 text-zinc-500 dark:text-zinc-400 ${openId === item.id ? 'rotate-180' : ''}`} size={20} />
              </button>
              
              <AnimatePresence>
                {openId === item.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 pt-0 text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200 dark:border-zinc-800/50 mt-2 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
