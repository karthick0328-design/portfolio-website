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
   * Determine if a voice is a male/boy voice and strictly exclude female voices
   */
  _isMaleVoice(voice) {
    if (!voice || !voice.name) return false;
    const name = voice.name.toLowerCase();
    const uri = (voice.voiceURI || '').toLowerCase();
    const combined = `${name} ${uri}`;

    // Explicit disqualifications for any female voice
    const femaleKeywords = [
      'female', 'woman', 'girl', 'zira', 'jenny', 'samantha', 'victoria', 'eva',
      'susan', 'karen', 'moira', 'fiona', 'tessa', 'veena', 'heera', 'hazel',
      'catherine', 'linda', 'aria', 'natasha', 'sonia', 'stephanie', 'allison',
      'ava', 'emma', 'olivia', 'clara', 'amy', 'joanna', 'kendra', 'ivy', 'salli',
      'kimberly', 'michelle', 'nicole', 'alice', 'lucia', 'laura', 'helena', 'anna',
      'google us english' // Standard Google US English in Web Speech is female
    ];

    for (const kw of femaleKeywords) {
      if (combined.includes(kw)) {
        return false;
      }
    }

    // Explicit male keywords
    const maleKeywords = [
      'male', 'david', 'mark', 'george', 'guy', 'ryan', 'christopher', 'eric',
      'daniel', 'alex', 'fred', 'oliver', 'arthur', 'aaron', 'gordon', 'tom',
      'james', 'richard', 'steffan', 'ravi', 'prabhat', 'matthew', 'joey', 'justin'
    ];

    for (const kw of maleKeywords) {
      if (combined.includes(kw)) {
        return true;
      }
    }

    return voice.lang && voice.lang.toLowerCase().startsWith('en');
  }

  /**
   * Prioritize natural, human-sounding English male/boy voices across all browsers & OS
   */
  _selectBestVoice() {
    if (!this.voices || this.voices.length === 0) return null;

    const englishVoices = this.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));

    // Priority list of premium male voices
    const maleMatchers = [
      (v) => /natural.*(guy|ryan|christopher|eric|george|david|mark)/i.test(v.name),
      (v) => /google\s+uk\s+english\s+male/i.test(v.name),
      (v) => /google.*male/i.test(v.name) || /google.*male/i.test(v.voiceURI || ''),
      (v) => /microsoft\s+(david|mark|george|guy|ryan|christopher|eric)/i.test(v.name),
      (v) => /(daniel|alex|oliver|arthur|aaron|fred|gordon|matthew|james)/i.test(v.name),
      (v) => /male/i.test(v.name) || /male/i.test(v.voiceURI || ''),
      (v) => this._isMaleVoice(v)
    ];

    for (const matcher of maleMatchers) {
      const match = englishVoices.find(matcher);
      if (match && this._isMaleVoice(match)) return match;
    }

    const strictlyMaleVoice = englishVoices.find(v => this._isMaleVoice(v));
    if (strictlyMaleVoice) return strictlyMaleVoice;

    return englishVoices[0] || this.voices[0] || null;
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

    // Chrome audio engine unpause fix
    if (this.synth.paused) {
      try {
        this.synth.resume();
      } catch (e) {
        // ignore
      }
    }

    if (this.voices.length === 0) {
      this._loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    // Prevent Chromium garbage-collection bug from cutting off audio mid-speech
    if (typeof window !== 'undefined') {
      window.__activeSpeechUtterance = utterance;
    }

    const voice = this.preferredVoice || this._selectBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      visemeEngine.startSpeech(text, utterance.rate || 1.0);
      if (options.onStart) options.onStart();
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = typeof event.charIndex === 'number' ? event.charIndex : 0;
        visemeEngine.syncWordBoundary(charIdx, text);

        if (options.onAudioLevel) {
          options.onAudioLevel(0.85);
        }
      }
    };

    const cleanup = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (typeof window !== 'undefined') {
        window.__activeSpeechUtterance = null;
      }
      visemeEngine.stopSpeech();
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
      console.warn('SpeechSynthesis event:', err);
      if (options.onError) options.onError(err);
      if (options.onEnd) options.onEnd();
    };

    try {
      this.synth.speak(utterance);
      // Double check resume in case browser blocked autoplay
      if (this.synth.paused) {
        this.synth.resume();
      }
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
    if (typeof window !== 'undefined') {
      window.__activeSpeechUtterance = null;
    }
    visemeEngine.stopSpeech();
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
