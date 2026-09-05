/**
 * Speech Synthesis Service with Natural Voice Tuning & Lip-Sync Driver
 * Selects highest quality browser voices, formats natural pauses,
 * and generates real-time audio amplitude meters for 3D avatar lip-sync.
 */

class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.meterInterval = null;
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
      // Google / Chrome natural voices
      (v) => v.name.includes('Google US English'),
      (v) => v.name.includes('Google UK English Male'),
      (v) => v.name.includes('Google UK English Female'),
      // Microsoft Natural / Neural voices
      (v) => v.name.includes('Natural') && v.lang.startsWith('en'),
      (v) => v.name.includes('Guy') || v.name.includes('Ryan') || v.name.includes('Jenny'),
      (v) => v.name.includes('David') || v.name.includes('Mark'),
      // Apple / Safari natural voices
      (v) => v.name.includes('Daniel') || v.name.includes('Samantha') || v.name.includes('Alex'),
      // General US/UK English
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
   * Speak text with natural cadence, pause handling, and audio metering for lip sync
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

    // Natural human pacing
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    let wordBurst = 0.5;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();

      // Drive dynamic audio amplitude wave for realistic lip sync
      if (options.onAudioLevel) {
        let phase = 0;
        this.meterInterval = setInterval(() => {
          if (!this.isSpeaking) return;

          phase += 0.28;
          // Natural syllable oscillation + subtle random fluctuation
          const syllableOsc = Math.sin(phase * 4.5) * 0.4 + 0.6;
          const jitter = (Math.random() - 0.5) * 0.15;
          const targetLevel = Math.max(0.08, Math.min(0.95, (syllableOsc + jitter) * wordBurst));

          options.onAudioLevel(targetLevel);
        }, 40);
      }
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Boost mouth movement at start of each word
        wordBurst = 0.75 + Math.random() * 0.25;
      }
    };

    const cleanup = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.meterInterval) {
        clearInterval(this.meterInterval);
        this.meterInterval = null;
      }
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
    if (this.meterInterval) {
      clearInterval(this.meterInterval);
      this.meterInterval = null;
    }
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
