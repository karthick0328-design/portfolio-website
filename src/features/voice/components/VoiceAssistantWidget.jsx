import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiMicOff, FiSquare, FiX, FiMessageSquare, FiVolume2, FiCornerDownLeft } from 'react-icons/fi';
import { useVoiceAssistant } from '../context/VoiceAssistantContext';

const SUGGESTIONS = [
  "Tell me about Karthick",
  "What 3D projects has he built?",
  "What technologies does he use?",
  "Why should I hire Karthick?",
  "Is he available for work?"
];

const VoiceAssistantWidget = () => {
  const {
    isListening,
    isThinking,
    isSpeaking,
    transcript,
    interimTranscript,
    response,
    errorMessage,
    isWidgetOpen,
    setIsWidgetOpen,
    stopSpeaking,
    toggleListening,
    askQuestion
  } = useVoiceAssistant();

  const [textInput, setTextInput] = useState('');
  const inputRef = useRef(null);

  // Auto-expand widget when voice activates
  useEffect(() => {
    if (isListening || isThinking || isSpeaking) {
      setIsWidgetOpen(true);
    }
  }, [isListening, isThinking, isSpeaking, setIsWidgetOpen]);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    askQuestion(textInput.trim());
    setTextInput('');
  };

  const handleSuggestionClick = (query) => {
    askQuestion(query);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto select-none">
      
      {/* Expanded Voice Assistant Panel */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[92vw] max-w-[380px] sm:w-[380px] mb-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2.5">
                <div className="relative w-2.5 h-2.5">
                  <span className={`absolute inset-0 rounded-full ${
                    isListening ? 'bg-red-500 animate-ping' :
                    isThinking ? 'bg-amber-400 animate-ping' :
                    isSpeaking ? 'bg-cyan-500 animate-ping' :
                    'bg-emerald-500'
                  }`} />
                  <span className={`relative block w-2.5 h-2.5 rounded-full ${
                    isListening ? 'bg-red-500' :
                    isThinking ? 'bg-amber-400' :
                    isSpeaking ? 'bg-cyan-500' :
                    'bg-emerald-500'
                  }`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    Karthick's Voice AI
                    <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      LIVE
                    </span>
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    {isListening ? 'Listening to your voice...' :
                     isThinking ? 'Processing question...' :
                     isSpeaking ? 'Speaking response...' :
                     'Ready to chat'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-2 py-1 text-[11px] font-mono rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center gap-1"
                    title="Stop speaking"
                  >
                    <FiSquare size={10} />
                    <span>Stop</span>
                  </button>
                )}
                <button
                  onClick={() => setIsWidgetOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Minimize"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Conversation / Subtitle Display Area */}
            <div className="p-4 max-h-[220px] overflow-y-auto flex flex-col gap-3 text-xs leading-relaxed">
              {/* User Query */}
              {(transcript || interimTranscript) && (
                <div className="flex flex-col items-end">
                  <div className="bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 text-cyan-900 dark:text-cyan-200 px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%]">
                    <p className="font-medium">
                      {transcript || interimTranscript}
                      {interimTranscript && <span className="animate-pulse">...</span>}
                    </p>
                  </div>
                </div>
              )}

              {/* Assistant Thinking Indicator */}
              {isThinking && (
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 py-1">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  </div>
                  <span className="text-[11px] font-mono">Thinking...</span>
                </div>
              )}

              {/* Assistant Response */}
              {response && !isThinking && (
                <div className="flex flex-col items-start">
                  <div className="bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-800 dark:text-zinc-200 px-3.5 py-2.5 rounded-2xl rounded-tl-sm max-w-[95%] shadow-sm">
                    <p className="text-zinc-800 dark:text-zinc-200 font-normal leading-normal">
                      {response}
                    </p>
                    {isSpeaking && (
                      <div className="mt-2 pt-2 border-t border-zinc-200/40 dark:border-zinc-700/40 flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-[10px] font-mono">
                        <FiVolume2 size={12} className="animate-pulse" />
                        <span>Synchronized avatar speech</span>
                        <div className="flex items-center gap-0.5 ml-auto">
                          <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse" />
                          <span className="w-0.5 h-3.5 bg-cyan-400 animate-bounce" />
                          <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 px-3 py-2 rounded-xl">
                  {errorMessage}
                </div>
              )}

              {/* Default Welcome if nothing yet */}
              {!transcript && !response && !isThinking && !errorMessage && (
                <div className="text-center py-2 text-zinc-500 dark:text-zinc-400 flex flex-col items-center gap-1.5">
                  <p className="text-xs">
                    Tap the microphone to speak or pick a question below:
                  </p>
                </div>
              )}

              {/* Quick Suggestions Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 border border-transparent transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Voice Controls Footer */}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 flex flex-col gap-2">
              <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Or type a question here..."
                  className="flex-grow text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                {textInput.trim() && (
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                    title="Send"
                  >
                    <FiCornerDownLeft size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-cyan-500 hover:text-white'
                  }`}
                  title={isListening ? "Stop listening" : "Click to speak"}
                >
                  {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Minimized Pill / Action Button */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2"
      >
        <button
          onClick={() => {
            if (!isWidgetOpen) {
              setIsWidgetOpen(true);
            }
            toggleListening();
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl backdrop-blur-xl border transition-all duration-300 ${
            isListening
              ? 'bg-red-500/90 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
              : isSpeaking
              ? 'bg-cyan-500/90 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-100 border-zinc-200/80 dark:border-zinc-800/80 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]'
          }`}
          aria-label="Voice Assistant"
        >
          {/* Animated Icon */}
          <div className="relative flex items-center justify-center">
            {isListening ? (
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3.5 bg-white animate-pulse" />
                <span className="w-1 h-5 bg-white animate-bounce" />
                <span className="w-1 h-2.5 bg-white animate-pulse" />
              </div>
            ) : isSpeaking ? (
              <FiVolume2 size={18} className="animate-pulse text-white" />
            ) : (
              <FiMic size={18} className="text-cyan-500 dark:text-cyan-400" />
            )}
          </div>

          <span className="text-xs font-semibold tracking-wide">
            {isListening ? 'Listening...' :
             isThinking ? 'Thinking...' :
             isSpeaking ? 'Speaking...' :
             'Ask Voice AI'}
          </span>

          {/* Unread / Ready indicator dot */}
          {!isListening && !isSpeaking && !isThinking && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          )}
        </button>

        {/* Small Toggle Chat Panel Button if closed */}
        {!isWidgetOpen && (
          <button
            onClick={() => setIsWidgetOpen(true)}
            className="p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg hover:text-cyan-500 transition-colors"
            title="Open Voice Chat Panel"
            aria-label="Open Voice Chat Panel"
          >
            <FiMessageSquare size={16} />
          </button>
        )}
      </motion.div>

    </div>
  );
};

export default VoiceAssistantWidget;
