import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight, FiVolume2, FiVolumeX, FiMic, FiMicOff } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolioData';
import HeroAvatarCanvas from './HeroAvatarCanvas';
import { useVoiceAssistant } from '../../features/voice';

const HeroSection = () => {
  const { personalInfo } = portfolioData;
  const { scrollY } = useScroll();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const { 
    isSpeaking: isVoiceSpeaking, 
    audioLevel: voiceAudioLevel, 
    toggleListening, 
    isListening: isVoiceListening,
    stopSpeaking: stopVoiceSpeaking 
  } = useVoiceAssistant();

  const activeIsSpeaking = isSpeaking || isVoiceSpeaking;
  const activeAudioLevel = isVoiceSpeaking ? voiceAudioLevel : audioLevel;

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio('/audio/karthick_intro.mp3?v=7');
    audioRef.current = audio;

    const handleEnded = () => {
      setIsSpeaking(false);
      setAudioLevel(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', () => {
      if (audio.currentTime >= audio.duration || audio.paused) {
        handleEnded();
      }
    });

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const updateAudioMeter = () => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        const count = Math.min(32, dataArray.length);
        for (let i = 2; i < count; i++) {
          sum += dataArray[i];
        }
        const avg = sum / (count - 2);
        const normalizedLevel = Math.min(1.0, avg / 100.0);
        setAudioLevel(normalizedLevel > 0.05 ? normalizedLevel : 0.35);
      } else {
        // Fallback rhythmic cadence
        setAudioLevel(0.45);
      }

      animFrameRef.current = requestAnimationFrame(updateAudioMeter);
    } else {
      setAudioLevel(0);
    }
  };

  // Toggle studio voice narration
  const toggleSpeak = async () => {
    if (isVoiceSpeaking) {
      stopVoiceSpeaking();
    }
    const audio = audioRef.current;
    if (!audio) return;

    if (isSpeaking) {
      audio.pause();
      audio.currentTime = 0;
      setIsSpeaking(false);
      setAudioLevel(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      try {
        if (!audioContextRef.current) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 128;
            analyser.smoothingTimeConstant = 0.6;

            try {
              const source = ctx.createMediaElementSource(audio);
              source.connect(analyser);
              analyser.connect(ctx.destination);
              analyserRef.current = analyser;
            } catch (mediaErr) {
              console.warn('MediaElementSource fallback:', mediaErr);
            }

            audioContextRef.current = ctx;
          }
        }

        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        audio.currentTime = 0;
        setIsSpeaking(true);
        await audio.play();
        animFrameRef.current = requestAnimationFrame(updateAudioMeter);
      } catch (err) {
        console.warn('MP3 playback fallback to speech synthesis:', err);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const introText = `Hello! I'm Karthick Pandi. I'm a Full Stack Developer building modern, scalable, and interactive web applications with React, Next.js, Node.js, Python, Three.js, and AI technologies. Welcome to my portfolio!`;
          const utterance = new SpeechSynthesisUtterance(introText);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.onstart = () => {
            setIsSpeaking(true);
            setAudioLevel(0.5);
          };
          utterance.onend = () => {
            setIsSpeaking(false);
            setAudioLevel(0);
          };
          utterance.onerror = () => {
            setIsSpeaking(false);
            setAudioLevel(0);
          };
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  };

  // Subtle parallax effect on scroll
  const contentY = useTransform(scrollY, [0, 500], [0, 50]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.1]);

  return (
    <section className="relative w-full min-h-screen h-screen flex items-center justify-center overflow-hidden bg-[#f8fafc] dark:bg-[#050507] text-zinc-900 dark:text-white select-none transition-colors duration-500">
      
      {/* 1. Cinematic Ambient Background & Glows for Light and Dark mode */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft atmospheric cyan/teal and purple glowing flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-cyan-500/[0.12] dark:bg-cyan-500/[0.08] filter blur-[150px] pointer-events-none transition-opacity duration-500" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/4 w-[550px] h-[550px] rounded-full bg-purple-600/[0.1] dark:bg-purple-600/[0.07] filter blur-[160px] pointer-events-none transition-opacity duration-500" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/[0.08] dark:bg-blue-500/[0.04] filter blur-[120px] pointer-events-none transition-opacity duration-500" />
        
        {/* Radial vignette mask matching active theme background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,rgba(248,250,252,0),#f8fafc)] dark:bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,rgba(0,0,0,0),#050507)] transition-colors duration-500" />
      </div>

      {/* 2. 3D Human Avatar (Centered, Close-Up, Real Voice Lip-Sync) */}
      <HeroAvatarCanvas isSpeaking={activeIsSpeaking} audioLevel={activeAudioLevel} onToggleSpeak={toggleSpeak} />

      {/* 3. Floating Left Social Icons (Vertical Stack) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="hidden md:flex flex-col items-center gap-6 absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-zinc-400 to-zinc-300 dark:via-zinc-600 dark:to-zinc-500" />
        <div className="flex flex-col gap-4">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-zinc-600 hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400 hover:scale-125 transition-all duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)] dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          >
            <FiGithub size={19} />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-zinc-600 hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400 hover:scale-125 transition-all duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)] dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          >
            <FiLinkedin size={19} />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            aria-label="Email"
            className="text-zinc-600 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 hover:scale-125 transition-all duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)] dark:drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
          >
            <FiMail size={19} />
          </a>
        </div>
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-300 via-zinc-400 to-transparent dark:from-zinc-500 dark:via-zinc-600 dark:to-transparent" />
      </motion.div>

      {/* 4. Main Content Overlay (Left Intro + Right Role, arranged around Character) */}
      <motion.div 
        style={{ y: contentY, opacity: heroOpacity }}
        className="w-full h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-between py-20 lg:py-0 relative z-20 pointer-events-none"
      >
        {/* Mid-screen Container: Left Intro & Right Info */}
        <div className="w-full flex-grow flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-0 my-auto">
          
          {/* LEFT CONTENT: Introduction & Name */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto"
          >
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium dark:font-light"
            >
              Hello! I'm
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black tracking-tight uppercase leading-[0.95] text-zinc-900 dark:text-white"
            >
              <span className="block text-zinc-900 dark:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
                KARTHICK
              </span>
              <span className="block bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-500 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-500 bg-clip-text text-transparent mt-0.5">
                PANDI
              </span>
            </motion.h1>
          </motion.div>

          {/* Spacer for the large center 3D character */}
          <div className="hidden lg:block w-72 xl:w-96 h-1 pointer-events-none" />

          {/* RIGHT CONTENT: Professional Role & Description */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto max-w-[300px] sm:max-w-[340px]"
          >
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-base sm:text-lg font-medium dark:font-light text-cyan-600 dark:text-cyan-400 tracking-wide mb-0.5 drop-shadow-[0_0_10px_rgba(6,182,212,0.2)] dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
            >
              Full Stack &
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase leading-[0.95] tracking-tight mb-3"
            >
              DEVELOPER
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal"
            >
              Building modern, scalable, and interactive web applications with React, Next.js, Node.js, Python, Three.js, and AI technologies.
            </motion.p>

            {/* Interactive Voice Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5 justify-center lg:justify-start">
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
                onClick={toggleSpeak}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-wide transition-all duration-300 ${
                  isSpeaking 
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'bg-zinc-200/60 dark:bg-zinc-800/60 border-zinc-300 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <FiVolumeX size={14} className="text-cyan-500" />
                    <span>Speaking Intro...</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
                      <span className="w-0.5 h-4 bg-cyan-400 animate-bounce" />
                      <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" />
                    </div>
                  </>
                ) : (
                  <>
                    <FiVolume2 size={14} className="text-cyan-500" />
                    <span>Listen to Intro</span>
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.82, duration: 0.8 }}
                onClick={() => {
                  if (isSpeaking && audioRef.current) {
                    audioRef.current.pause();
                    setIsSpeaking(false);
                    setAudioLevel(0);
                  }
                  toggleListening();
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-wide transition-all duration-300 ${
                  isVoiceListening
                    ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse'
                    : isVoiceSpeaking
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'bg-cyan-500/10 dark:bg-cyan-500/10 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500'
                }`}
                title="Click to talk to Karthick's AI voice assistant"
              >
                {isVoiceListening ? (
                  <>
                    <FiMicOff size={14} className="text-red-500 animate-pulse" />
                    <span>Listening...</span>
                  </>
                ) : isVoiceSpeaking ? (
                  <>
                    <FiVolume2 size={14} className="text-cyan-400 animate-pulse" />
                    <span>Avatar Speaking...</span>
                  </>
                ) : (
                  <>
                    <FiMic size={14} className="text-cyan-500" />
                    <span>Talk to Voice AI</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar: Minimal Resume Link (Right) and Scroll Prompt (Center) */}
        <div className="w-full pb-6 flex items-center justify-between pointer-events-auto">
          {/* Mobile Social Links */}
          <div className="flex md:hidden items-center gap-4 text-zinc-600 dark:text-zinc-400">
            <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-cyan-600 dark:hover:text-cyan-400">
              <FiGithub size={18} />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-cyan-600 dark:hover:text-cyan-400">
              <FiLinkedin size={18} />
            </a>
            <a href={`mailto:${personalInfo.email}`} aria-label="Email" className="hover:text-purple-600 dark:hover:text-purple-400">
              <FiMail size={18} />
            </a>
          </div>

          {/* Center Minimal Scroll Prompt */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="hidden sm:flex flex-col items-center gap-1.5 mx-auto pointer-events-none"
          >
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-500">
              SCROLL
            </span>
            <div className="w-[1px] h-5 bg-gradient-to-b from-cyan-500/80 dark:from-cyan-400/80 to-transparent animate-pulse" />
          </motion.div>

          {/* Minimal Resume Link (Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="ml-auto"
          >
            <Link 
              to="/resume" 
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-700 hover:text-cyan-600 dark:text-zinc-300 dark:hover:text-cyan-400 transition-colors duration-300"
            >
              <span className="relative pb-0.5">
                RESUME
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-600 dark:bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </span>
              <FiArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-cyan-600 dark:text-cyan-400" />
            </Link>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default HeroSection;
