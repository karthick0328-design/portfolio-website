/**
 * Speech Recognition Service
 * Browser-native Web Speech API wrapper with permission handling, interim streaming,
 * silence detection, and graceful fallbacks.
 */

class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.silenceTimer = null;
    this.callbacks = {};
  }

  /**
   * Check if Web Speech Recognition is available in current browser
   */
  isSupported() {
    return typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window
    );
  }

  /**
   * Initialize speech recognition instance
   */
  _init() {
    if (!this.isSupported()) return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.callbacks.onStart) this.callbacks.onStart();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text;
        } else {
          interimTranscript += text;
        }
      }

      if (interimTranscript && this.callbacks.onInterim) {
        this.callbacks.onInterim(interimTranscript);
      }

      if (finalTranscript) {
        if (this.callbacks.onResult) {
          this.callbacks.onResult(finalTranscript.trim());
        }
      }
    };

    this.recognition.onerror = (event) => {
      // Ignore normal 'no-speech' or 'aborted' events without alarming the user
      if (event.error === 'no-speech') {
        if (this.callbacks.onError) this.callbacks.onError('No speech detected. Try asking again.');
      } else if (event.error === 'not-allowed') {
        if (this.callbacks.onError) this.callbacks.onError('Microphone permission was denied. Please allow microphone access to use voice.');
      } else if (event.error !== 'aborted') {
        if (this.callbacks.onError) this.callbacks.onError(`Voice input error: ${event.error}`);
      }
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.callbacks.onEnd) this.callbacks.onEnd();
    };

    return true;
  }

  /**
   * Start listening to microphone
   * @param {Object} callbacks - { onStart, onResult, onInterim, onEnd, onError }
   */
  start(callbacks = {}) {
    this.callbacks = callbacks;

    if (!this.isSupported()) {
      if (callbacks.onError) {
        callbacks.onError('Speech recognition is not supported in this browser. You can type your question directly.');
      }
      return false;
    }

    try {
      if (!this.recognition) {
        this._init();
      }

      if (this.isListening) {
        this.stop();
      }

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
      if (callbacks.onError) callbacks.onError('Unable to access microphone. Please try again.');
      return false;
    }
  }

  /**
   * Gracefully stop speech recognition
   */
  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('SpeechRecognition stop error:', err);
      }
    }
    this.isListening = false;
  }

  /**
   * Immediately abort speech recognition
   */
  abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (err) {
        console.warn('SpeechRecognition abort error:', err);
      }
    }
    this.isListening = false;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
