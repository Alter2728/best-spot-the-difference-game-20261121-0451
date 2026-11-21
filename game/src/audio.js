// Sound effects for Double Take, synthesized with WebAudio — no audio files. A soft
// pop rewards each find, a low thud marks a miss, a little arpeggio celebrates a
// cleared scene, and a falling tone calls time up. Everything is created lazily on
// the first user gesture, as browsers require, and can be muted.

let audioContext = null;
let muted = false;

function context() {
  if (!audioContext) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioContext = new AC();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function tone(freq, start, duration, type = 'sine', gainPeak = 0.16) {
  const ctx = context();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(gainPeak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export function playFind() {
  tone(660, 0, 0.12, 'sine', 0.18);
  tone(990, 0.07, 0.18, 'sine', 0.16);
}

export function playMiss() {
  tone(140, 0, 0.22, 'triangle', 0.2);
  tone(98, 0.05, 0.24, 'triangle', 0.16);
}

export function playHint() {
  tone(880, 0, 0.1, 'sine', 0.12);
  tone(1174, 0.09, 0.14, 'sine', 0.12);
}

export function playClear() {
  [523, 659, 784, 1046].forEach((freq, i) => tone(freq, i * 0.11, 0.3, 'sine', 0.16));
}

export function playTimeUp() {
  [392, 330, 262].forEach((freq, i) => tone(freq, i * 0.16, 0.3, 'triangle', 0.16));
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}
