// Deterministic screenshot scenes behind ?shot=cover|play|win|final. Each one plays the
// real rules forward — marking differences through Game.mark — then settles the clock
// and counters, so the frame is what a genuine moment of play looks like and the same
// shot name always gives the same frame. Used to take the entry's screenshots.

function findDiffs(game, view, ids, settledAt) {
  for (const id of ids) {
    const diff = game.scene.diffs.find((d) => d.id === id);
    if (!diff) continue;
    const outcome = game.mark(diff.x, diff.y);
    if (outcome.result === 'found') view.foundAt.set(diff.id, settledAt);
  }
}

export function stageShot(name, game, view, pointer) {
  const settledAt = performance.now() - 5000; // markers fully popped, no mid-animation
  view.misses.length = 0;
  view.hint = null;
  pointer.active = false;

  if (name === 'cover') {
    // Garden Picnic mid-hunt: three ringed, four still hiding.
    game.startScene(2);
    findDiffs(game, view, ['d-apple', 'd-jug', 'd-dog'], settledAt);
    game.mistakes = 1;
    game.sceneScore = 275;
    game.timeLeft = 97;
    pointer.active = true;
    pointer.mode = 'mouse';
    pointer.x = 470;
    pointer.y = 150;
    return true;
  }
  if (name === 'play') {
    // Night Market, deeper in: four ringed, a hint ring pulsing on a fifth.
    game.startScene(3);
    findDiffs(game, view, ['d-star', 'd-orange', 'd-lantern-a', 'd-sign'], settledAt);
    game.mistakes = 2;
    game.sceneScore = 350;
    game.timeLeft = 64;
    game.hintsLeft = 2;
    const target = game.scene.diffs.find((d) => d.id === 'd-bulb');
    view.hint = { diff: target, until: Infinity, frozen: true };
    return true;
  }
  if (name === 'win') {
    // Sunny Harbor cleared: every difference ringed, overlay up.
    game.startScene(0);
    game.timeLeft = 83;
    findDiffs(game, view, game.scene.diffs.map((d) => d.id), settledAt);
    return true;
  }
  if (name === 'final') {
    // Mountain Cabin under time pressure: six ringed, clock in the red.
    game.startScene(4);
    findDiffs(game, view, ['d-pine', 'd-window', 'd-smoke', 'd-nose', 'd-sled', 'd-crack'], settledAt);
    game.mistakes = 3;
    game.sceneScore = 525;
    game.timeLeft = 23;
    return true;
  }
  return false;
}
