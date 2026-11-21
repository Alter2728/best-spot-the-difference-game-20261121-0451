// The rules of Double Take, kept free of DOM and canvas so the logic can be exercised
// headlessly: scene progression, the countdown clock, marking differences, misses,
// hints, scoring and stars. Rendering and input live in main.js, hud.js and input.js.

import { differenceAt } from './scenes.js';

export const PLAYING = 'playing';
export const CLEARED = 'cleared';
export const TIMEUP = 'timeup';
export const FINISHED = 'finished';

export const POINTS_PER_FIND = 100;
export const POINTS_PER_MISS = -25;
export const MISS_TIME_PENALTY = 5;
export const HINTS_PER_SCENE = 3;
export const TIME_BONUS_PER_SECOND = 2;

export class Game {
  constructor(scenes) {
    this.scenes = scenes;
    this.sceneIndex = 0;
    this.totalScore = 0;
    this.clearedScenes = new Set();
    this.startScene(0);
  }

  get scene() {
    return this.scenes[this.sceneIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  get remainingCount() {
    return this.scene.diffs.length - this.found.size;
  }

  /** Reset to a fresh attempt at scene `index`, keeping the running total score. */
  startScene(index) {
    this.sceneIndex = index;
    this.state = PLAYING;
    this.found = new Set();
    this.mistakes = 0;
    this.hintsLeft = HINTS_PER_SCENE;
    this.sceneScore = 0;
    this.timeLeft = this.scene.timeLimit;
    this.lastFound = null;
    this.hintTarget = null;
  }

  /**
   * Try to mark a difference at panel coordinates (x, y). Returns one of:
   * { result: 'found', diff } | { result: 'already', diff } | { result: 'miss' } |
   * { result: 'over' } when the scene is no longer being played.
   */
  mark(x, y) {
    if (this.state !== PLAYING) return { result: 'over' };
    const diff = differenceAt(this.scene, x, y);
    if (diff && !this.found.has(diff.id)) {
      this.found.add(diff.id);
      this.lastFound = diff;
      this.sceneScore += POINTS_PER_FIND;
      if (this.remainingCount === 0) this.clearScene();
      return { result: 'found', diff };
    }
    if (diff) return { result: 'already', diff };
    this.mistakes += 1;
    this.sceneScore = Math.max(0, this.sceneScore + POINTS_PER_MISS);
    this.timeLeft = Math.max(0, this.timeLeft - MISS_TIME_PENALTY);
    if (this.timeLeft === 0) this.state = TIMEUP;
    return { result: 'miss' };
  }

  /** Spend a hint: returns a random still-hidden difference, or null when none is left. */
  useHint(random = Math.random) {
    if (this.state !== PLAYING || this.hintsLeft <= 0) return null;
    const hidden = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (hidden.length === 0) return null;
    this.hintsLeft -= 1;
    this.hintTarget = hidden[Math.floor(random() * hidden.length)];
    return this.hintTarget;
  }

  /** Advance the clock by dt seconds. Returns 'timeup' on the frame time runs out. */
  tick(dt) {
    if (this.state !== PLAYING) return null;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft === 0) {
      this.state = TIMEUP;
      return 'timeup';
    }
    return null;
  }

  clearScene() {
    this.state = this.sceneIndex === this.scenes.length - 1 ? FINISHED : CLEARED;
    this.sceneScore += Math.round(this.timeLeft) * TIME_BONUS_PER_SECOND;
    this.totalScore += this.sceneScore;
    this.clearedScenes.add(this.sceneIndex);
  }

  /** 1–3 stars for the current scene, from misses alone. */
  stars() {
    if (this.mistakes === 0) return 3;
    if (this.mistakes <= 3) return 2;
    return 1;
  }

  /** Seconds as m:ss for the HUD clock. */
  static formatTime(seconds) {
    const whole = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
  }
}
