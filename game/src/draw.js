// Canvas painters for Double Take. Every visible thing in the five scenes is drawn here
// from code — no image files. A painter factory takes its position and returns a
// function (ctx, variant) that draws the element; variant 0 is the original picture and
// variant 1 is the changed one, used only by elements that hide a difference.

export const PANEL_W = 600;
export const PANEL_H = 450;

/* ---------- tiny drawing helpers ---------- */

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function rrect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function tri(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, stroke, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function star(ctx, x, y, r, fill, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / points) * i - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function cloud(ctx, x, y, s, fill = '#ffffff') {
  ellipse(ctx, x, y, 34 * s, 15 * s, fill);
  ellipse(ctx, x - 24 * s, y + 5 * s, 22 * s, 11 * s, fill);
  ellipse(ctx, x + 25 * s, y + 5 * s, 24 * s, 12 * s, fill);
  ellipse(ctx, x + 2 * s, y - 9 * s, 22 * s, 13 * s, fill);
}

export function skyGradient(ctx, top, bottom, height = PANEL_H) {
  const g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, height);
}

/* ---------- shared elements ---------- */

export function makeSun(x, y, r) {
  return (ctx) => {
    ctx.strokeStyle = '#f7b731';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = (Math.PI / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * (r + 5), y + Math.sin(a) * (r + 5));
      ctx.lineTo(x + Math.cos(a) * (r + 17), y + Math.sin(a) * (r + 17));
      ctx.stroke();
    }
    circle(ctx, x, y, r, '#ffd93b');
    circle(ctx, x - r * 0.3, y - r * 0.3, r * 0.45, '#ffe97a');
  };
}

export function makeGull(x, y, s) {
  return (ctx, v) => {
    if (v === 1) return; // the changed picture lost this gull
    ctx.strokeStyle = '#3d5a73';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x - 11 * s, y, 11 * s, Math.PI * 1.15, Math.PI * 1.95);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 11 * s, y, 11 * s, Math.PI * 1.05, Math.PI * 1.85);
    ctx.stroke();
  };
}

export function makeCat(x, y, s, fur = '#f4a259') {
  // Sitting cat seen from the front; variant 1 closes its eyes (kitchen scene).
  return (ctx, v) => {
    ellipse(ctx, x, y, 26 * s, 20 * s, fur); // body
    circle(ctx, x, y - 26 * s, 17 * s, fur); // head
    tri(ctx, x - 15 * s, y - 36 * s, x - 6 * s, y - 50 * s, x - 2 * s, y - 34 * s, fur);
    tri(ctx, x + 15 * s, y - 36 * s, x + 6 * s, y - 50 * s, x + 2 * s, y - 34 * s, fur);
    // tail curling round the side
    ctx.strokeStyle = fur;
    ctx.lineWidth = 7 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x + 24 * s, y + 8 * s, 13 * s, -0.4, 2.2);
    ctx.stroke();
    // chest patch
    ellipse(ctx, x, y - 4 * s, 10 * s, 12 * s, '#fff3e0');
    // eyes
    if (v === 1) {
      line(ctx, x - 10 * s, y - 27 * s, x - 4 * s, y - 27 * s, '#5b3a1e', 2.4 * s);
      line(ctx, x + 4 * s, y - 27 * s, x + 10 * s, y - 27 * s, '#5b3a1e', 2.4 * s);
    } else {
      circle(ctx, x - 7 * s, y - 27 * s, 2.6 * s, '#5b3a1e');
      circle(ctx, x + 7 * s, y - 27 * s, 2.6 * s, '#5b3a1e');
    }
    // nose + whiskers
    tri(ctx, x - 3 * s, y - 20 * s, x + 3 * s, y - 20 * s, x, y - 16 * s, '#e4572e');
    line(ctx, x - 16 * s, y - 19 * s, x - 6 * s, y - 18 * s, '#8a6a45', 1.4 * s);
    line(ctx, x + 6 * s, y - 18 * s, x + 16 * s, y - 19 * s, '#8a6a45', 1.4 * s);
  };
}

/* ---------- Scene 1: Sunny Harbor ---------- */

export function paintHarborSky(ctx) {
  skyGradient(ctx, '#7ec8e3', '#dff4fb', 305);
}

export function paintHarborSea(ctx) {
  const g = ctx.createLinearGradient(0, 300, 0, PANEL_H);
  g.addColorStop(0, '#3d9db8');
  g.addColorStop(1, '#1f6f8b');
  ctx.fillStyle = g;
  ctx.fillRect(0, 300, PANEL_W, PANEL_H - 300);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  const rows = [322, 352, 384, 416];
  for (let r = 0; r < rows.length; r += 1) {
    for (let x = (r % 2) * 26; x < PANEL_W; x += 52) {
      ctx.beginPath();
      ctx.arc(x + 13, rows[r], 13, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
    }
  }
}

export function makeLighthouse(x, baseY) {
  return (ctx) => {
    // rocky point
    ellipse(ctx, x, baseY, 62, 16, '#8d99ae');
    // striped tower
    const w = 46;
    const topY = baseY - 150;
    for (let i = 0; i < 5; i += 1) {
      rect(ctx, x - w / 2 + i * 1.2, topY + i * 30, w - i * 2.4, 30, i % 2 === 0 ? '#e4572e' : '#fffaf0');
    }
    // gallery + lamp room
    rect(ctx, x - 30, topY - 8, 60, 8, '#22304a');
    rect(ctx, x - 16, topY - 34, 32, 26, '#ffd93b');
    rect(ctx, x - 16, topY - 34, 32, 26, 'rgba(34,48,74,0.08)');
    tri(ctx, x - 24, topY - 34, x + 24, topY - 34, x, topY - 52, '#22304a');
    // door + window
    rrect(ctx, x - 8, baseY - 34, 16, 32, 7, '#22304a');
    circle(ctx, x, topY + 62, 6, '#22304a');
  };
}

export function makeLighthouseFlag(x, topY) {
  return (ctx, v) => {
    if (v === 1) return; // flag gone in the changed picture
    line(ctx, x, topY - 52, x, topY - 76, '#22304a', 3);
    tri(ctx, x, topY - 76, x + 26, topY - 69, x, topY - 62, '#e4572e');
  };
}

export function makeSailboat(x, y, s, sailColor, changedSailColor) {
  return (ctx, v) => {
    const sail = v === 1 && changedSailColor ? changedSailColor : sailColor;
    // hull
    ctx.beginPath();
    ctx.moveTo(x - 42 * s, y);
    ctx.lineTo(x + 42 * s, y);
    ctx.lineTo(x + 28 * s, y + 20 * s);
    ctx.lineTo(x - 28 * s, y + 20 * s);
    ctx.closePath();
    ctx.fillStyle = '#8a5a33';
    ctx.fill();
    rect(ctx, x - 42 * s, y - 4 * s, 84 * s, 6 * s, '#6e4525');
    // mast + sails
    line(ctx, x, y - 4 * s, x, y - 78 * s, '#5b3a1e', 3.4 * s);
    tri(ctx, x + 3 * s, y - 74 * s, x + 3 * s, y - 8 * s, x + 36 * s, y - 8 * s, sail);
    tri(ctx, x - 3 * s, y - 66 * s, x - 3 * s, y - 8 * s, x - 28 * s, y - 8 * s, '#fffaf0');
    // wake
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2.4 * s;
    ctx.beginPath();
    ctx.arc(x, y + 24 * s, 34 * s, 0.15, Math.PI - 0.15);
    ctx.stroke();
  };
}

export function paintDock(ctx) {
  rect(ctx, 0, 392, 250, 12, '#a9713f');
  for (let x = 6; x < 250; x += 24) rect(ctx, x, 392, 3, 12, '#8a5a33');
  for (const px of [18, 92, 166, 232]) rect(ctx, px, 404, 12, 34, '#6e4525');
}

export function makeBarrel(x, y) {
  return (ctx, v) => {
    if (v === 2) return; // variant 2 = "only in the changed picture" marker handled by caller
    rrect(ctx, x - 17, y - 40, 34, 40, 6, '#b07d48');
    rect(ctx, x - 17, y - 32, 34, 5, '#7d5527');
    rect(ctx, x - 17, y - 13, 34, 5, '#7d5527');
    ellipse(ctx, x, y - 40, 17, 5, '#c99a63');
  };
}

export function makeShoreHouse(x, y, w, h, wall, roof) {
  return (ctx, v) => {
    rect(ctx, x, y, w, h, wall);
    tri(ctx, x - 8, y, x + w + 8, y, x + w / 2, y - 30, roof);
    rrect(ctx, x + w / 2 - 9, y + h - 30, 18, 30, 3, '#5b3a1e');
    // window: lit amber in the original, dark in the changed picture
    rect(ctx, x + 8, y + 12, 16, 16, v === 1 ? '#33415c' : '#ffd93b');
    rect(ctx, x + w - 24, y + 12, 16, 16, '#ffd93b');
    line(ctx, x + 16, y + 12, x + 16, y + 28, '#5b3a1e', 2);
    line(ctx, x + w - 16, y + 12, x + w - 16, y + 28, '#5b3a1e', 2);
  };
}

export function makeBuoy(x, y) {
  return (ctx) => {
    tri(ctx, x - 14, y + 16, x + 14, y + 16, x, y - 18, '#e4572e');
    rect(ctx, x - 9, y - 2, 18, 7, '#fffaf0');
    circle(ctx, x, y - 22, 5, '#ffd93b');
  };
}

export function makeJumpingFish(x, y) {
  return (ctx) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.5);
    ellipse(ctx, 0, 0, 18, 8, '#f2a541');
    tri(ctx, 14, 0, 26, -9, 26, 9, '#d9822b');
    circle(ctx, -9, -2, 2.4, '#22304a');
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(x - 12, y + 14, 10, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 14, y + 16, 8, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  };
}

/* ---------- Scene 2: Cozy Kitchen ---------- */

export function paintKitchenRoom(ctx) {
  rect(ctx, 0, 0, PANEL_W, 360, '#f7e3bd');
  rect(ctx, 0, 360, PANEL_W, 90, '#b07d48');
  for (let x = 0; x < PANEL_W; x += 60) rect(ctx, x, 360, 3, 90, '#96683a');
  rect(ctx, 0, 352, PANEL_W, 10, '#e8cf9f');
}

export function makeKitchenWindow(x, y) {
  return (ctx, v) => {
    rect(ctx, x, y, 150, 150, '#8a5a33');
    rect(ctx, x + 8, y + 8, 134, 134, '#bfe6f5');
    if (v === 1) {
      cloud(ctx, x + 75, y + 55, 1.1, '#e8eef2'); // a cloud covers the sun
    } else {
      makeSun(x + 48, y + 48, 17)(ctx, 0);
      cloud(ctx, x + 102, y + 42, 0.7);
    }
    ellipse(ctx, x + 40, y + 132, 60, 18, '#8fce6e');
    ellipse(ctx, x + 115, y + 136, 55, 15, '#79bd5c');
    line(ctx, x + 75, y + 8, x + 75, y + 142, '#8a5a33', 5);
    line(ctx, x + 8, y + 75, x + 142, y + 75, '#8a5a33', 5);
    // curtains
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 2);
    ctx.quadraticCurveTo(x + 34, y + 70, x + 8, y + 140);
    ctx.lineTo(x + 30, y + 140);
    ctx.quadraticCurveTo(x + 40, y + 70, x + 26, y + 2);
    ctx.closePath();
    ctx.fillStyle = '#e4572e';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 146, y + 2);
    ctx.quadraticCurveTo(x + 116, y + 70, x + 142, y + 140);
    ctx.lineTo(x + 120, y + 140);
    ctx.quadraticCurveTo(x + 110, y + 70, x + 124, y + 2);
    ctx.closePath();
    ctx.fillStyle = '#e4572e';
    ctx.fill();
    rect(ctx, x - 4, y - 8, 158, 8, '#6e4525');
  };
}

export function makeClock(x, y, r) {
  return (ctx, v) => {
    circle(ctx, x, y, r, '#fffaf0');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#22304a';
    ctx.lineWidth = 5;
    ctx.stroke();
    for (let i = 0; i < 12; i += 1) {
      const a = (Math.PI / 6) * i;
      circle(ctx, x + Math.cos(a) * (r - 9), y + Math.sin(a) * (r - 9), i % 3 === 0 ? 3 : 1.8, '#22304a');
    }
    // original: ten past ten; changed: twenty to five
    const hourAngle = v === 1 ? (4.66 / 12) * Math.PI * 2 - Math.PI / 2 : (10.17 / 12) * Math.PI * 2 - Math.PI / 2;
    const minAngle = v === 1 ? (40 / 60) * Math.PI * 2 - Math.PI / 2 : (10 / 60) * Math.PI * 2 - Math.PI / 2;
    line(ctx, x, y, x + Math.cos(hourAngle) * r * 0.5, y + Math.sin(hourAngle) * r * 0.5, '#22304a', 5);
    line(ctx, x, y, x + Math.cos(minAngle) * r * 0.72, y + Math.sin(minAngle) * r * 0.72, '#22304a', 3.4);
    circle(ctx, x, y, 4, '#e4572e');
  };
}

export function makeShelf(x, y) {
  return (ctx, v) => {
    rect(ctx, x, y, 190, 10, '#8a5a33');
    rect(ctx, x + 12, y + 10, 10, 18, '#6e4525');
    rect(ctx, x + 168, y + 10, 10, 18, '#6e4525');
    const jars = [
      { jx: x + 18, body: '#e4572e', lid: '#22304a' },
      { jx: x + 72, body: '#2a9d8f', lid: '#22304a' },
      { jx: x + 126, body: '#f2a541', lid: '#22304a' },
    ];
    jars.forEach((jar, i) => {
      if (v === 1 && i === 1) return; // middle jar gone
      rrect(ctx, jar.jx, y - 42, 34, 42, 6, jar.body);
      rect(ctx, jar.jx + 3, y - 50, 28, 9, jar.lid);
      rect(ctx, jar.jx + 7, y - 30, 20, 14, '#fffaf0');
    });
  };
}

export function makeHangingLamp(x) {
  return (ctx, v) => {
    line(ctx, x, 0, x, 52, '#22304a', 4);
    if (v === 0) {
      const g = ctx.createRadialGradient(x, 92, 6, x, 92, 95);
      g.addColorStop(0, 'rgba(255,214,90,0.55)');
      g.addColorStop(1, 'rgba(255,214,90,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 100, 0, 200, 200);
    }
    tri(ctx, x - 38, 88, x + 38, 88, x, 50, v === 1 ? '#8d99ae' : '#e4572e');
    circle(ctx, x, 92, 11, v === 1 ? '#c9d2dd' : '#ffe97a');
  };
}

export function paintKitchenTable(ctx) {
  rect(ctx, 170, 312, 280, 14, '#a9713f');
  rect(ctx, 186, 326, 14, 62, '#8a5a33');
  rect(ctx, 420, 326, 14, 62, '#8a5a33');
  // tablecloth runner
  rect(ctx, 250, 312, 120, 14, '#e4572e');
  rect(ctx, 250, 326, 120, 16, '#e4572e');
}

export function makeFruitBowl(x, y) {
  return (ctx, v) => {
    // banana (gone in the changed picture)
    if (v === 0) {
      ctx.beginPath();
      ctx.arc(x + 26, y - 18, 17, 0.25, Math.PI - 0.4);
      ctx.strokeStyle = '#ffd93b';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    circle(ctx, x - 16, y - 14, 13, '#e4572e'); // apple
    line(ctx, x - 16, y - 26, x - 13, y - 33, '#5b3a1e', 3);
    ellipse(ctx, x - 8, y - 32, 7, 4, '#4caf50');
    circle(ctx, x + 10, y - 12, 12, '#f2a541'); // orange
    circle(ctx, x + 6, y - 16, 3.4, '#ffc06a');
    // bowl
    ctx.beginPath();
    ctx.moveTo(x - 42, y);
    ctx.quadraticCurveTo(x, y + 30, x + 42, y);
    ctx.closePath();
    ctx.fillStyle = '#2a9d8f';
    ctx.fill();
    rect(ctx, x - 14, y + 22, 28, 6, '#1f7a6e');
  };
}

export function makeCup(x, y, color, changedColor) {
  return (ctx, v) => {
    const body = v === 1 && changedColor ? changedColor : color;
    rrect(ctx, x - 14, y - 22, 28, 24, 4, body);
    ctx.beginPath();
    ctx.arc(x + 18, y - 11, 8, -Math.PI / 2, Math.PI / 2);
    ctx.strokeStyle = body;
    ctx.lineWidth = 4.4;
    ctx.stroke();
    ellipse(ctx, x, y - 22, 14, 4, '#6e4525');
    // steam curls
    ctx.strokeStyle = 'rgba(120,130,150,0.65)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(x - 4, y - 34, 5, Math.PI * 0.2, Math.PI * 1.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 5, y - 38, 5, Math.PI * 0.2, Math.PI * 1.3);
    ctx.stroke();
  };
}

export function makePictureFrame(x, y) {
  return (ctx, v) => {
    rect(ctx, x, y, 92, 70, v === 1 ? '#9aa5b1' : '#c9a227');
    rect(ctx, x + 7, y + 7, 78, 56, '#bfe6f5');
    tri(ctx, x + 10, y + 60, x + 40, y + 22, x + 62, y + 60, '#5b8e7d');
    tri(ctx, x + 38, y + 60, x + 62, y + 30, x + 82, y + 60, '#3d6e5c');
    circle(ctx, x + 68, y + 20, 8, '#ffd93b');
  };
}

export function makeStoveKettle(x, y) {
  return (ctx) => {
    rect(ctx, x, y, 86, 66, '#4a5872');
    rect(ctx, x, y, 86, 10, '#33415c');
    circle(ctx, x + 22, y + 30, 6, '#22304a');
    circle(ctx, x + 64, y + 30, 6, '#22304a');
    rect(ctx, x + 10, y + 44, 66, 16, '#22304a');
    // kettle
    ellipse(ctx, x + 43, y - 16, 24, 18, '#c0c8d4');
    tri(ctx, x + 18, y - 22, x + 6, y - 34, x + 24, y - 32, '#9aa5b1');
    ctx.beginPath();
    ctx.arc(x + 43, y - 26, 16, Math.PI, Math.PI * 2);
    ctx.strokeStyle = '#22304a';
    ctx.lineWidth = 4;
    ctx.stroke();
    circle(ctx, x + 43, y - 36, 4, '#22304a');
  };
}

export function paintKitchenRug(ctx) {
  ellipse(ctx, 310, 402, 190, 30, '#e4572e');
  ellipse(ctx, 310, 402, 150, 22, '#f2a541');
  ellipse(ctx, 310, 402, 105, 15, '#e4572e');
}

/* ---------- Scene 3: Garden Picnic ---------- */

export function paintGardenSky(ctx) {
  skyGradient(ctx, '#8fd3f4', '#e8f9ff', 340);
}

export function paintGardenGround(ctx) {
  rect(ctx, 0, 330, PANEL_W, 120, '#7bc950');
  ellipse(ctx, 120, 345, 180, 26, '#8fd45e');
  ellipse(ctx, 480, 352, 200, 30, '#8fd45e');
  ctx.strokeStyle = '#5da53e';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  for (const [gx, gy] of [[40, 400], [150, 420], [260, 398], [360, 424], [470, 404], [560, 426], [90, 372], [530, 380]]) {
    line(ctx, gx, gy, gx - 4, gy - 12, '#5da53e', 2.2);
    line(ctx, gx + 5, gy, gx + 6, gy - 13, '#5da53e', 2.2);
    line(ctx, gx + 10, gy, gx + 15, gy - 10, '#5da53e', 2.2);
  }
}

export function paintGardenFence(ctx) {
  for (let x = 8; x < PANEL_W; x += 44) {
    rect(ctx, x, 296, 12, 52, '#c99a63');
    tri(ctx, x, 296, x + 12, 296, x + 6, 286, '#c99a63');
  }
  rect(ctx, 0, 308, PANEL_W, 8, '#b07d48');
  rect(ctx, 0, 330, PANEL_W, 8, '#b07d48');
}

export function makeBigTree(x, baseY) {
  return (ctx, v) => {
    // trunk + branches
    ctx.beginPath();
    ctx.moveTo(x - 14, baseY);
    ctx.quadraticCurveTo(x - 8, baseY - 90, x - 26, baseY - 150);
    ctx.lineTo(x - 12, baseY - 156);
    ctx.quadraticCurveTo(x, baseY - 100, x + 4, baseY - 60);
    ctx.quadraticCurveTo(x + 10, baseY - 110, x + 30, baseY - 150);
    ctx.lineTo(x + 42, baseY - 144);
    ctx.quadraticCurveTo(x + 16, baseY - 90, x + 14, baseY);
    ctx.closePath();
    ctx.fillStyle = '#7d5527';
    ctx.fill();
    // canopy
    circle(ctx, x - 46, baseY - 168, 46, '#4caf50');
    circle(ctx, x + 44, baseY - 172, 50, '#43a047');
    circle(ctx, x, baseY - 196, 56, '#57b95c');
    circle(ctx, x - 20, baseY - 150, 40, '#66bb6a');
    circle(ctx, x + 26, baseY - 148, 38, '#66bb6a');
    // apples — one is gone in the changed picture
    const apples = [[x - 52, baseY - 158], [x + 8, baseY - 188], [x + 52, baseY - 160], [x - 8, baseY - 142]];
    apples.forEach(([ax, ay], i) => {
      if (v === 1 && i === 1) return;
      circle(ctx, ax, ay, 7, '#e4572e');
      circle(ctx, ax - 2, ay - 2, 2.2, '#ff9a7a');
    });
  };
}

export function makePicnicBlanket(x, y) {
  return (ctx, v) => {
    // perspective blanket: a trapezoid of red/white checks
    const cols = 6;
    const rows = 3;
    const topW = 190;
    const botW = 240;
    const h = 62;
    for (let r = 0; r < rows; r += 1) {
      const t0 = r / rows;
      const t1 = (r + 1) / rows;
      const w0 = topW + (botW - topW) * t0;
      const w1 = topW + (botW - topW) * t1;
      const y0 = y + h * t0;
      const y1 = y + h * t1;
      for (let c = 0; c < cols; c += 1) {
        const changed = v === 1 && r === 1 && c === 4;
        const fill = changed ? '#fffaf0' : (r + c) % 2 === 0 ? '#e4572e' : '#fffaf0';
        ctx.beginPath();
        ctx.moveTo(x - w0 / 2 + (w0 / cols) * c, y0);
        ctx.lineTo(x - w0 / 2 + (w0 / cols) * (c + 1), y0);
        ctx.lineTo(x - w1 / 2 + (w1 / cols) * (c + 1), y1);
        ctx.lineTo(x - w1 / 2 + (w1 / cols) * c, y1);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
      }
    }
  };
}

export function makePicnicBasket(x, y) {
  return (ctx) => {
    rrect(ctx, x - 30, y - 26, 60, 30, 5, '#c99a63');
    rect(ctx, x - 30, y - 26, 60, 7, '#a9713f');
    ctx.beginPath();
    ctx.arc(x, y - 26, 22, Math.PI, Math.PI * 2);
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 4;
    ctx.stroke();
    // baguette poking out
    ctx.save();
    ctx.translate(x + 14, y - 30);
    ctx.rotate(0.5);
    rrect(ctx, -6, -26, 12, 30, 6, '#e8b26a');
    ctx.restore();
    rect(ctx, x - 6, y - 16, 12, 10, '#8a5a33');
  };
}

export function makeSandwichPlate(x, y) {
  return (ctx) => {
    ellipse(ctx, x, y, 34, 10, '#fffaf0');
    ellipse(ctx, x, y - 2, 26, 7, '#e8eef2');
    tri(ctx, x - 16, y - 4, x + 2, y - 20, x + 14, y - 4, '#f5d7a1');
    tri(ctx, x - 8, y - 4, x + 8, y - 18, x + 20, y - 4, '#eec98f');
    rect(ctx, x - 14, y - 6, 30, 3, '#7bc950');
  };
}

export function makeLemonadeJug(x, y) {
  return (ctx, v) => {
    // glass jug; the changed picture has drunk half of it
    const fillTop = v === 1 ? y - 12 : y - 30;
    ctx.beginPath();
    ctx.moveTo(x - 17, y - 38);
    ctx.lineTo(x + 17, y - 38);
    ctx.lineTo(x + 13, y);
    ctx.lineTo(x - 13, y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(210,235,245,0.85)';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 15, fillTop);
    ctx.lineTo(x + 15, fillTop);
    ctx.lineTo(x + 12, y - 2);
    ctx.lineTo(x - 12, y - 2);
    ctx.closePath();
    ctx.fillStyle = '#ffd93b';
    ctx.fill();
    circle(ctx, x + 4, fillTop + 8, 6, '#fff3b0'); // lemon slice
    ctx.beginPath();
    ctx.arc(x + 22, y - 20, 9, -Math.PI / 2, Math.PI / 2);
    ctx.strokeStyle = '#9fc6d8';
    ctx.lineWidth = 4;
    ctx.stroke();
  };
}

export function makeKite(x, y) {
  return (ctx, v) => {
    // string
    ctx.strokeStyle = 'rgba(34,48,74,0.5)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y + 26);
    ctx.quadraticCurveTo(x - 60, y + 90, x - 130, y + 170);
    ctx.stroke();
    // diamond
    tri(ctx, x, y - 30, x - 24, y, x, y + 30, '#e4572e');
    tri(ctx, x, y - 30, x + 24, y, x, y + 30, '#f2a541');
    line(ctx, x, y - 30, x, y + 30, '#22304a', 2);
    // tail with bows — one bow fewer in the changed picture
    ctx.strokeStyle = '#22304a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + 30);
    ctx.quadraticCurveTo(x + 14, y + 62, x - 4, y + 96);
    ctx.stroke();
    const bows = [[x + 8, y + 48], [x + 2, y + 68], [x - 2, y + 86], [x - 4, y + 100]];
    bows.forEach(([bx, by], i) => {
      if (v === 1 && i === 2) return;
      tri(ctx, bx, by, bx - 8, by - 5, bx - 8, by + 5, '#2a9d8f');
      tri(ctx, bx, by, bx + 8, by - 5, bx + 8, by + 5, '#2a9d8f');
    });
  };
}

export function makeButterfly(x, y, color) {
  return (ctx, v) => {
    if (v === 1) return; // flown away in the changed picture
    ellipse(ctx, x - 9, y - 5, 10, 6, color);
    ellipse(ctx, x + 9, y - 5, 10, 6, color);
    ellipse(ctx, x - 7, y + 5, 8, 5, color);
    ellipse(ctx, x + 7, y + 5, 8, 5, color);
    ellipse(ctx, x, y, 3, 9, '#22304a');
    line(ctx, x, y - 8, x - 6, y - 15, '#22304a', 1.6);
    line(ctx, x, y - 8, x + 6, y - 15, '#22304a', 1.6);
  };
}

export function makeFlower(x, y, petal, changedPetal) {
  return (ctx, v) => {
    const color = v === 1 && changedPetal ? changedPetal : petal;
    line(ctx, x, y, x, y - 22, '#3d8b37', 3);
    ellipse(ctx, x - 6, y - 10, 6, 3.4, '#4caf50');
    for (let i = 0; i < 5; i += 1) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      circle(ctx, x + Math.cos(a) * 7, y - 26 + Math.sin(a) * 7, 5.4, color);
    }
    circle(ctx, x, y - 26, 4.6, '#ffd93b');
  };
}

export function makeDog(x, y) {
  return (ctx, v) => {
    // sitting dog, side view; variant 1 loses the spot on its flank
    ellipse(ctx, x, y, 30, 22, '#d9a066');
    circle(ctx, x + 26, y - 24, 16, '#d9a066');
    ellipse(ctx, x + 38, y - 18, 10, 7, '#e8bc85'); // snout
    circle(ctx, x + 46, y - 20, 3.4, '#22304a'); // nose
    circle(ctx, x + 30, y - 28, 3, '#22304a'); // eye
    ellipse(ctx, x + 18, y - 34, 7, 13, '#b07d48'); // floppy ear
    if (v === 0) ellipse(ctx, x - 6, y - 4, 11, 8, '#b07d48'); // the spot
    // front leg + paw
    rect(ctx, x + 16, y + 8, 9, 20, '#d9a066');
    ellipse(ctx, x + 22, y + 28, 9, 4.6, '#e8bc85');
    // tail wagging up
    ctx.strokeStyle = '#d9a066';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 28, y - 6);
    ctx.quadraticCurveTo(x - 44, y - 20, x - 40, y - 34);
    ctx.stroke();
    // collar
    ctx.strokeStyle = '#e4572e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x + 22, y - 14, 13, 0.4, 2.4);
    ctx.stroke();
  };
}

export function makeBush(x, y, s) {
  return (ctx) => {
    circle(ctx, x - 20 * s, y, 18 * s, '#43a047');
    circle(ctx, x + 20 * s, y, 18 * s, '#43a047');
    circle(ctx, x, y - 10 * s, 22 * s, '#57b95c');
    circle(ctx, x - 8 * s, y - 6 * s, 3 * s, '#ff8fab');
    circle(ctx, x + 12 * s, y - 2 * s, 3 * s, '#ffd93b');
  };
}

/* ---------- Scene 4: Night Market ---------- */

export function paintNightSky(ctx) {
  skyGradient(ctx, '#14213d', '#2b3a67', 360);
}

const STAR_FIELD = [
  [30, 40], [80, 90], [120, 30], [170, 70], [210, 110], [250, 35], [290, 80], [330, 45],
  [370, 100], [410, 30], [450, 75], [490, 120], [540, 40], [570, 95], [60, 150], [150, 160],
  [260, 150], [350, 165], [440, 155], [530, 170], [100, 200], [480, 205], [200, 195], [320, 200],
];

export function paintStars(ctx) {
  for (const [sx, sy] of STAR_FIELD) {
    circle(ctx, sx, sy, 1.8, 'rgba(255,255,255,0.85)');
  }
}

export function makeBrightStar(x, y) {
  return (ctx, v) => {
    if (v === 1) return; // this star blinked out
    star(ctx, x, y, 9, '#ffe97a', 4);
    circle(ctx, x, y, 2.6, '#fff6c9');
  };
}

export function makeMoon(x, y) {
  return (ctx) => {
    circle(ctx, x, y, 26, '#f6ecd9');
    circle(ctx, x + 12, y - 7, 22, '#1b2a4d');
    circle(ctx, x - 8, y + 8, 4, '#e3d5b8');
  };
}

export function makeStringLights(y, sag) {
  return (ctx, v) => {
    const spans = [[0, 200], [200, 400], [400, 600]];
    const bulbColors = ['#ffd93b', '#ff8fab', '#7ae0d3', '#f2a541', '#b8a7ff'];
    let bulbIndex = 0;
    for (const [x0, x1] of spans) {
      ctx.strokeStyle = 'rgba(20,25,40,0.9)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.quadraticCurveTo((x0 + x1) / 2, y + sag, x1, y);
      ctx.stroke();
      for (let i = 1; i <= 4; i += 1) {
        const t = i / 5;
        const bx = x0 + (x1 - x0) * t;
        const by = y + sag * 2 * t * (1 - t) * 2 * 0.5 + 6;
        const dark = v === 1 && bulbIndex === 6;
        if (!dark) {
          const g = ctx.createRadialGradient(bx, by + 6, 2, bx, by + 6, 20);
          g.addColorStop(0, 'rgba(255,230,150,0.5)');
          g.addColorStop(1, 'rgba(255,230,150,0)');
          ctx.fillStyle = g;
          ctx.fillRect(bx - 20, by - 14, 40, 40);
        }
        line(ctx, bx, by, bx, by + 4, '#141928', 2);
        circle(ctx, bx, by + 8, 5, dark ? '#4a5872' : bulbColors[bulbIndex % bulbColors.length]);
        bulbIndex += 1;
      }
    }
  };
}

export function paintMarketGround(ctx) {
  rect(ctx, 0, 368, PANEL_W, 82, '#3a3350');
  ellipse(ctx, 110, 392, 130, 20, 'rgba(255,214,120,0.14)');
  ellipse(ctx, 310, 398, 140, 22, 'rgba(255,214,120,0.14)');
  ellipse(ctx, 500, 392, 130, 20, 'rgba(255,214,120,0.14)');
}

export function makeMarketStall(x, y, awningA, awningB, changedStripe) {
  return (ctx, v) => {
    // posts + counter
    rect(ctx, x, y, 8, 110, '#5b3a1e');
    rect(ctx, x + 132, y, 8, 110, '#5b3a1e');
    rect(ctx, x - 6, y + 78, 152, 34, '#7d5527');
    rect(ctx, x - 6, y + 78, 152, 8, '#96683a');
    // striped awning; variant 1 recolors one stripe
    const stripes = 7;
    for (let i = 0; i < stripes; i += 1) {
      const sx = x - 14 + (168 / stripes) * i;
      const fill = v === 1 && changedStripe === i ? '#2a9d8f' : i % 2 === 0 ? awningA : awningB;
      ctx.beginPath();
      ctx.moveTo(sx, y - 6);
      ctx.lineTo(sx + 168 / stripes, y - 6);
      ctx.lineTo(sx + 168 / stripes + 6, y + 22);
      ctx.lineTo(sx - 6, y + 22);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }
    // scalloped edge
    for (let i = 0; i < stripes; i += 1) {
      const sx = x - 14 + (168 / stripes) * i + 168 / stripes / 2;
      circle(ctx, sx, y + 22, 12, i % 2 === 0 ? awningA : awningB);
    }
  };
}

export function makeFruitPile(x, y) {
  return (ctx, v) => {
    const oranges = [[-16, 0], [0, 0], [16, 0], [-8, -13], [8, -13], [0, -25]];
    oranges.forEach(([ox, oy], i) => {
      if (v === 1 && i === 5) return; // top orange sold
      circle(ctx, x + ox, y + oy, 9.5, '#f28c28');
      circle(ctx, x + ox - 3, y + oy - 3, 3, '#ffab5e');
    });
    rect(ctx, x - 30, y + 8, 60, 8, '#5b3a1e');
  };
}

export function makeJarRow(x, y) {
  return (ctx) => {
    const colors = ['#b8a7ff', '#7ae0d3', '#ff8fab'];
    colors.forEach((c, i) => {
      rrect(ctx, x + i * 26 - 34, y - 26, 20, 26, 4, c);
      rect(ctx, x + i * 26 - 31, y - 31, 14, 6, '#22304a');
    });
  };
}

export function makeFabricRolls(x, y) {
  return (ctx) => {
    const colors = ['#e4572e', '#f2a541', '#2a9d8f'];
    colors.forEach((c, i) => {
      rrect(ctx, x - 30 + i * 22, y - 34, 16, 34, 5, c);
      ellipse(ctx, x - 22 + i * 22, y - 34, 8, 3.4, '#fffaf0');
    });
  };
}

export function makePaperLantern(x, y, color, changedColor) {
  return (ctx, v) => {
    const body = v === 1 && changedColor ? changedColor : color;
    line(ctx, x, y - 34, x, y - 16, '#141928', 2.4);
    const g = ctx.createRadialGradient(x, y, 4, x, y, 34);
    g.addColorStop(0, 'rgba(255,220,140,0.45)');
    g.addColorStop(1, 'rgba(255,220,140,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 36, y - 36, 72, 72);
    ellipse(ctx, x, y, 19, 16, body);
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 1.6;
    for (const off of [-10, -4, 3, 10]) {
      ctx.beginPath();
      ctx.ellipse(x, y, Math.abs(off) + 6, 16, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    rect(ctx, x - 7, y - 19, 14, 5, '#22304a');
    rect(ctx, x - 7, y + 14, 14, 5, '#22304a');
    line(ctx, x, y + 19, x, y + 30, '#e4572e', 3);
  };
}

export function makeCrates(x, y) {
  return (ctx, v) => {
    const crate = (cx, cy) => {
      rect(ctx, cx, cy, 46, 36, '#a9713f');
      rect(ctx, cx, cy, 46, 6, '#8a5a33');
      line(ctx, cx + 3, cy + 6, cx + 43, cy + 33, '#8a5a33', 3);
      line(ctx, cx + 43, cy + 6, cx + 3, cy + 33, '#8a5a33', 3);
    };
    crate(x, y);
    crate(x + 50, y);
    if (v === 0) crate(x + 25, y - 38); // top crate gone in the changed picture
  };
}

export function makeStallSign(x, y) {
  return (ctx, v) => {
    rrect(ctx, x - 22, y - 16, 44, 32, 5, '#22304a');
    ctx.strokeStyle = '#ffd93b';
    ctx.lineWidth = 2.4;
    ctx.strokeRect(x - 22, y - 16, 44, 32);
    if (v === 1) {
      circle(ctx, x, y, 9, '#ffd93b');
      circle(ctx, x + 4, y - 3, 7.4, '#22304a'); // crescent moon
    } else {
      star(ctx, x, y, 10, '#ffd93b');
    }
  };
}

/* ---------- Scene 5: Mountain Cabin ---------- */

export function paintAlpineSky(ctx) {
  skyGradient(ctx, '#a8d8f0', '#eaf7ff', 300);
}

export function paintMountains(ctx) {
  tri(ctx, -40, 300, 150, 110, 340, 300, '#7d8fb3');
  tri(ctx, 210, 300, 400, 80, 590, 300, '#6d81a8');
  tri(ctx, 420, 300, 560, 150, 700, 300, '#7d8fb3');
  // snow caps
  tri(ctx, 118, 148, 150, 110, 182, 148, '#ffffff');
  tri(ctx, 362, 122, 400, 80, 438, 122, '#ffffff');
  tri(ctx, 532, 182, 560, 150, 588, 182, '#ffffff');
}

export function paintSnowGround(ctx) {
  rect(ctx, 0, 300, PANEL_W, 150, '#f4f9ff');
  ellipse(ctx, 140, 330, 200, 30, '#ffffff');
  ellipse(ctx, 470, 340, 220, 34, '#ffffff');
  ellipse(ctx, 300, 420, 320, 40, '#eaf3ff');
}

export function makePineTree(x, baseY, s, snowy) {
  return (ctx, v) => {
    rect(ctx, x - 5 * s, baseY - 18 * s, 10 * s, 18 * s, '#6e4525');
    const tiers = [[46, 0], [38, -34], [29, -64]];
    for (const [w, dy] of tiers) {
      tri(ctx, x - w * s, baseY - 14 * s + dy * s, x + w * s, baseY - 14 * s + dy * s, x, baseY - 52 * s + dy * s, '#2e7d4f');
    }
    // snow dusting — variant 1 (only when snowy) shakes it off
    if (snowy && v === 0) {
      ellipse(ctx, x - 16 * s, baseY - 52 * s, 14 * s, 5 * s, '#ffffff');
      ellipse(ctx, x + 14 * s, baseY - 84 * s, 12 * s, 4.6 * s, '#ffffff');
      ellipse(ctx, x, baseY - 112 * s, 10 * s, 4.4 * s, '#ffffff');
    }
  };
}

export function makeCabin(x, y) {
  return (ctx, v) => {
    // log walls
    rect(ctx, x, y, 190, 96, '#8a5a33');
    for (let ly = y + 12; ly < y + 96; ly += 14) rect(ctx, x, ly, 190, 3, '#6e4525');
    // roof with snow
    tri(ctx, x - 16, y + 4, x + 206, y + 4, x + 95, y - 52, '#5b3a1e');
    tri(ctx, x - 10, y - 2, x + 200, y - 2, x + 95, y - 52, '#ffffff');
    // icicles along the eaves — one fewer in the changed picture
    const icicles = [x + 6, x + 44, x + 84, x + 126, x + 166];
    icicles.forEach((ix, i) => {
      if (v === 1 && i === 2) return;
      tri(ctx, ix, y + 4, ix + 9, y + 4, ix + 4.5, y + 22, '#cfe9f7');
    });
    // chimney
    rect(ctx, x + 138, y - 58, 26, 44, '#9aa5b1');
    rect(ctx, x + 134, y - 64, 34, 8, '#7d8794');
    // door
    rrect(ctx, x + 76, y + 40, 38, 56, 4, '#5b3a1e');
    circle(ctx, x + 106, y + 70, 3.4, '#ffd93b');
    // wreath on the door
    ctx.beginPath();
    ctx.arc(x + 95, y + 56, 9, 0, Math.PI * 2);
    ctx.strokeStyle = '#2e7d4f';
    ctx.lineWidth = 5;
    ctx.stroke();
    circle(ctx, x + 95, y + 48, 3, '#e4572e');
  };
}

export function makeCabinWindow(x, y) {
  return (ctx, v) => {
    rect(ctx, x, y, 40, 36, '#5b3a1e');
    rect(ctx, x + 4, y + 4, 32, 28, v === 1 ? '#33415c' : '#ffd93b');
    line(ctx, x + 20, y + 4, x + 20, y + 32, '#5b3a1e', 3);
    line(ctx, x + 4, y + 18, x + 36, y + 18, '#5b3a1e', 3);
    if (v === 0) {
      const g = ctx.createRadialGradient(x + 20, y + 18, 4, x + 20, y + 18, 46);
      g.addColorStop(0, 'rgba(255,214,90,0.4)');
      g.addColorStop(1, 'rgba(255,214,90,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 26, y - 28, 92, 92);
    }
  };
}

export function makeSmokePuffs(x, y) {
  return (ctx, v) => {
    const puffs = [[0, 0, 10], [10, -20, 13], [26, -42, 16]];
    puffs.forEach(([px, py, pr], i) => {
      if (v === 1 && i === 2) return; // top puff drifted away
      circle(ctx, x + px, y + py, pr, 'rgba(255,255,255,0.92)');
    });
  };
}

export function makeDoorLantern(x, y) {
  return (ctx, v) => {
    if (v === 1) return; // lantern taken in for the night
    line(ctx, x, y - 18, x, y - 8, '#22304a', 3);
    const g = ctx.createRadialGradient(x, y + 4, 3, x, y + 4, 30);
    g.addColorStop(0, 'rgba(255,220,140,0.55)');
    g.addColorStop(1, 'rgba(255,220,140,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 32, y - 28, 64, 64);
    rrect(ctx, x - 9, y - 8, 18, 24, 3, '#22304a');
    rect(ctx, x - 5, y - 4, 10, 16, '#ffe97a');
  };
}

export function makeSnowman(x, y) {
  return (ctx, v) => {
    circle(ctx, x, y, 30, '#ffffff');
    circle(ctx, x, y - 40, 22, '#ffffff');
    circle(ctx, x, y - 70, 16, '#ffffff');
    ctx.strokeStyle = '#c9d9ea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.stroke();
    // stick arms
    line(ctx, x - 20, y - 44, x - 46, y - 62, '#7d5527', 4);
    line(ctx, x - 40, y - 56, x - 48, y - 70, '#7d5527', 3);
    line(ctx, x + 20, y - 44, x + 44, y - 58, '#7d5527', 4);
    // face
    circle(ctx, x - 6, y - 74, 2.6, '#22304a');
    circle(ctx, x + 6, y - 74, 2.6, '#22304a');
    if (v === 0) tri(ctx, x, y - 70, x + 20, y - 66, x, y - 63, '#f28c28'); // carrot nose
    // scarf + buttons
    rect(ctx, x - 14, y - 58, 28, 8, '#e4572e');
    rect(ctx, x + 6, y - 52, 8, 20, '#e4572e');
    circle(ctx, x, y - 40, 3, '#22304a');
    circle(ctx, x, y - 28, 3, '#22304a');
    // hat
    rect(ctx, x - 15, y - 88, 30, 5, '#22304a');
    rect(ctx, x - 10, y - 102, 20, 15, '#22304a');
  };
}

export function makeSled(x, y) {
  return (ctx, v) => {
    const body = v === 1 ? '#3d7bd6' : '#e4572e';
    // runners
    ctx.strokeStyle = '#5b3a1e';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 40, y + 16);
    ctx.lineTo(x + 34, y + 16);
    ctx.quadraticCurveTo(x + 48, y + 14, x + 46, y + 2);
    ctx.stroke();
    // seat slats
    for (let i = 0; i < 4; i += 1) rect(ctx, x - 36 + i * 20, y, 15, 7, body);
    rect(ctx, x - 30, y + 7, 7, 9, '#5b3a1e');
    rect(ctx, x + 22, y + 7, 7, 9, '#5b3a1e');
    // rope
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(x + 40, y + 4);
    ctx.quadraticCurveTo(x + 62, y + 16, x + 80, y + 12);
    ctx.stroke();
  };
}

export function makeFrozenPond(x, y) {
  return (ctx, v) => {
    ellipse(ctx, x, y, 110, 26, '#bfe3f7');
    ellipse(ctx, x, y, 96, 20, '#d8f0fd');
    if (v === 0) {
      // cracks in the ice, smoothed away in the changed picture
      ctx.strokeStyle = '#8fc3e8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 60, y - 4);
      ctx.lineTo(x - 20, y + 2);
      ctx.lineTo(x + 18, y - 6);
      ctx.lineTo(x + 58, y + 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 20, y + 2);
      ctx.lineTo(x - 34, y + 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 18, y - 6);
      ctx.lineTo(x + 30, y + 8);
      ctx.stroke();
    }
  };
}

export function makeFootprints(x, y) {
  return (ctx, v) => {
    const steps = [[0, 0], [16, 10], [34, 18], [52, 28], [72, 36]];
    steps.forEach(([sx, sy], i) => {
      if (v === 1 && i === 3) return; // one print filled with snow
      ellipse(ctx, x + sx, y + sy, 7, 4.4, '#d5e6f5');
    });
  };
}

export function makeWoodpile(x, y) {
  return (ctx, v) => {
    const logs = [[0, 0], [22, 0], [44, 0], [11, -16], [33, -16], [22, -32]];
    logs.forEach(([lx, ly], i) => {
      if (v === 1 && i === 5) return; // top log burned
      circle(ctx, x + lx, y + ly, 11, '#c99a63');
      ctx.beginPath();
      ctx.arc(x + lx, y + ly, 11, 0, Math.PI * 2);
      ctx.strokeStyle = '#8a5a33';
      ctx.lineWidth = 2.4;
      ctx.stroke();
      circle(ctx, x + lx, y + ly, 4.6, '#e3c08a');
    });
  };
}
