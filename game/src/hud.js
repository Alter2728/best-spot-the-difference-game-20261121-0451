// The heads-up display: scene name, found and remaining counters with pips, the
// countdown clock and its bar, score, misses, hint count, the scene picker and the
// end-of-scene overlay. Pure DOM updates — game state comes from game.js.

import { Game } from './game.js';

const el = (id) => document.getElementById(id);

const nodes = {
  levelName: el('level-name'),
  foundCount: el('found-count'),
  foundPips: el('found-pips'),
  remainCount: el('remain-count'),
  timeBox: el('time-box'),
  timeLeft: el('time-left'),
  timeFill: el('time-fill'),
  scoreCount: el('score-count'),
  mistakeCount: el('mistake-count'),
  hintButton: el('hint-button'),
  hintCount: el('hint-count'),
  levelPicker: el('level-picker'),
  overlay: el('overlay'),
  overlayTitle: el('overlay-title'),
  overlayStars: el('overlay-stars'),
  overlayText: el('overlay-text'),
  overlayPrimary: el('overlay-primary'),
  overlaySecondary: el('overlay-secondary'),
};

export function refreshHud(game) {
  const total = game.scene.diffs.length;
  nodes.levelName.textContent = `${game.sceneIndex + 1}. ${game.scene.name}`;
  nodes.foundCount.textContent = `${game.foundCount} / ${total}`;
  nodes.foundPips.textContent = game.scene.diffs.map((d) => (game.found.has(d.id) ? '●' : '○')).join(' ');
  const remaining = game.remainingCount;
  nodes.remainCount.textContent = remaining === 1 ? '1 to find' : `${remaining} to find`;
  nodes.scoreCount.textContent = String(game.totalScore + (game.state === 'playing' || game.state === 'timeup' ? game.sceneScore : 0));
  nodes.mistakeCount.textContent = String(game.mistakes);
  nodes.hintCount.textContent = `(${game.hintsLeft})`;
  nodes.hintButton.disabled = game.hintsLeft <= 0 || game.state !== 'playing';
  refreshClock(game);
}

export function refreshClock(game) {
  nodes.timeLeft.textContent = Game.formatTime(game.timeLeft);
  const fraction = Math.max(0, Math.min(1, game.timeLeft / game.scene.timeLimit));
  nodes.timeFill.style.width = `${Math.round(fraction * 100)}%`;
  nodes.timeBox.classList.toggle('low', game.timeLeft <= 30 && game.state === 'playing');
}

export function buildLevelPicker(scenes, currentIndex, clearedScenes, onPick) {
  nodes.levelPicker.replaceChildren();
  scenes.forEach((scene, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = clearedScenes.has(index) ? `${index + 1} ✓` : String(index + 1);
    button.title = scene.name;
    if (index === currentIndex) button.classList.add('current');
    if (clearedScenes.has(index)) button.classList.add('cleared');
    button.addEventListener('click', () => onPick(index));
    nodes.levelPicker.appendChild(button);
  });
}

export function showOverlay({ title, stars, text, primaryLabel, secondaryLabel, onPrimary, onSecondary }) {
  nodes.overlayTitle.textContent = title;
  nodes.overlayStars.textContent = stars ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  nodes.overlayText.textContent = text;
  nodes.overlayPrimary.textContent = primaryLabel;
  nodes.overlaySecondary.textContent = secondaryLabel;
  nodes.overlayPrimary.onclick = onPrimary;
  nodes.overlaySecondary.onclick = onSecondary;
  nodes.overlay.hidden = false;
  nodes.overlayPrimary.focus();
}

export function hideOverlay() {
  nodes.overlay.hidden = true;
}

export const hudNodes = nodes;
