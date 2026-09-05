import { visemeEngine } from './visemeEngine';

class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.preferredVoice = null;

    if (this.synth) {
      this._loadVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => this._loadVoices();
      }
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  _loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
    this.preferredVoice = this._selectBestVoice();
  }

  /**
   * Prioritize natural, human-sounding English voices across browsers
   */
  _selectBestVoice() {
    if (!this.voices || this.voices.length === 0) return null;

    const naturalVoices = [
      (v) => v.name.includes('Google US English'),
      (v) => v.name.includes('Google UK English Male'),
      (v) => v.name.includes('Google UK English Female'),
      (v) => v.name.includes('Natural') && v.lang.startsWith('en'),
      (v) => v.name.includes('Guy') || v.name.includes('Ryan') || v.name.includes('Jenny'),
      (v) => v.name.includes('David') || v.name.includes('Mark'),
      (v) => v.name.includes('Daniel') || v.name.includes('Samantha') || v.name.includes('Alex'),
      (v) => v.lang === 'en-US',
      (v) => v.lang === 'en-GB',
      (v) => v.lang.startsWith('en')
    ];

    for (const matcher of naturalVoices) {
      const match = this.voices.find(matcher);
      if (match) return match;
    }

    return this.voices[0] || null;
  }

  /**
   * Speak text with real phoneme/viseme word timing for mouth lip-sync
   * @param {string} text - Clean natural text
   * @param {Object} options - { onStart, onEnd, onError, onAudioLevel }
   */
  speak(text, options = {}) {
    if (!this.isSupported() || !text) {
      if (options.onEnd) options.onEnd();
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    if (this.voices.length === 0) {
      this._loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const voice = this.preferredVoice || this._selectBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();

      // Trigger first words immediately
      const firstWords = text.trim().split(/\s+/);
      if (firstWords[0]) {
        visemeEngine.processWordBoundary(firstWords[0], 250);
      }
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = typeof event.charIndex === 'number' ? event.charIndex : 0;
        const remaining = text.slice(charIdx);
        const match = remaining.match(/^([a-zA-Z0-9']+)/);
        const word = match ? match[1] : '';
        const estDuration = Math.max(120, Math.min(500, word.length * 70));
        visemeEngine.processWordBoundary(word, estDuration);

        if (options.onAudioLevel) {
          options.onAudioLevel(0.8);
        }
      }
    };

    const cleanup = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      visemeEngine.reset();
      if (options.onAudioLevel) {
        options.onAudioLevel(0);
      }
    };

    utterance.onend = () => {
      cleanup();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (err) => {
      cleanup();
      console.warn('SpeechSynthesis error:', err);
      if (options.onError) options.onError(err);
      if (options.onEnd) options.onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      cleanup();
      console.warn('SpeechSynthesis speak failed:', err);
      if (options.onError) options.onError(err);
    }
  }

  /**
   * Stop current speech immediately
   */
  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (err) {
        console.warn('SpeechSynthesis cancel error:', err);
      }
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    visemeEngine.reset();
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
