import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import SectionHeading from '../components/SectionHeading';
import { FiSend, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import MagneticButton from '../components/ui/MagneticButton';
import { portfolioData } from '../data/portfolioData';

const Contact = () => {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceID = 'service_7zhwkid';
    const templateID = 'template_i7em32d';
    const publicKey = 'A0ZK2jOkKkHNn09hb';

    emailjs.sendForm(serviceID, templateID, formRef.current, {
      publicKey: publicKey,
    })
      .then((result) => {
          setIsSubmitting(false);
          toast.success('Message sent successfully! I will get back to you soon.');
          formRef.current.reset();
      }, (error) => {
          console.error("EmailJS Error Details:", error);
          setIsSubmitting(false);
          toast.error(`Failed to send: ${error.text || 'Check console for details'}`);
      });
  };

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading title="Let's Connect" subtitle="Have a question or want to work together?" />
        
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 mt-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="w-full lg:w-5/12"
          >
            <div className="glass-card p-10 h-full border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <h3 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">Get in Touch</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-10 text-lg leading-relaxed">
                I'm currently open to new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <FiMail size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${portfolioData.personalInfo.email}`} className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors break-all">
                      {portfolioData.personalInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mb-1">Location</p>
                    <p className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white break-words">
                      {portfolioData.personalInfo.location}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                 <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mb-6">Connect</p>
                 <div className="flex space-x-4">
                   <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all">
                     <FiGithub size={20} />
                   </a>
                   <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-blue-500 hover:text-white transition-all">
                     <FiLinkedin size={20} />
                   </a>
                 </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-full lg:w-7/12"
          >
            <div className="glass-card p-10 h-full border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 relative">
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 relative z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="user_name" 
                      id="user_name" 
                      required
                      className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-0 focus:border-blue-500 transition-colors placeholder-transparent"
                      placeholder="Name"
                    />
                    <label htmlFor="user_name" className="absolute left-0 -top-3.5 text-sm text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500">
                      Your Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input 
                      type="email" 
                      name="user_email" 
                      id="user_email" 
                      required
                      className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-0 focus:border-blue-500 transition-colors placeholder-transparent"
                      placeholder="Email"
                    />
                    <label htmlFor="user_email" className="absolute left-0 -top-3.5 text-sm text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500">
                      Your Email
                    </label>
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="text" 
                    name="subject" 
                    id="subject" 
                    required
                    className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-0 focus:border-blue-500 transition-colors placeholder-transparent"
                    placeholder="Subject"
                  />
                  <label htmlFor="subject" className="absolute left-0 -top-3.5 text-sm text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500">
                    Subject
                  </label>
                </div>

                <div className="relative group pt-4">
                  <textarea 
                    name="message" 
                    id="message" 
                    rows="4"
                    required
                    className="peer w-full px-4 py-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-0 transition-all resize-none placeholder-zinc-400 dark:placeholder-zinc-500"
                    placeholder="How can I help you?"
                  ></textarea>
                </div>

                <MagneticButton 
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl bg-blue-600 text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <FiSend size={18} />}
                </MagneticButton>
                
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default Contact;
