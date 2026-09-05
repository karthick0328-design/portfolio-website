/**
 * Viseme Engine for Speech Lip Synchronization
 * Maps English words, phonemes, and SpeechSynthesis word boundaries
 * into natural 3D mouth viseme states (open, wide, round, closed, etc.).
 */

export const VISEMES = {
  NEUTRAL: { name: 'neutral', openY: 0.0, scaleX: 1.0, scaleY: 1.0, opacity: 0.0 },
  AA: { name: 'aa', openY: 0.95, scaleX: 1.05, scaleY: 1.25, opacity: 1.0 },       // 'ah', 'car', 'hot', 'part'
  EE: { name: 'ee', openY: 0.38, scaleX: 1.30, scaleY: 0.85, opacity: 1.0 },       // 'react', 'see', 'feel', 'me'
  OH: { name: 'oh', openY: 0.80, scaleX: 0.82, scaleY: 1.25, opacity: 1.0 },       // 'code', 'go', 'node', 'know'
  OO: { name: 'oo', openY: 0.50, scaleX: 0.70, scaleY: 1.15, opacity: 1.0 },       // 'you', 'full', 'to', 'through'
  EH: { name: 'eh', openY: 0.65, scaleX: 1.18, scaleY: 1.00, opacity: 1.0 },       // 'developer', 'web', 'get', 'tech'
  IH: { name: 'ih', openY: 0.45, scaleX: 1.15, scaleY: 0.90, opacity: 1.0 },       // 'is', 'in', 'skills', 'built'
  BMP: { name: 'bmp', openY: 0.04, scaleX: 1.02, scaleY: 0.55, opacity: 0.15 },     // 'pandi', 'built', 'my', 'be'
  FV: { name: 'fv', openY: 0.28, scaleX: 1.05, scaleY: 0.75, opacity: 0.90 },       // 'full', 'for', 'view', 'five'
  CDGK: { name: 'cdgk', openY: 0.42, scaleX: 1.10, scaleY: 0.90, opacity: 0.95 },   // 'tech', 'data', 'just', 'can'
  WQ: { name: 'wq', openY: 0.60, scaleX: 0.76, scaleY: 1.15, opacity: 1.0 },       // 'work', 'with', 'one', 'what'
};

class VisemeEngine {
  constructor() {
    this.currentViseme = { ...VISEMES.NEUTRAL };
    this.targetViseme = { ...VISEMES.NEUTRAL };
    this.scheduledQueue = [];
    this.queueTimer = null;
    this.listeners = new Set();
  }

  /**
   * Subscribe to real-time viseme updates
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notify(viseme) {
    this.listeners.forEach((cb) => cb(viseme));
  }

  /**
   * Reset mouth immediately to neutral closed position
   */
  reset() {
    this._clearQueue();
    this.targetViseme = { ...VISEMES.NEUTRAL };
    this.currentViseme = { ...VISEMES.NEUTRAL };
    this._notify(this.currentViseme);
  }

  _clearQueue() {
    if (this.queueTimer) {
      clearTimeout(this.queueTimer);
      this.queueTimer = null;
    }
    this.scheduledQueue = [];
  }

  /**
   * Convert an English word into a realistic sequence of visemes
   */
  wordToVisemes(word) {
    if (!word) return [VISEMES.NEUTRAL];

    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return [VISEMES.NEUTRAL];

    const visemes = [];

    // Check specific known developer terms
    if (clean === 'react') return [VISEMES.CDGK, VISEMES.EE, VISEMES.AA, VISEMES.CDGK];
    if (clean === 'karthick') return [VISEMES.CDGK, VISEMES.AA, VISEMES.CDGK, VISEMES.IH, VISEMES.CDGK];
    if (clean === 'pandi') return [VISEMES.BMP, VISEMES.AA, VISEMES.CDGK, VISEMES.EE];
    if (clean === 'python') return [VISEMES.BMP, VISEMES.AA, VISEMES.CDGK, VISEMES.OH, VISEMES.CDGK];
    if (clean === 'node' || clean === 'nodejs') return [VISEMES.CDGK, VISEMES.OH, VISEMES.CDGK];
    if (clean === 'three' || clean === 'threejs') return [VISEMES.CDGK, VISEMES.EE];
    if (clean === 'developer') return [VISEMES.CDGK, VISEMES.EH, VISEMES.FV, VISEMES.EH, VISEMES.BMP, VISEMES.EH];
    if (clean === 'portfolio') return [VISEMES.BMP, VISEMES.OH, VISEMES.CDGK, VISEMES.FV, VISEMES.OH, VISEMES.OO];
    if (clean === 'full') return [VISEMES.FV, VISEMES.OO, VISEMES.CDGK];
    if (clean === 'stack') return [VISEMES.CDGK, VISEMES.AA, VISEMES.CDGK];
    if (clean === 'ai') return [VISEMES.AA, VISEMES.EE];
    if (clean === 'mongodb') return [VISEMES.BMP, VISEMES.OH, VISEMES.CDGK, VISEMES.OH, VISEMES.CDGK, VISEMES.BMP];

    // General phoneme scanning
    let i = 0;
    while (i < clean.length) {
      const ch = clean[i];
      const nextCh = clean[i + 1] || '';
      const pair = ch + nextCh;

      if (pair === 'th' || pair === 'sh' || pair === 'ch' || pair === 'ck' || pair === 'st') {
        visemes.push(VISEMES.CDGK);
        i += 2;
      } else if (pair === 'ee' || pair === 'ea' || pair === 'ie') {
        visemes.push(VISEMES.EE);
        i += 2;
      } else if (pair === 'oo' || pair === 'ou') {
        visemes.push(VISEMES.OO);
        i += 2;
      } else if (pair === 'oa' || pair === 'ow') {
        visemes.push(VISEMES.OH);
        i += 2;
      } else if (ch === 'a') {
        visemes.push(VISEMES.AA);
        i++;
      } else if (ch === 'e') {
        visemes.push(VISEMES.EH);
        i++;
      } else if (ch === 'i' || ch === 'y') {
        visemes.push(VISEMES.IH);
        i++;
      } else if (ch === 'o') {
        visemes.push(VISEMES.OH);
        i++;
      } else if (ch === 'u') {
        visemes.push(VISEMES.OO);
        i++;
      } else if (ch === 'b' || ch === 'm' || ch === 'p') {
        visemes.push(VISEMES.BMP);
        i++;
      } else if (ch === 'f' || ch === 'v') {
        visemes.push(VISEMES.FV);
        i++;
      } else if (ch === 'w' || ch === 'q') {
        visemes.push(VISEMES.WQ);
        i++;
      } else {
        visemes.push(VISEMES.CDGK);
        i++;
      }
    }

    return visemes.length > 0 ? visemes : [VISEMES.AA];
  }

  /**
   * Called on SpeechSynthesis word boundary event
   * @param {string} word - The word being spoken right now
   * @param {number} estimatedDurationMs - Estimated duration of this word (ms)
   */
  processWordBoundary(word, estimatedDurationMs = 240) {
    this._clearQueue();

    const sequence = this.wordToVisemes(word);
    const durationPerViseme = Math.max(50, Math.floor(estimatedDurationMs / sequence.length));

    // Schedule each viseme sequentially
    sequence.forEach((viseme, index) => {
      this.scheduledQueue.push({
        viseme,
        time: index * durationPerViseme
      });
    });

    // Add trailing brief release towards neutral between words
    this.scheduledQueue.push({
      viseme: VISEMES.NEUTRAL,
      time: sequence.length * durationPerViseme + 40
    });

    this._runQueue();
  }

  _runQueue() {
    if (this.scheduledQueue.length === 0) return;

    const item = this.scheduledQueue.shift();
    this.targetViseme = item.viseme;
    this._notify(this.targetViseme);

    if (this.scheduledQueue.length > 0) {
      const nextTime = this.scheduledQueue[0].time - item.time;
      this.queueTimer = setTimeout(() => {
        this._runQueue();
      }, Math.max(25, nextTime));
    }
  }

  /**
   * Get current interpolated viseme properties for Three.js render frame
   * @param {number} lerpFactor - Smoothing speed (0.1 to 0.4)
   */
  update(lerpFactor = 0.28) {
    const target = this.targetViseme;

    this.currentViseme.openY += (target.openY - this.currentViseme.openY) * lerpFactor;
    this.currentViseme.scaleX += (target.scaleX - this.currentViseme.scaleX) * lerpFactor;
    this.currentViseme.scaleY += (target.scaleY - this.currentViseme.scaleY) * lerpFactor;
    this.currentViseme.opacity += (target.opacity - this.currentViseme.opacity) * Math.min(1.0, lerpFactor * 1.5);

    return this.currentViseme;
  }
}

export const visemeEngine = new VisemeEngine();
