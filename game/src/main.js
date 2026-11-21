// Double Take: boot, rendering and wiring. The two pictures are painted once per scene
// into offscreen canvases (scenes.js); each frame blits them and draws the living
// layer on top — found rings with a pop, hint pulses, miss crosses and the mirrored
// pointer ring that appears on both pictures at once.

import { PANEL_H, PANEL_W } from './draw.js';
import { SCENES, renderPanel } from './scenes.js';
import { CLEARED, FINISHED, Game, TIMEUP } from './game.js';
import { createInput } from './input.js';
import { buildLevelPicker, hideOverlay, hudNodes, refreshClock, refreshHud, showOverlay } from './hud.js';
import { isMuted, playClear, playFind, playHint, playMiss, playTimeUp, setMuted } from './audio.js';
import { stageShot } from './shots.js';

const leftCanvas = document.getElementById('panel-left');
const rightCanvas = document.getElementById('panel-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

const game = new Game(SCENES);
const view = { foundAt: new Map(), misses: [], hint: null };
let leftPanel = null;
let rightPanel = null;
let toastTimer = 0;

const toast = document.createElement('div');
toast.id = 'toast';
document.getElementById('panels').appendChild(toast);

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

function loadScene(index) {
  game.startScene(index);
  view.foundAt.clear();
  view.misses.length = 0;
  view.hint = null;
  leftPanel = renderPanel(game.scene, 'left');
  rightPanel = renderPanel(game.scene, 'right');
  hideOverlay();
  buildLevelPicker(SCENES, game.sceneIndex, game.clearedScenes, loadScene);
  refreshHud(game);
}

function endOfSceneOverlay() {
  if (game.state === CLEARED) {
    playClear();
    showOverlay({
      title: 'Scene clear!',
      stars: game.stars(),
      text: `You found all ${game.scene.diffs.length} differences in ${game.scene.name}.\nScene score ${game.sceneScore} · total ${game.totalScore}`,
      primaryLabel: 'Next scene',
      secondaryLabel: 'Play again',
      onPrimary: () => loadScene(game.sceneIndex + 1),
      onSecondary: () => loadScene(game.sceneIndex),
    });
  } else if (game.state === FINISHED) {
    playClear();
    showOverlay({
      title: 'All five scenes clear!',
      stars: game.stars(),
      text: `Every last difference found. Final score ${game.totalScore}.`,
      primaryLabel: 'Play again',
      secondaryLabel: 'Replay this scene',
      onPrimary: () => { game.totalScore = 0; game.clearedScenes.clear(); loadScene(0); },
      onSecondary: () => loadScene(game.sceneIndex),
    });
  } else if (game.state === TIMEUP) {
    playTimeUp();
    showOverlay({
      title: 'Time up!',
      stars: 0,
      text: `${game.remainingCount} difference${game.remainingCount === 1 ? '' : 's'} still hiding in ${game.scene.name}.`,
      primaryLabel: 'Try again',
      secondaryLabel: 'Skip scene',
      onPrimary: () => loadScene(game.sceneIndex),
      onSecondary: () => loadScene((game.sceneIndex + 1) % SCENES.length),
    });
  }
}

function onMark(x, y) {
  const outcome = game.mark(x, y);
  if (outcome.result === 'found') {
    view.foundAt.set(outcome.diff.id, performance.now());
    if (view.hint && view.hint.diff.id === outcome.diff.id) view.hint = null;
    playFind();
    showToast(`Found: ${outcome.diff.label}`);
  } else if (outcome.result === 'miss') {
    view.misses.push({ x, y, at: performance.now() });
    playMiss();
  }
  refreshHud(game);
  if (game.state !== 'playing') endOfSceneOverlay();
}

function onHint() {
  const target = game.useHint();
  if (target) {
    view.hint = { diff: target, until: performance.now() + 1600 };
    playHint();
  }
  refreshHud(game);
}

function onRestart() {
  loadScene(game.sceneIndex);
}

function onMute() {
  setMuted(!isMuted());
  const button = document.getElementById('mute-button');
  button.textContent = isMuted() ? 'Sound: off' : 'Sound: on';
  button.setAttribute('aria-pressed', String(isMuted()));
}

const pointer = createInput([leftCanvas, rightCanvas], { onMark, onHint, onRestart, onMute });
hudNodes.hintButton.addEventListener('click', onHint);
document.getElementById('restart-button').addEventListener('click', onRestart);
document.getElementById('mute-button').addEventListener('click', onMute);

/* ---------- drawing the living layer ---------- */

function easeOutBack(t) {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

function drawFoundMarker(ctx, diff, now) {
  const age = Math.min(1, (now - (view.foundAt.get(diff.id) ?? 0)) / 300);
  const scale = age >= 1 ? 1 : Math.max(0.2, easeOutBack(age));
  const r = Math.max(diff.r, 26) * scale;
  ctx.save();
  ctx.strokeStyle = '#1f9d6c';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  // check badge
  const bx = diff.x + r * 0.72;
  const by = diff.y - r * 0.72;
  ctx.beginPath();
  ctx.arc(bx, by, 11, 0, Math.PI * 2);
  ctx.fillStyle = '#1f9d6c';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(bx - 5, by);
  ctx.lineTo(bx - 1.5, by + 4);
  ctx.lineTo(bx + 5.5, by - 4.5);
  ctx.stroke();
  ctx.restore();
}

function drawHintPulse(ctx, now) {
  if (!view.hint) return;
  if (!view.hint.frozen && now > view.hint.until) {
    view.hint = null;
    return;
  }
  const diff = view.hint.diff;
  const phase = view.hint.frozen ? 0.35 : ((now / 550) % 1);
  for (const offset of [0, 0.5]) {
    const t = (phase + offset) % 1;
    const r = 12 + t * (Math.max(diff.r, 26) + 16);
    ctx.save();
    ctx.globalAlpha = 0.85 * (1 - t);
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.strokeStyle = '#d9822b';
  ctx.lineWidth = 3;
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, Math.max(diff.r, 26), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMisses(ctx, now) {
  view.misses = view.misses.filter((m) => now - m.at < 650);
  for (const miss of view.misses) {
    const t = (now - miss.at) / 650;
    ctx.save();
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = '#e4572e';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const s = 11 + t * 5;
    ctx.beginPath();
    ctx.moveTo(miss.x - s, miss.y - s);
    ctx.lineTo(miss.x + s, miss.y + s);
    ctx.moveTo(miss.x + s, miss.y - s);
    ctx.lineTo(miss.x - s, miss.y + s);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPointer(ctx) {
  if (!pointer.active || game.state !== 'playing') return;
  ctx.save();
  ctx.strokeStyle = 'rgba(34,48,74,0.85)';
  ctx.lineWidth = 2.4;
  if (pointer.mode === 'keys') {
    ctx.beginPath();
    ctx.moveTo(pointer.x - 16, pointer.y);
    ctx.lineTo(pointer.x - 5, pointer.y);
    ctx.moveTo(pointer.x + 5, pointer.y);
    ctx.lineTo(pointer.x + 16, pointer.y);
    ctx.moveTo(pointer.x, pointer.y - 16);
    ctx.lineTo(pointer.x, pointer.y - 5);
    ctx.moveTo(pointer.x, pointer.y + 5);
    ctx.lineTo(pointer.x, pointer.y + 16);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(34,48,74,0.85)';
  ctx.fill();
  ctx.restore();
}

function drawPanel(ctx, panelImage, now) {
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  if (panelImage) ctx.drawImage(panelImage, 0, 0);
  for (const diff of game.scene.diffs) {
    if (game.found.has(diff.id)) drawFoundMarker(ctx, diff, now);
  }
  drawHintPulse(ctx, now);
  drawMisses(ctx, now);
  drawPointer(ctx);
}

/* ---------- main loop ---------- */

const shotName = new URLSearchParams(window.location.search).get('shot');
const shotMode = shotName !== null;

loadScene(0);
if (shotMode && stageShot(shotName, game, view, pointer)) {
  leftPanel = renderPanel(game.scene, 'left');
  rightPanel = renderPanel(game.scene, 'right');
  buildLevelPicker(SCENES, game.sceneIndex, game.clearedScenes, loadScene);
  refreshHud(game);
  if (game.state !== 'playing') endOfSceneOverlay();
}

let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  if (!shotMode) {
    if (game.tick(dt) === 'timeup') {
      refreshHud(game);
      endOfSceneOverlay();
    } else if (game.state === 'playing') {
      refreshClock(game);
    }
  }
  drawPanel(leftCtx, leftPanel, now);
  drawPanel(rightCtx, rightPanel, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
