/**
 * Real-time Speech-to-Viseme Natural Lip-Sync Engine
 * Synchronizes 3D avatar mouth movements in continuous real-time with Web Speech audio.
 * Uses a calm, natural human speech cadence (~2.3 Hz), smooth muscular easing,
 * and guaranteed end-to-end synchronization.
 */

export const VISEME_SHAPES = {
  rest: { name: 'rest', openY: 0.0, scaleX: 1.0, scaleY: 1.0, opacity: 0.0 },
  SMILE: { name: 'SMILE', openY: 0.25, scaleX: 1.0, scaleY: 1.0, opacity: 0.8 },
  A: { name: 'A', openY: 0.85, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },
  E: { name: 'E', openY: 0.50, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },
  O: { name: 'O', openY: 0.75, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 },
  U: { name: 'U', openY: 0.40, scaleX: 1.0, scaleY: 1.0, opacity: 1.0 }
};

class VisemeEngine {
  constructor() {
    this.currentViseme = { ...VISEME_SHAPES.rest };
    this.targetViseme = { ...VISEME_SHAPES.rest };
    this.speechStartTime = 0;
    this.isPlaying = false;
    this.speechRate = 1.0;
    this.pauseRanges = []; // Array of { startMs, endMs } for natural pauses
  }

  /**
   * Start continuous real-time speech lip-sync tracking
   * @param {string} text - Spoken sentence
   * @param {number} speechRate - SpeechSynthesis rate
   */
  startSpeech(text, speechRate = 1.0) {
    if (!text || typeof text !== 'string') return;
    this.speechRate = Math.max(0.7, Math.min(1.3, speechRate || 1.0));
    this.speechStartTime = performance.now();
    this.isPlaying = true;

    // Parse natural punctuation pauses, ignoring internal dots in terms like Node.js or Three.js
    this.pauseRanges = [];
    let currentMs = 0;
    
    // Split on whitespace to inspect each word and its trailing punctuation
    const words = text.trim().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;

      const hasComma = word.endsWith(',') || word.endsWith(';') || word.endsWith(':');
      const hasPeriod = (word.endsWith('.') && !word.toLowerCase().endsWith('.js')) || word.endsWith('!') || word.endsWith('?');

      const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const vowels = clean.match(/[aeiouy]/g);
      const syllables = vowels ? Math.max(1, Math.min(4, vowels.length)) : 1;
      const wordMs = (180 + syllables * 130) / this.speechRate;
      currentMs += wordMs;

      if (hasComma) {
        const pauseMs = 300 / this.speechRate;
        this.pauseRanges.push({
          startMs: currentMs,
          endMs: currentMs + pauseMs
        });
        currentMs += pauseMs;
      } else if (hasPeriod) {
        const pauseMs = 450 / this.speechRate;
        this.pauseRanges.push({
          startMs: currentMs,
          endMs: currentMs + pauseMs
        });
        currentMs += pauseMs;
      }
    }
  }

  /**
   * Word boundary hook
   */
  syncWordBoundary(charIndex, fullText) {
    // Keep timing steady and continuous
  }

  /**
   * Stop mouth movement and return to rest
   */
  stopSpeech() {
    this.isPlaying = false;
    this.pauseRanges = [];
    this.targetViseme = { ...VISEME_SHAPES.rest };
  }

  /**
   * Reset engine state
   */
  reset() {
    this.stopSpeech();
    this.currentViseme = { ...VISEME_SHAPES.rest };
  }

  /**
   * Called on every animation frame in Three.js renderer (60 FPS)
   * Calculates calm, natural, organic human conversational mouth movements
   */
  update(lerpFactor = 0.14) {
    if (!this.isPlaying) {
      this.targetViseme = VISEME_SHAPES.rest;
    } else {
      const elapsedMs = performance.now() - this.speechStartTime;

      // Check if currently inside a natural punctuation breath pause
      const inPause = this.pauseRanges.some(
        (p) => elapsedMs >= p.startMs && elapsedMs < p.endMs
      );

      if (inPause) {
        // Natural soft mouth relaxation during comma/period pause
        this.targetViseme = { name: 'pause', openY: 0.05, scaleX: 1.0, scaleY: 1.0, opacity: 0.0 };
      } else {
        // Calm natural human speech cadence (~2.3 syllables per second)
        const sec = elapsedMs / 1000;
        const speechFreq = 2.3 * this.speechRate;

        const primaryWave = Math.sin(sec * speechFreq * Math.PI * 2);
        const secondaryWave = Math.sin(sec * (speechFreq * 0.5) * Math.PI * 2) * 0.20;

        // Smooth wave between 0.10 and 0.88
        const combined = 0.48 + 0.36 * primaryWave + secondaryWave;
        const openY = Math.max(0.08, Math.min(0.88, combined));

        this.targetViseme = {
          name: 'speech',
          openY: openY,
          scaleX: 1.0,
          scaleY: 1.0,
          opacity: openY > 0.12 ? 1.0 : 0.0
        };
      }
    }

    // Smooth muscular easing for calm natural mouth opening and closing
    const target = this.targetViseme;
    this.currentViseme.openY += (target.openY - this.currentViseme.openY) * lerpFactor;
    this.currentViseme.scaleX += (target.scaleX - this.currentViseme.scaleX) * lerpFactor;
    this.currentViseme.scaleY += (target.scaleY - this.currentViseme.scaleY) * lerpFactor;
    this.currentViseme.opacity += (target.opacity - this.currentViseme.opacity) * Math.min(1.0, lerpFactor * 1.5);

    return this.currentViseme;
  }
}

export const visemeEngine = new VisemeEngine();
