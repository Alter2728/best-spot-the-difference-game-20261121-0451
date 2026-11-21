// Mouse and keyboard input for the two panels. The pointer lives in panel coordinates
// (600 by 450) no matter which picture the player is looking at, so the renderer can
// mirror its ring onto both pictures. Arrow keys take over as a crosshair; Enter or
// Space marks, H asks for a hint, R restarts the scene and M toggles sound.

import { PANEL_H, PANEL_W } from './draw.js';

const KEY_STEP = 10;
const KEY_STEP_FINE = 2;

export function createInput(canvases, callbacks) {
  const pointer = { x: PANEL_W / 2, y: PANEL_H / 2, active: false, mode: 'mouse' };

  function toPanelCoords(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
      y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
    };
  }

  for (const canvas of canvases) {
    canvas.addEventListener('mousemove', (event) => {
      const pos = toPanelCoords(canvas, event);
      pointer.x = pos.x;
      pointer.y = pos.y;
      pointer.active = true;
      pointer.mode = 'mouse';
    });
    canvas.addEventListener('mouseleave', () => {
      if (pointer.mode === 'mouse') pointer.active = false;
    });
    canvas.addEventListener('click', (event) => {
      const pos = toPanelCoords(canvas, event);
      pointer.x = pos.x;
      pointer.y = pos.y;
      pointer.active = true;
      pointer.mode = 'mouse';
      callbacks.onMark(pos.x, pos.y);
    });
  }

  window.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? KEY_STEP_FINE : KEY_STEP;
    switch (event.key) {
      case 'ArrowLeft':
        pointer.x = Math.max(0, pointer.x - step);
        break;
      case 'ArrowRight':
        pointer.x = Math.min(PANEL_W, pointer.x + step);
        break;
      case 'ArrowUp':
        pointer.y = Math.max(0, pointer.y - step);
        break;
      case 'ArrowDown':
        pointer.y = Math.min(PANEL_H, pointer.y + step);
        break;
      case 'Enter':
      case ' ':
        if (pointer.active) callbacks.onMark(pointer.x, pointer.y);
        event.preventDefault();
        return;
      case 'h':
      case 'H':
        callbacks.onHint();
        return;
      case 'r':
      case 'R':
        callbacks.onRestart();
        return;
      case 'm':
      case 'M':
        callbacks.onMute();
        return;
      default:
        return;
    }
    pointer.active = true;
    pointer.mode = 'keys';
    event.preventDefault();
  });

  return pointer;
}
