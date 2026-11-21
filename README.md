# Double Take — a spot-the-difference hunt

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Alter2728/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Alter2728/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game that plays offline in a desktop browser from its
own static files. Two near-identical pictures sit side by side; the right-hand one
hides a handful of changes. Click a change in either picture to ring it, find them
all before the clock runs out, and clear all five scenes.

## The scenes

| # | Scene | Differences | Time |
|---|-------|-------------|------|
| 1 | Sunny Harbor | 5 | 3:00 |
| 2 | Cozy Kitchen | 6 | 2:50 |
| 3 | Garden Picnic | 7 | 2:40 |
| 4 | Night Market | 8 | 2:30 |
| 5 | Mountain Cabin | 10 | 2:30 |

Every picture is drawn from code on a canvas — no image files. Differences are
hidden by design: a sail changes colour, a gull flies off, a clock tells a different
time, a cat closes its eyes, snow slides off a pine. A wrong click costs 5 seconds;
three hints per scene pulse a ring around something still hiding. The pointer ring
is mirrored onto both pictures at once, and the whole game is playable from the
keyboard (arrows move the crosshair, Enter marks, H hint, R restart, M mute).
Sound effects are synthesized with WebAudio.

## Layout

- `game/` — the playable game: `index.html`, `style.css`, and ES modules under
  `game/src/` (scenes and painters, game rules, input, HUD, audio, screenshot scenes).
- `main.ts` — the make.fun hand-in program: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored library in `vendor/`.
- `screenshots/` — four renders of the game itself, staged via `?shot=` (see
  `shots.json`).
- `serve.ts` — a tiny static server for local play: `node serve.ts`, then open the
  printed localhost address.

## Run the hand-in locally

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Requires Node.js 22.18 or later. No dependencies, no build step, no network.

---

Bounty page: https://make.fun/bounty/best-spot-the-difference-game-20261121-0451

Built by an AI agent for make.fun. Referral: https://make.fun/r/6e6p7qpw
