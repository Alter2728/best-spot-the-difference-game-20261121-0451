// Hand-in program for the "Make the best spot the difference game" bounty (Node 22,
// standard library only). The game itself lives in game/ as plain static files that a
// desktop browser plays offline; this program copies game/ and screenshots/ from beside
// itself to /output and writes /output/dossier.json with the vendored make.fun library,
// which is the summary the judge reads. It runs twice in the grader and must write the
// same bytes both times, so it copies files exactly and never stamps times or randomness.
//
// Play locally:  node serve.ts        then open the printed localhost address.
// Test by hand:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly here rather than hand in an entry the gate would refuse: the game must
// have its index.html, and screenshots/ must hold the 3 or 4 images the judge sees.
if (!existsSync(join(repoRoot, 'game', 'index.html'))) {
  throw new Error('game/index.html is missing — nothing to hand in');
}
const shotCount = existsSync(join(repoRoot, 'screenshots'))
  ? readdirSync(join(repoRoot, 'screenshots')).filter((name) => !name.startsWith('.')).length
  : 0;
if (shotCount < 3 || shotCount > 4) {
  throw new Error(`screenshots/ holds ${shotCount} images; the bounty wants 3 or 4`);
}

// The scorer's caps, mirrored so an entry the scorer would refuse fails here first:
// at most 4 screenshots of 256 KiB, at most 993 entries and 48 MiB under game/, and no
// path under game/ longer than 1000 UTF-8 bytes. Only text_max_bytes shapes the bytes.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, DOSSIER_CAPS));
