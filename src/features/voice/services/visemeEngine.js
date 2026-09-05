/**
 * Real-time Speech-to-Phoneme/Viseme Timeline Lip-Sync Engine
 * Synchronizes 3D avatar mouth shapes with speech playback timing and phonemes.
 */

export const VISEME_SHAPES = {
  rest: { name: 'rest', openY: 0.0, scaleX: 1.0, scaleY: 1.0, opacity: 0.0 },
  SMILE: { name: 'SMILE', openY: 0.28, scaleX: 1.0, scaleY: 1.0, opacity: 0.8 },
  A: { name: 'A', openY: 0.95, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },          // 'ah', 'car', 'and', 'stack'
  E: { name: 'E', openY: 0.60, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },          // 'ee', 'react', 'see', 'web'
  O: { name: 'O', openY: 0.85, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },          // 'oh', 'code', 'node', 'know'
  U: { name: 'U', openY: 0.50, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },          // 'oo', 'you', 'full', 'who'
  MBP: { name: 'MBP', openY: 0.0, scaleX: 1.0, scaleY: 1.0, opacity: 0.0 },      // 'pandi', 'built', 'modern'
  FV: { name: 'FV', openY: 0.35, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },       // 'full', 'developer', 'for'
  L: { name: 'L', openY: 0.45, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },         // 'scalable', 'applications'
  TH: { name: 'TH', openY: 0.40, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 }        // 'three', 'the', 'with'
};

class VisemeEngine {
  constructor() {
    this.currentViseme = { ...VISEME_SHAPES.rest };
    this.targetViseme = { ...VISEME_SHAPES.rest };
    this.timeline = []; // Array of { startMs, endMs, viseme }
    this.speechStartTime = 0;
    this.isPlaying = false;
    this.totalDurationMs = 0;
  }

  /**
   * Build a detailed time-stamped phoneme/viseme schedule from speech text
   * @param {string} text - The spoken sentence
   * @param {number} speechRate - SpeechSynthesis rate (default 1.0)
   */
  prepareSpeechTimeline(text, speechRate = 1.0) {
    this.timeline = [];
    if (!text || typeof text !== 'string') return;

    let currentMs = 0;
    // Split into sentences and tokens
    const tokens = text.match(/[\w']+|[.,!?;:]/g) || [];

    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];

      // Handle punctuation pauses
      if (token === '.' || token === '!' || token === '?') {
        const prevToken = (tokens[t - 1] || '').toLowerCase();
        const isWelcomingEnd = prevToken === 'portfolio' || prevToken === 'welcome';

        this.timeline.push({
          startMs: currentMs,
          endMs: currentMs + (isWelcomingEnd ? 450 : 380),
          viseme: isWelcomingEnd ? VISEME_SHAPES.SMILE : VISEME_SHAPES.rest
        });
        currentMs += (isWelcomingEnd ? 450 : 380);
        continue;
      }

      if (token === ',' || token === ';' || token === ':') {
        this.timeline.push({
          startMs: currentMs,
          endMs: currentMs + 220,
          viseme: VISEME_SHAPES.rest
        });
        currentMs += 220;
        continue;
      }

      // Break word into phonemes
      const phonemes = this._wordToPhonemes(token);
      // Word duration proportional to character count & syllables
      const wordBaseDuration = Math.max(160, Math.min(550, token.length * 52 + phonemes.length * 35));
      const wordDuration = wordBaseDuration / speechRate;
      const phonemeDuration = wordDuration / phonemes.length;

      for (let pIdx = 0; pIdx < phonemes.length; pIdx++) {
        const viseme = phonemes[pIdx];
        const start = currentMs + pIdx * phonemeDuration;
        const end = start + phonemeDuration;
        this.timeline.push({
          startMs: start,
          endMs: end,
          viseme
        });
      }

      currentMs += wordDuration;

      // Small natural inter-word release (30ms)
      this.timeline.push({
        startMs: currentMs,
        endMs: currentMs + 30,
        viseme: VISEME_SHAPES.rest
      });
      currentMs += 30;
    }

    // Warm friendly smile hold at the end of welcome/portfolio greetings
    const lowerText = text.toLowerCase();
    if (lowerText.includes('welcome') || lowerText.includes('portfolio')) {
      this.timeline.push({
        startMs: currentMs,
        endMs: currentMs + 500,
        viseme: VISEME_SHAPES.SMILE
      });
      currentMs += 500;
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
   * Recalibrate speech timeline on native onboundary word event
   * @param {number} charIndex - Character index of the word currently spoken
   * @param {string} fullText - Full text being spoken
   */
  syncWordBoundary(charIndex, fullText) {
    if (!this.isPlaying || !fullText) return;

    // Calculate approximate expected time for this charIndex
    const textUpToChar = fullText.slice(0, charIndex);
    const wordsUpToChar = (textUpToChar.match(/[\w']+/g) || []).length;
    const allWords = (fullText.match(/[\w']+/g) || []).length;

    if (allWords > 0 && this.totalDurationMs > 0) {
      const estimatedElapsedMs = (wordsUpToChar / allWords) * this.totalDurationMs;
      // Adjust speechStartTime to keep timeline in sync with actual browser audio
      this.speechStartTime = performance.now() - estimatedElapsedMs;
    }
  }

  /**
   * Immediately stop mouth movement and return to rest
   */
  stopSpeech() {
    this.isPlaying = false;
    this.timeline = [];
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
   * Convert an English word to specific Viseme shapes
   */
  _wordToPhonemes(word) {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return [VISEME_SHAPES.rest];

    const result = [];

    // Special dictionary words for developer portfolio
    if (clean === 'welcome') return [VISEME_SHAPES.U, VISEME_SHAPES.E, VISEME_SHAPES.L, VISEME_SHAPES.TH, VISEME_SHAPES.MBP, VISEME_SHAPES.SMILE];
    if (clean === 'portfolio') return [VISEME_SHAPES.MBP, VISEME_SHAPES.O, VISEME_SHAPES.TH, VISEME_SHAPES.FV, VISEME_SHAPES.O, VISEME_SHAPES.L, VISEME_SHAPES.E, VISEME_SHAPES.O, VISEME_SHAPES.SMILE];
    if (clean === 'smile' || clean === 'smiling') return [VISEME_SHAPES.TH, VISEME_SHAPES.MBP, VISEME_SHAPES.A, VISEME_SHAPES.L, VISEME_SHAPES.SMILE];
    if (clean === 'react') return [VISEME_SHAPES.TH, VISEME_SHAPES.E, VISEME_SHAPES.A, VISEME_SHAPES.TH];
    if (clean === 'karthick') return [VISEME_SHAPES.TH, VISEME_SHAPES.A, VISEME_SHAPES.TH, VISEME_SHAPES.E, VISEME_SHAPES.TH];
    if (clean === 'pandi') return [VISEME_SHAPES.MBP, VISEME_SHAPES.A, VISEME_SHAPES.TH, VISEME_SHAPES.E];
    if (clean === 'python') return [VISEME_SHAPES.MBP, VISEME_SHAPES.A, VISEME_SHAPES.TH, VISEME_SHAPES.O, VISEME_SHAPES.TH];
    if (clean === 'node' || clean === 'nodejs') return [VISEME_SHAPES.TH, VISEME_SHAPES.O, VISEME_SHAPES.TH];
    if (clean === 'three' || clean === 'threejs') return [VISEME_SHAPES.TH, VISEME_SHAPES.E];
    if (clean === 'full') return [VISEME_SHAPES.FV, VISEME_SHAPES.U, VISEME_SHAPES.L];
    if (clean === 'stack') return [VISEME_SHAPES.TH, VISEME_SHAPES.A, VISEME_SHAPES.TH];
    if (clean === 'developer') return [VISEME_SHAPES.TH, VISEME_SHAPES.E, VISEME_SHAPES.FV, VISEME_SHAPES.E, VISEME_SHAPES.L, VISEME_SHAPES.O, VISEME_SHAPES.MBP, VISEME_SHAPES.E];
    if (clean === 'applications') return [VISEME_SHAPES.A, VISEME_SHAPES.MBP, VISEME_SHAPES.L, VISEME_SHAPES.E, VISEME_SHAPES.TH, VISEME_SHAPES.A, VISEME_SHAPES.TH];
    if (clean === 'who' || clean === 'you') return [VISEME_SHAPES.U];
    if (clean === 'builds' || clean === 'built') return [VISEME_SHAPES.MBP, VISEME_SHAPES.E, VISEME_SHAPES.L, VISEME_SHAPES.TH];

    let i = 0;
    while (i < clean.length) {
      const ch = clean[i];
      const next = clean[i + 1] || '';
      const pair = ch + next;

      if (pair === 'th' || pair === 'sh' || pair === 'ch' || pair === 'st') {
        result.push(VISEME_SHAPES.TH);
        i += 2;
      } else if (pair === 'ee' || pair === 'ea' || pair === 'ie') {
        result.push(VISEME_SHAPES.E);
        i += 2;
      } else if (pair === 'oo' || pair === 'ou') {
        result.push(VISEME_SHAPES.U);
        i += 2;
      } else if (pair === 'oa' || pair === 'ow') {
        result.push(VISEME_SHAPES.O);
        i += 2;
      } else if (ch === 'a') {
        result.push(VISEME_SHAPES.A);
        i++;
      } else if (ch === 'e') {
        result.push(VISEME_SHAPES.E);
        i++;
      } else if (ch === 'i' || ch === 'y') {
        result.push(VISEME_SHAPES.E);
        i++;
      } else if (ch === 'o') {
        result.push(VISEME_SHAPES.O);
        i++;
      } else if (ch === 'u') {
        result.push(VISEME_SHAPES.U);
        i++;
      } else if (ch === 'm' || ch === 'b' || ch === 'p') {
        result.push(VISEME_SHAPES.MBP);
        i++;
      } else if (ch === 'f' || ch === 'v') {
        result.push(VISEME_SHAPES.FV);
        i++;
      } else if (ch === 'l') {
        result.push(VISEME_SHAPES.L);
        i++;
      } else if (ch === 'w') {
        result.push(VISEME_SHAPES.U);
        i++;
      } else {
        result.push(VISEME_SHAPES.TH);
        i++;
      }
    }

    return result.length > 0 ? result : [VISEME_SHAPES.A];
  }

  /**
   * Called on every animation frame in Three.js renderer
   * Computes smooth interpolated viseme state for the current millisecond
   */
  update(lerpFactor = 0.3) {
    if (!this.isPlaying || this.timeline.length === 0) {
      this.targetViseme = VISEME_SHAPES.rest;
    } else {
      const elapsedMs = performance.now() - this.speechStartTime;

      if (elapsedMs >= this.totalDurationMs + 100) {
        this.targetViseme = VISEME_SHAPES.rest;
      } else {
        // Find active viseme in timeline
        const activeItem = this.timeline.find(
          (item) => elapsedMs >= item.startMs && elapsedMs < item.endMs
        );
        this.targetViseme = activeItem ? activeItem.viseme : VISEME_SHAPES.rest;
      }
    }

    // Smooth anatomical interpolation
    const target = this.targetViseme;
    this.currentViseme.openY += (target.openY - this.currentViseme.openY) * lerpFactor;
    this.currentViseme.scaleX += (target.scaleX - this.currentViseme.scaleX) * lerpFactor;
    this.currentViseme.scaleY += (target.scaleY - this.currentViseme.scaleY) * lerpFactor;
    this.currentViseme.opacity += (target.opacity - this.currentViseme.opacity) * Math.min(1.0, lerpFactor * 1.6);

    return this.currentViseme;
  }
}

export const visemeEngine = new VisemeEngine();
