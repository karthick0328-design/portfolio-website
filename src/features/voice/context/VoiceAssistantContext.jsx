import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { conversationEngine } from '../services/conversationEngine';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { speechSynthesisService } from '../services/speechSynthesisService';

const VoiceAssistantContext = createContext(null);

export const VoiceAssistantProvider = ({ children }) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking' | 'error'
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const isSupported = speechRecognitionService.isSupported() || speechSynthesisService.isSupported();

  // Stop any active speech or recognition on unmount
  useEffect(() => {
    return () => {
      speechRecognitionService.abort();
      speechSynthesisService.stop();
    };
  }, []);

  /**
   * Speak a given response text and animate lip-sync
   */
  const speakText = useCallback((text) => {
    if (!text) return;
    setStatus('speaking');
    setResponse(text);

    speechSynthesisService.speak(text, {
      onStart: () => {
        setStatus('speaking');
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      },
      onEnd: () => {
        setStatus('idle');
        setAudioLevel(0);
      },
      onError: () => {
        setStatus('idle');
        setAudioLevel(0);
      }
    });
  }, []);

  /**
   * Process a question from voice or text input
   */
  const askQuestion = useCallback((queryText) => {
    if (!queryText || !queryText.trim()) return;

    const cleanQuery = queryText.trim();
    setTranscript(cleanQuery);
    setInterimTranscript('');
    setErrorMessage('');
    setIsWidgetOpen(true);

    // Synchronously generate and speak to preserve mobile user gesture context
    const generatedResponse = conversationEngine.generateResponse(cleanQuery);
    setHistory(prev => [...prev, { query: cleanQuery, reply: generatedResponse, timestamp: Date.now() }]);
    setStatus('speaking');
    setResponse(generatedResponse);

    speechSynthesisService.speak(generatedResponse, {
      onStart: () => {
        setStatus('speaking');
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      },
      onEnd: () => {
        setStatus('idle');
        setAudioLevel(0);
      },
      onError: () => {
        setStatus('idle');
        setAudioLevel(0);
      }
    });
  }, []);

  /**
   * Start listening for microphone speech
   */
  const startListening = useCallback(() => {
    // If speaking, stop speaking first
    if (statusRef.current === 'speaking') {
      speechSynthesisService.stop();
      setAudioLevel(0);
    }

    setErrorMessage('');
    setInterimTranscript('');
    setStatus('listening');
    setIsWidgetOpen(true);

    const started = speechRecognitionService.start({
      onStart: () => {
        setStatus('listening');
      },
      onInterim: (text) => {
        setInterimTranscript(text);
      },
      onResult: (finalText) => {
        setTranscript(finalText);
        setInterimTranscript('');
        askQuestion(finalText);
      },
      onEnd: (hasFinalResult) => {
        // If no speech result was obtained, return to idle
        if (!hasFinalResult) {
          setStatus('idle');
        }
      },
      onError: (err) => {
        setErrorMessage(typeof err === 'string' ? err : 'Microphone error');
        setStatus('idle');
      }
    });

    if (!started) {
      setStatus('idle');
    }
  }, [askQuestion]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    speechRecognitionService.stop();
    setStatus('idle');
    setInterimTranscript('');
  }, []);

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(() => {
    speechSynthesisService.stop();
    setAudioLevel(0);
    setStatus('idle');
  }, []);

  /**
   * Toggle voice assistant listening state
   */
  const toggleListening = useCallback(() => {
    if (status === 'listening') {
      stopListening();
    } else if (status === 'speaking') {
      stopSpeaking();
    } else {
      startListening();
    }
  }, [status, startListening, stopListening, stopSpeaking]);

  /**
   * Reset conversation
   */
  const clearConversation = useCallback(() => {
    stopSpeaking();
    stopListening();
    conversationEngine.resetContext();
    setHistory([]);
    setTranscript('');
    setInterimTranscript('');
    setResponse('');
    setErrorMessage('');
  }, [stopSpeaking, stopListening]);

  const value = {
    status,
    isListening: status === 'listening',
    isThinking: status === 'thinking',
    isSpeaking: status === 'speaking',
    transcript,
    interimTranscript,
    response,
    audioLevel,
    errorMessage,
    history,
    isWidgetOpen,
    setIsWidgetOpen,
    isSupported,
    speakText,
    startListening,
    stopListening,
    stopSpeaking,
    toggleListening,
    askQuestion,
    clearConversation
  };

  return (
    <VoiceAssistantContext.Provider value={value}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
};
