/**
 * Speech Recognition Service
 * Browser-native Web Speech API wrapper with clean instance lifecycle,
 * mobile speech fallback, interim streaming, and robust cross-browser error handling.
 */

class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.hasFinalResult = false;
    this.lastCapturedText = '';
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
   * Start listening to microphone with a clean instance
   * @param {Object} callbacks - { onStart, onResult, onInterim, onEnd, onError }
   */
  start(callbacks = {}) {
    this.callbacks = callbacks;
    this.hasFinalResult = false;
    this.lastCapturedText = '';

    if (!this.isSupported()) {
      if (callbacks.onError) {
        callbacks.onError('Voice input is not supported in this browser. You can type your questions below!');
      }
      return false;
    }

    // Always abort existing instance to prevent InvalidStateError
    this.abort();

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
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

        const currentText = finalTranscript || interimTranscript;
        if (currentText && currentText.trim()) {
          this.lastCapturedText = currentText.trim();
        }

        if (interimTranscript && this.callbacks.onInterim) {
          this.callbacks.onInterim(interimTranscript);
        }

        if (finalTranscript.trim()) {
          this.hasFinalResult = true;
          if (this.callbacks.onResult) {
            this.callbacks.onResult(finalTranscript.trim());
          }
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (event.error === 'no-speech') {
          // If we had captured words before no-speech fired, process them
          if (!this.hasFinalResult && this.lastCapturedText) {
            this.hasFinalResult = true;
            if (this.callbacks.onResult) {
              this.callbacks.onResult(this.lastCapturedText);
            }
            return;
          }
          if (this.callbacks.onError) this.callbacks.onError('No speech detected. Please tap the mic and try again.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          if (this.callbacks.onError) this.callbacks.onError('Microphone permission needed. Please allow microphone access in your browser.');
        } else if (event.error !== 'aborted') {
          if (this.callbacks.onError) this.callbacks.onError(`Voice input: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // Mobile fallback: Android/iOS browsers sometimes end before isFinal is set
        if (!this.hasFinalResult && this.lastCapturedText) {
          this.hasFinalResult = true;
          if (this.callbacks.onResult) {
            this.callbacks.onResult(this.lastCapturedText);
          }
        }
        if (this.callbacks.onEnd) {
          this.callbacks.onEnd(this.hasFinalResult);
        }
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
      this.isListening = false;
      if (callbacks.onError) callbacks.onError('Could not access microphone. You can type your question.');
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
        // ignore
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
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
