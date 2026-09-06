import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import SectionHeading from '../components/SectionHeading';
import { FiSend, FiGithub, FiLinkedin, FiMail, FiMapPin, FiCheckCircle, FiShield } from 'react-icons/fi';
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
    <div id="contact" className="min-h-screen pt-24 pb-24 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Background Glows */}
      <div className="hidden md:block absolute top-10 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-10 left-10 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Topographic Road Map Grid Overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 max-w-5xl">
        <SectionHeading title="Let's Connect" subtitle="Have a question or want to work together?" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-12 items-start">
          
          {/* Left Column: Contact Information */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
            className="w-full lg:col-span-5"
          >
            <div className="rounded-3xl p-6 sm:p-8 border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <h3 className="text-2xl sm:text-3xl font-black mb-4 text-zinc-900 dark:text-white tracking-tight">
                Get in Touch
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-sm sm:text-base leading-relaxed">
                I'm currently open to new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <FiMail size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Email</p>
                    <a href={`mailto:${portfolioData.personalInfo.email}`} className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">
                      {portfolioData.personalInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <FiMapPin size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white">
                      {portfolioData.personalInfo.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <FiCheckCircle size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Availability</p>
                    <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white">
                      {portfolioData.personalInfo.availability}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                 <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-4">Connect</p>
                 <div className="flex space-x-3">
                   <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all shadow-sm">
                     <FiGithub size={18} />
                   </a>
                   <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                     <FiLinkedin size={18} />
                   </a>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 90 }}
            className="w-full lg:col-span-7"
          >
            <div className="rounded-3xl p-6 sm:p-8 border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl relative">
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="user_name" 
                      id="user_name" 
                      required
                      className="peer w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-0 focus:border-blue-500 transition-colors placeholder-transparent text-sm sm:text-base"
                      placeholder="Name"
                    />
                    <label htmlFor="user_name" className="absolute left-0 -top-3 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 font-medium">
                      Your Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input 
                      type="email" 
                      name="user_email" 
                      id="user_email" 
                      required
                      className="peer w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-0 focus:border-blue-500 transition-colors placeholder-transparent text-sm sm:text-base"
                      placeholder="Email"
                    />
                    <label htmlFor="user_email" className="absolute left-0 -top-3 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 font-medium">
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
                    className="peer w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-0 focus:border-blue-500 transition-colors placeholder-transparent text-sm sm:text-base"
                    placeholder="Subject"
                  />
                  <label htmlFor="subject" className="absolute left-0 -top-3 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 font-medium">
                    Subject
                  </label>
                </div>

                <div className="relative group pt-2">
                  <textarea 
                    name="message" 
                    id="message" 
                    rows="5"
                    required
                    className="peer w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-0 transition-all resize-none placeholder-zinc-400 dark:placeholder-zinc-500 text-sm sm:text-base leading-relaxed"
                    placeholder="How can I help you?"
                  />
                </div>

                <div className="pt-2">
                  <MagneticButton 
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-2xl bg-blue-600 text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/25 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                    {!isSubmitting && <FiSend size={18} />}
                  </MagneticButton>
                  
                  {/* Subtle helper info beneath the button */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    <FiShield className="text-blue-500 shrink-0" size={13} />
                    <span>Your message is confidential. Responses typically sent within 24 hours.</span>
                  </div>
                </div>
                
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default Contact;
