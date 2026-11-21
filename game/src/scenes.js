// The five scenes of Double Take, composed from the painters in draw.js. Each scene is a
// list of elements drawn in order, plus its differences: the elements whose variant 1 is
// painted on the right-hand picture, each with the circle a click must land in (panel
// coordinates, 600 by 450) and a short label shown when it is found. Difficulty climbs
// scene by scene: more differences, less time, subtler changes.

import {
  circle, cloud, ellipse,
  makeBigTree, makeBrightStar, makeBuoy, makeButterfly, makeCat, makeCabin, makeCabinWindow,
  makeClock, makeCrates, makeCup, makeDog, makeDoorLantern, makeFabricRolls, makeFlower,
  makeFootprints, makeFrozenPond, makeFruitBowl, makeFruitPile, makeGull, makeHangingLamp,
  makeJarRow, makeJumpingFish, makeKite, makeKitchenWindow, makeLemonadeJug, makeLighthouse,
  makeLighthouseFlag, makeMarketStall, makeMoon, makePaperLantern, makePicnicBasket,
  makePicnicBlanket, makePictureFrame, makePineTree, makeSailboat, makeSandwichPlate,
  makeShelf, makeShoreHouse, makeSled, makeSmokePuffs, makeSnowman, makeStallSign,
  makeStoveKettle, makeStringLights, makeSun, makeWoodpile, makeBarrel, makeBush,
  paintAlpineSky, paintDock, paintGardenFence, paintGardenGround, paintGardenSky,
  paintHarborSea, paintHarborSky, paintKitchenRoom, paintKitchenRug, paintKitchenTable,
  paintMarketGround, paintMountains, paintNightSky, paintSnowGround, paintStars,
} from './draw.js';

/** Wrap a painter so it only appears in the changed picture (an added difference). */
function onlyInChanged(painter) {
  return (ctx, v) => { if (v === 1) painter(ctx, 0); };
}

/** Wrap a painter so it only appears in the original picture (a removed difference). */
function onlyInOriginal(painter) {
  return (ctx, v) => { if (v === 0) painter(ctx, 0); };
}

function sunnyHarbor() {
  return {
    name: 'Sunny Harbor',
    timeLimit: 180,
    elements: [
      { id: 'sky', draw: paintHarborSky },
      { id: 'sun', draw: makeSun(505, 70, 34) },
      { id: 'cloud-a', draw: (ctx) => cloud(ctx, 110, 60, 1) },
      { id: 'cloud-b', draw: (ctx) => cloud(ctx, 300, 45, 0.8) },
      { id: 'cloud-c', draw: (ctx) => cloud(ctx, 430, 112, 0.9) },
      { id: 'gull-a', draw: makeGull(180, 92, 1) },
      { id: 'gull-b', draw: makeGull(232, 122, 0.8) },
      { id: 'gull-gone', draw: makeGull(352, 80, 1) },
      { id: 'sea', draw: paintHarborSea },
      { id: 'lighthouse', draw: makeLighthouse(100, 305) },
      { id: 'flag', draw: makeLighthouseFlag(100, 155) },
      { id: 'boat-a', draw: makeSailboat(300, 345, 1, '#fffaf0', '#f28c28') },
      { id: 'boat-b', draw: makeSailboat(455, 368, 0.7, '#7ec8e3', null) },
      { id: 'dock', draw: paintDock },
      { id: 'barrel-a', draw: makeBarrel(45, 392) },
      { id: 'barrel-b', draw: makeBarrel(90, 392) },
      { id: 'barrel-c', draw: makeBarrel(135, 392) },
      { id: 'barrel-extra', draw: onlyInChanged(makeBarrel(180, 392)) },
      { id: 'house-a', draw: makeShoreHouse(468, 238, 64, 54, '#fff3e0', '#e4572e') },
      { id: 'house-b', draw: makeShoreHouse(540, 252, 54, 46, '#ffe0b2', '#2a9d8f') },
      { id: 'buoy', draw: makeBuoy(525, 398) },
      { id: 'fish', draw: makeJumpingFish(385, 390) },
    ],
    diffs: [
      { id: 'd-sail', elementId: 'boat-a', x: 314, y: 306, r: 42, label: 'the big sail turned orange' },
      { id: 'd-gull', elementId: 'gull-gone', x: 352, y: 80, r: 30, label: 'a seagull flew off' },
      { id: 'd-flag', elementId: 'flag', x: 112, y: 88, r: 26, label: 'the lighthouse flag is gone' },
      { id: 'd-barrel', elementId: 'barrel-extra', x: 180, y: 372, r: 30, label: 'an extra barrel appeared' },
      { id: 'd-window', elementId: 'house-a', x: 484, y: 258, r: 24, label: 'a cottage window went dark' },
    ],
  };
}

function cozyKitchen() {
  return {
    name: 'Cozy Kitchen',
    timeLimit: 170,
    elements: [
      { id: 'room', draw: paintKitchenRoom },
      { id: 'window', draw: makeKitchenWindow(56, 56) },
      { id: 'clock', draw: makeClock(478, 108, 46) },
      { id: 'shelf', draw: makeShelf(238, 118) },
      { id: 'lamp', draw: makeHangingLamp(250) },
      { id: 'frame', draw: makePictureFrame(368, 168) },
      { id: 'stove', draw: makeStoveKettle(492, 318) },
      { id: 'rug', draw: paintKitchenRug },
      { id: 'table', draw: paintKitchenTable },
      { id: 'bowl', draw: makeFruitBowl(300, 312) },
      { id: 'cup-red', draw: makeCup(398, 312, '#e4572e', '#2a9d8f') },
      { id: 'cup-blue', draw: makeCup(222, 312, '#3d7bd6', null) },
      { id: 'cat', draw: makeCat(452, 388, 1.05) },
    ],
    diffs: [
      { id: 'd-clock', elementId: 'clock', x: 478, y: 108, r: 48, label: 'the clock tells a different time' },
      { id: 'd-jar', elementId: 'shelf', x: 310, y: 97, r: 28, label: 'the middle jar is missing' },
      { id: 'd-lamp', elementId: 'lamp', x: 250, y: 82, r: 42, label: 'the lamp is switched off' },
      { id: 'd-banana', elementId: 'bowl', x: 326, y: 292, r: 30, label: 'the banana was eaten' },
      { id: 'd-cup', elementId: 'cup-red', x: 398, y: 300, r: 26, label: 'the red cup turned teal' },
      { id: 'd-cat', elementId: 'cat', x: 452, y: 361, r: 30, label: 'the cat closed its eyes' },
    ],
  };
}

function gardenPicnic() {
  return {
    name: 'Garden Picnic',
    timeLimit: 160,
    elements: [
      { id: 'sky', draw: paintGardenSky },
      { id: 'sun', draw: makeSun(82, 68, 30) },
      { id: 'cloud-a', draw: (ctx) => cloud(ctx, 300, 55, 0.9) },
      { id: 'cloud-b', draw: (ctx) => cloud(ctx, 478, 84, 0.75) },
      { id: 'kite', draw: makeKite(468, 96) },
      { id: 'fence', draw: paintGardenFence },
      { id: 'ground', draw: paintGardenGround },
      { id: 'tree', draw: makeBigTree(120, 352) },
      { id: 'bush-a', draw: makeBush(296, 332, 1) },
      { id: 'bush-b', draw: makeBush(545, 338, 0.9) },
      { id: 'blanket', draw: makePicnicBlanket(330, 372) },
      { id: 'basket', draw: makePicnicBasket(292, 372) },
      { id: 'plate', draw: makeSandwichPlate(372, 380) },
      { id: 'jug', draw: makeLemonadeJug(428, 378) },
      { id: 'butterfly-a', draw: makeButterfly(248, 196, '#b8a7ff') },
      { id: 'butterfly-b', draw: makeButterfly(430, 238, '#ff8fab') },
      { id: 'flower-a', draw: makeFlower(60, 432, '#ff8fab', null) },
      { id: 'flower-b', draw: makeFlower(150, 438, '#ffd93b', null) },
      { id: 'flower-c', draw: makeFlower(240, 434, '#ff8fab', '#b8a7ff') },
      { id: 'flower-d', draw: makeFlower(330, 440, '#ff6b6b', null) },
      { id: 'flower-e', draw: makeFlower(420, 436, '#ffd93b', null) },
      { id: 'flower-f', draw: makeFlower(510, 440, '#ff8fab', null) },
      { id: 'dog', draw: makeDog(522, 352) },
    ],
    diffs: [
      { id: 'd-apple', elementId: 'tree', x: 128, y: 164, r: 26, label: 'an apple fell from the tree' },
      { id: 'd-blanket', elementId: 'blanket', x: 384, y: 403, r: 26, label: 'one blanket square lost its red' },
      { id: 'd-jug', elementId: 'jug', x: 428, y: 356, r: 28, label: 'someone drank the lemonade' },
      { id: 'd-kite', elementId: 'kite', x: 466, y: 182, r: 24, label: 'a bow slipped off the kite tail' },
      { id: 'd-butterfly', elementId: 'butterfly-a', x: 248, y: 196, r: 26, label: 'a butterfly flew away' },
      { id: 'd-flower', elementId: 'flower-c', x: 240, y: 408, r: 24, label: 'a flower changed colour' },
      { id: 'd-dog', elementId: 'dog', x: 516, y: 348, r: 26, label: "the dog's spot vanished" },
    ],
  };
}

function nightMarket() {
  return {
    name: 'Night Market',
    timeLimit: 150,
    elements: [
      { id: 'sky', draw: paintNightSky },
      { id: 'stars', draw: paintStars },
      { id: 'bright-star', draw: makeBrightStar(150, 58) },
      { id: 'moon', draw: makeMoon(512, 72) },
      { id: 'lights', draw: makeStringLights(120, 46) },
      { id: 'ground', draw: paintMarketGround },
      { id: 'stall-a', draw: makeMarketStall(36, 238, '#e4572e', '#fffaf0', null) },
      { id: 'stall-b', draw: makeMarketStall(232, 238, '#f2a541', '#fffaf0', 3) },
      { id: 'stall-c', draw: makeMarketStall(428, 238, '#2a9d8f', '#fffaf0', null) },
      { id: 'fruit', draw: makeFruitPile(106, 316) },
      { id: 'jars', draw: makeJarRow(302, 316) },
      { id: 'fabrics', draw: makeFabricRolls(498, 316) },
      { id: 'lantern-a', draw: makePaperLantern(120, 196, '#e4572e', '#2a9d8f') },
      { id: 'lantern-b', draw: makePaperLantern(310, 186, '#f2a541', null) },
      { id: 'lantern-c', draw: makePaperLantern(492, 196, '#ff8fab', '#ffd93b') },
      { id: 'crates', draw: makeCrates(16, 332) },
      { id: 'market-cat', draw: makeCat(64, 278, 0.9, '#8d99ae') },
      { id: 'sign', draw: makeStallSign(498, 268) },
    ],
    diffs: [
      { id: 'd-star', elementId: 'bright-star', x: 150, y: 58, r: 24, label: 'the brightest star blinked out' },
      { id: 'd-bulb', elementId: 'lights', x: 320, y: 156, r: 22, label: 'one festoon bulb went dark' },
      { id: 'd-stripe', elementId: 'stall-b', x: 302, y: 246, r: 24, label: 'an awning stripe changed colour' },
      { id: 'd-orange', elementId: 'fruit', x: 106, y: 291, r: 22, label: 'the top orange was sold' },
      { id: 'd-lantern-a', elementId: 'lantern-a', x: 120, y: 196, r: 26, label: 'a lantern changed colour' },
      { id: 'd-lantern-c', elementId: 'lantern-c', x: 492, y: 196, r: 26, label: 'another lantern changed colour' },
      { id: 'd-crate', elementId: 'crates', x: 64, y: 312, r: 30, label: 'the top crate was carried off' },
      { id: 'd-sign', elementId: 'sign', x: 498, y: 268, r: 26, label: 'the stall sign swapped its symbol' },
    ],
  };
}

function mountainCabin() {
  return {
    name: 'Mountain Cabin',
    timeLimit: 150,
    elements: [
      { id: 'sky', draw: paintAlpineSky },
      { id: 'sun', draw: makeSun(522, 58, 26) },
      { id: 'mountains', draw: paintMountains },
      { id: 'snow', draw: paintSnowGround },
      { id: 'pine-a', draw: makePineTree(52, 330, 1, true) },
      { id: 'pine-b', draw: makePineTree(150, 318, 0.8, false) },
      { id: 'pine-c', draw: makePineTree(500, 326, 1.1, false) },
      { id: 'pine-d', draw: makePineTree(556, 314, 0.75, true) },
      { id: 'cabin', draw: makeCabin(205, 238) },
      { id: 'window', draw: makeCabinWindow(226, 262) },
      { id: 'smoke', draw: makeSmokePuffs(356, 168) },
      { id: 'lantern', draw: makeDoorLantern(330, 292) },
      { id: 'woodpile', draw: makeWoodpile(430, 330) },
      { id: 'snowman', draw: makeSnowman(112, 392) },
      { id: 'sled', draw: makeSled(462, 398) },
      { id: 'pond', draw: makeFrozenPond(300, 414) },
      { id: 'footprints', draw: makeFootprints(320, 352) },
    ],
    diffs: [
      { id: 'd-pine', elementId: 'pine-a', x: 52, y: 246, r: 34, label: 'the snow slid off a pine' },
      { id: 'd-icicle', elementId: 'cabin', x: 293, y: 250, r: 22, label: 'an icicle melted' },
      { id: 'd-window', elementId: 'window', x: 246, y: 280, r: 26, label: 'the cabin window went dark' },
      { id: 'd-smoke', elementId: 'smoke', x: 382, y: 126, r: 24, label: 'a smoke puff drifted away' },
      { id: 'd-lantern', elementId: 'lantern', x: 330, y: 292, r: 24, label: 'the door lantern was taken in' },
      { id: 'd-log', elementId: 'woodpile', x: 452, y: 298, r: 20, label: 'the top log is on the fire' },
      { id: 'd-nose', elementId: 'snowman', x: 120, y: 322, r: 22, label: "the snowman's carrot nose is gone" },
      { id: 'd-sled', elementId: 'sled', x: 462, y: 402, r: 30, label: 'the sled was repainted blue' },
      { id: 'd-crack', elementId: 'pond', x: 300, y: 412, r: 34, label: 'the pond ice froze smooth' },
      { id: 'd-print', elementId: 'footprints', x: 372, y: 380, r: 20, label: 'a footprint filled with snow' },
    ],
  };
}

export const SCENES = [sunnyHarbor(), cozyKitchen(), gardenPicnic(), nightMarket(), mountainCabin()];

/** Render one panel of a scene into a fresh offscreen canvas. side: 'left' | 'right'. */
export function renderPanel(scene, side) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');
  const changedIds = new Set(scene.diffs.map((d) => d.elementId));
  for (const element of scene.elements) {
    const variant = side === 'right' && changedIds.has(element.id) ? 1 : 0;
    element.draw(ctx, variant);
  }
  return canvas;
}

/** The difference whose circle holds (x, y), nearest first; null when the click missed. */
export function differenceAt(scene, x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const diff of scene.diffs) {
    const dist = Math.hypot(x - diff.x, y - diff.y);
    if (dist <= Math.max(diff.r, 26) && dist < bestDist) {
      best = diff;
      bestDist = dist;
    }
  }
  return best;
}
