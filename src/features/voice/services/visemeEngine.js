/**
 * Real-time Speech-to-Viseme Natural Lip-Sync Engine
 * Synchronizes 3D avatar mouth movements with natural human speech tempo,
 * using syllable-level visemes, technical token preservation, and exact SpeechSynthesis word boundaries.
 */

export const VISEME_SHAPES = {
  rest: { name: 'rest', openY: 0.0, scaleX: 1.0, scaleY: 1.0, opacity: 0.0 },
  SMILE: { name: 'SMILE', openY: 0.28, scaleX: 1.0, scaleY: 1.0, opacity: 0.8 },
  A: { name: 'A', openY: 0.90, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },          // 'ah', 'car', 'and', 'stack', 'data'
  E: { name: 'E', openY: 0.55, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },          // 'ee', 'react', 'see', 'web', 'three'
  O: { name: 'O', openY: 0.80, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },          // 'oh', 'code', 'node', 'know', 'mongo'
  U: { name: 'U', openY: 0.45, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },          // 'oo', 'you', 'full', 'who', 'use'
  MBP: { name: 'MBP', openY: 0.0, scaleX: 1.0, scaleY: 1.0, opacity: 0.0 },      // 'm', 'b', 'p' (lips closed)
  FV: { name: 'FV', openY: 0.35, scaleX: 1.0, scaleY: 1.0, opacity: 0.9 },       // 'full', 'developer', 'for', 'frontend'
  L: { name: 'L', openY: 0.45, scaleX: 1.0, scaleY: 1.0, opacity: 0.9 },         // 'scalable', 'applications', 'tailwind'
  TH: { name: 'TH', openY: 0.38, scaleX: 1.0, scaleY: 1.0, opacity: 0.9 }        // 'three', 'the', 'with', 'python'
};

class VisemeEngine {
  constructor() {
    this.currentViseme = { ...VISEME_SHAPES.rest };
    this.targetViseme = { ...VISEME_SHAPES.rest };
    this.timeline = []; // Array of { startMs, endMs, viseme }
    this.wordMarkers = []; // Array of { charIndex, startMs, endMs, word }
    this.speechStartTime = 0;
    this.isPlaying = false;
    this.totalDurationMs = 0;
  }

  /**
   * Tokenize speech text while preserving technical words like Node.js, Three.js, React.js
   * @param {string} text - Raw speech string
   */
  _tokenize(text) {
    if (!text || typeof text !== 'string') return [];

    // Match words (including dotted tech terms like Node.js, Three.js, React.js) and punctuation
    const regex = /[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*'?[a-zA-Z0-9]*|[.,!?;:]/g;
    return text.match(regex) || [];
  }

  /**
   * Build a syllable-paced time-stamped phoneme/viseme schedule from speech text
   * @param {string} text - The spoken sentence
   * @param {number} speechRate - SpeechSynthesis rate (default 1.0)
   */
  prepareSpeechTimeline(text, speechRate = 1.0) {
    this.timeline = [];
    this.wordMarkers = [];
    if (!text || typeof text !== 'string') return;

    const rate = Math.max(0.6, Math.min(1.5, speechRate || 1.0));
    let currentMs = 0;
    const tokens = this._tokenize(text);
    let charSearchOffset = 0;

    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];

      // Handle punctuation pauses
      if (token === '.' || token === '!' || token === '?') {
        const prevToken = (tokens[t - 1] || '').toLowerCase();
        const isWelcomingEnd = prevToken === 'portfolio' || prevToken === 'welcome';
        const pauseMs = (isWelcomingEnd ? 480 : 380) / rate;

        this.timeline.push({
          startMs: currentMs,
          endMs: currentMs + pauseMs,
          viseme: isWelcomingEnd ? VISEME_SHAPES.SMILE : VISEME_SHAPES.rest
        });
        currentMs += pauseMs;
        continue;
      }

      if (token === ',' || token === ';' || token === ':') {
        const pauseMs = 240 / rate;
        this.timeline.push({
          startMs: currentMs,
          endMs: currentMs + pauseMs,
          viseme: VISEME_SHAPES.rest
        });
        currentMs += pauseMs;
        continue;
      }

      // Track character index for exact SpeechSynthesis onboundary synchronization
      const foundIndex = text.indexOf(token, charSearchOffset);
      const tokenCharIndex = foundIndex >= 0 ? foundIndex : charSearchOffset;
      charSearchOffset = tokenCharIndex + token.length;

      // Extract syllable visemes (1 to 4 clean shapes per word)
      const visemes = this._wordToSyllables(token);
      
      // Realistic conversational speech tempo (~320ms to 480ms per word)
      const baseWordDuration = (220 + visemes.length * 90) / rate;
      const syllableDuration = baseWordDuration / visemes.length;
      const wordStartMs = currentMs;

      for (let pIdx = 0; pIdx < visemes.length; pIdx++) {
        const viseme = visemes[pIdx];
        const start = currentMs + pIdx * syllableDuration;
        const end = start + syllableDuration;
        this.timeline.push({
          startMs: start,
          endMs: end,
          viseme
        });
      }

      currentMs += baseWordDuration;

      // Record word marker for real-time speech synchronization
      this.wordMarkers.push({
        charIndex: tokenCharIndex,
        startMs: wordStartMs,
        endMs: currentMs,
        word: token
      });

      // Natural inter-word spacing (40ms)
      const gapMs = 40 / rate;
      this.timeline.push({
        startMs: currentMs,
        endMs: currentMs + gapMs,
        viseme: VISEME_SHAPES.rest
      });
      currentMs += gapMs;
    }

    // Warm friendly smile hold at the end of welcome/portfolio greetings
    const lowerText = text.toLowerCase();
    if (lowerText.includes('welcome') || lowerText.includes('portfolio')) {
      const smileMs = 500 / rate;
      this.timeline.push({
        startMs: currentMs,
        endMs: currentMs + smileMs,
        viseme: VISEME_SHAPES.SMILE
      });
      currentMs += smileMs;
    }

    this.totalDurationMs = currentMs;
  }

  /**
   * Start tracking speech playback
   */
  startSpeech(text, speechRate = 1.0) {
    this.prepareSpeechTimeline(text, speechRate);
    this.speechStartTime = performance.now();
    this.isPlaying = true;
  }

  /**
   * Lock lip-sync to the exact millisecond when the browser plays each word
   * @param {number} charIndex - Character index from SpeechSynthesis onboundary
   * @param {string} fullText - Full text being spoken
   */
  syncWordBoundary(charIndex, fullText) {
    if (!this.isPlaying) return;

    // Find the word marker closest to this charIndex
    const marker = this.wordMarkers.find(
      (m) => Math.abs(m.charIndex - charIndex) <= 3
    );

    if (marker) {
      // Re-align speechStartTime to lockstep with the actual audio playback
      this.speechStartTime = performance.now() - marker.startMs;
    } else if (fullText && this.totalDurationMs > 0) {
      const textUpToChar = fullText.slice(0, charIndex);
      const wordsUpToChar = this._tokenize(textUpToChar).length;
      const allWords = this._tokenize(fullText).length;

      if (allWords > 0) {
        const estimatedElapsedMs = (wordsUpToChar / allWords) * this.totalDurationMs;
        this.speechStartTime = performance.now() - estimatedElapsedMs;
      }
    }
  }

  /**
   * Immediately stop mouth movement and return to rest
   */
  stopSpeech() {
    this.isPlaying = false;
    this.timeline = [];
    this.wordMarkers = [];
    this.targetViseme = { ...VISEME_SHAPES.rest };
  }

  /**
   * Reset engine
   */
  reset() {
    this.stopSpeech();
    this.currentViseme = { ...VISEME_SHAPES.rest };
  }

  /**
   * Convert an English word into clean, natural syllable-level visemes
   * Handles developer stack terms like React, Tailwind, CSS, Node.js, Python, MongoDB, Three.js
   */
  _wordToSyllables(word) {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return [VISEME_SHAPES.rest];

    // 1. Comprehensive developer dictionary with natural syllable pacing
    if (clean === 'hello') return [VISEME_SHAPES.E, VISEME_SHAPES.O];
    if (clean === 'im' || clean === 'i') return [VISEME_SHAPES.A, VISEME_SHAPES.E];
    if (clean === 'karthick' || clean === 'karthicks') return [VISEME_SHAPES.A, VISEME_SHAPES.E];
    if (clean === 'pandi') return [VISEME_SHAPES.MBP, VISEME_SHAPES.A, VISEME_SHAPES.E];
    if (clean === 'developer') return [VISEME_SHAPES.E, VISEME_SHAPES.FV, VISEME_SHAPES.O, VISEME_SHAPES.E];
    if (clean === 'building' || clean === 'builds') return [VISEME_SHAPES.E, VISEME_SHAPES.L];
    if (clean === 'modern') return [VISEME_SHAPES.O, VISEME_SHAPES.E];
    if (clean === 'scalable') return [VISEME_SHAPES.A, VISEME_SHAPES.L, VISEME_SHAPES.E];
    if (clean === 'interactive') return [VISEME_SHAPES.E, VISEME_SHAPES.A, VISEME_SHAPES.E];
    if (clean === 'applications') return [VISEME_SHAPES.A, VISEME_SHAPES.L, VISEME_SHAPES.E, VISEME_SHAPES.O];
    if (clean === 'react' || clean === 'reactjs') return [VISEME_SHAPES.E, VISEME_SHAPES.A];
    if (clean === 'tailwind') return [VISEME_SHAPES.E, VISEME_SHAPES.A];
    if (clean === 'css') return [VISEME_SHAPES.E, VISEME_SHAPES.E];
    if (clean === 'frontend') return [VISEME_SHAPES.FV, VISEME_SHAPES.O, VISEME_SHAPES.E];
    if (clean === 'backend') return [VISEME_SHAPES.MBP, VISEME_SHAPES.A, VISEME_SHAPES.E];
    if (clean === 'nodejs' || clean === 'node') return [VISEME_SHAPES.O, VISEME_SHAPES.E];
    if (clean === 'python') return [VISEME_SHAPES.A, VISEME_SHAPES.TH, VISEME_SHAPES.O];
    if (clean === 'mongodb' || clean === 'mongo') return [VISEME_SHAPES.MBP, VISEME_SHAPES.O, VISEME_SHAPES.O, VISEME_SHAPES.E];
    if (clean === 'data') return [VISEME_SHAPES.A, VISEME_SHAPES.A];
    if (clean === 'threejs' || clean === 'three') return [VISEME_SHAPES.TH, VISEME_SHAPES.E];
    if (clean === 'graphics' || clean === 'graphic') return [VISEME_SHAPES.A, VISEME_SHAPES.E];
    if (clean === 'combines' || clean === 'combine') return [VISEME_SHAPES.O, VISEME_SHAPES.A, VISEME_SHAPES.E];
    if (clean === 'core') return [VISEME_SHAPES.O];
    if (clean === 'stack') return [VISEME_SHAPES.A];
    if (clean === '3d') return [VISEME_SHAPES.TH, VISEME_SHAPES.E, VISEME_SHAPES.E];
    if (clean === 'nextjs' || clean === 'next') return [VISEME_SHAPES.E, VISEME_SHAPES.TH];
    if (clean === 'technologies' || clean === 'tech') return [VISEME_SHAPES.E, VISEME_SHAPES.O, VISEME_SHAPES.L, VISEME_SHAPES.E];
    if (clean === 'welcome') return [VISEME_SHAPES.U, VISEME_SHAPES.E, VISEME_SHAPES.SMILE];
    if (clean === 'portfolio') return [VISEME_SHAPES.O, VISEME_SHAPES.FV, VISEME_SHAPES.O, VISEME_SHAPES.SMILE];
    if (clean === 'smile' || clean === 'smiling') return [VISEME_SHAPES.A, VISEME_SHAPES.SMILE];
    if (clean === 'who' || clean === 'you' || clean === 'use' || clean === 'uses') return [VISEME_SHAPES.U, VISEME_SHAPES.E];
    if (clean === 'full') return [VISEME_SHAPES.FV, VISEME_SHAPES.U];
    if (clean === 'web') return [VISEME_SHAPES.E];
    if (clean === 'and' || clean === 'with') return [clean === 'and' ? VISEME_SHAPES.A : VISEME_SHAPES.TH];
    if (clean === 'on' || clean === 'for') return [VISEME_SHAPES.O];
    if (clean === 'what' || clean === 'does' || clean === 'he') return [VISEME_SHAPES.A, VISEME_SHAPES.E];

    // 2. Generalized natural syllable parser for any English word
    const result = [];
    const vowels = /[aeiouy]/g;
    const matches = clean.match(vowels);

    if (!matches || matches.length === 0) {
      return [VISEME_SHAPES.A];
    }

    // Map each vowel cluster to a natural mouth posture
    let i = 0;
    while (i < clean.length) {
      const ch = clean[i];
      const next = clean[i + 1] || '';
      const pair = ch + next;

      if (pair === 'oo' || pair === 'ou') {
        result.push(VISEME_SHAPES.U);
        i += 2;
      } else if (pair === 'ee' || pair === 'ea' || pair === 'ie') {
        result.push(VISEME_SHAPES.E);
        i += 2;
      } else if (pair === 'oa' || pair === 'ow') {
        result.push(VISEME_SHAPES.O);
        i += 2;
      } else if (ch === 'a') {
        result.push(VISEME_SHAPES.A);
        i++;
      } else if (ch === 'e' || ch === 'i' || ch === 'y') {
        result.push(VISEME_SHAPES.E);
        i++;
      } else if (ch === 'o') {
        result.push(VISEME_SHAPES.O);
        i++;
      } else if (ch === 'u') {
        result.push(VISEME_SHAPES.U);
        i++;
      } else {
        i++;
      }
    }

    return result.length > 0 ? result.slice(0, 4) : [VISEME_SHAPES.A];
  }

  /**
   * Called on every animation frame in Three.js renderer
   * Computes smooth organic viseme interpolation with natural muscular inertia
   */
  update(lerpFactor = 0.22) {
    if (!this.isPlaying) {
      this.targetViseme = VISEME_SHAPES.rest;
    } else {
      const elapsedMs = performance.now() - this.speechStartTime;

      // Find active viseme in timeline
      const activeItem = this.timeline.find(
        (item) => elapsedMs >= item.startMs && elapsedMs < item.endMs
      );

      if (activeItem) {
        this.targetViseme = activeItem.viseme;
      } else if (elapsedMs < this.totalDurationMs) {
        this.targetViseme = VISEME_SHAPES.rest;
      } else {
        // Fallback keepalive: while speech audio is still playing in the browser,
        // continue natural conversational mouth movement until speech is completed (onend)
        const cycleMs = (elapsedMs - this.totalDurationMs) % 520;
        if (cycleMs < 180) {
          this.targetViseme = VISEME_SHAPES.A;
        } else if (cycleMs < 340) {
          this.targetViseme = VISEME_SHAPES.E;
        } else if (cycleMs < 460) {
          this.targetViseme = VISEME_SHAPES.O;
        } else {
          this.targetViseme = VISEME_SHAPES.rest;
        }
      }
    }

    // Natural smooth anatomical interpolation
    const target = this.targetViseme;
    this.currentViseme.openY += (target.openY - this.currentViseme.openY) * lerpFactor;
    this.currentViseme.scaleX += (target.scaleX - this.currentViseme.scaleX) * lerpFactor;
    this.currentViseme.scaleY += (target.scaleY - this.currentViseme.scaleY) * lerpFactor;
    this.currentViseme.opacity += (target.opacity - this.currentViseme.opacity) * Math.min(1.0, lerpFactor * 1.5);

    return this.currentViseme;
  }
}

export const visemeEngine = new VisemeEngine();
