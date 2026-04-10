function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function getMasteryDelta({ finalCorrect, attempts, usedHints }) {
  let delta = 0;

  if (finalCorrect) {
    if (attempts === 1) {
      delta += 0.15;
    } else if (attempts >= 2 && attempts <= 3) {
      delta += 0.05;
    } else {
      delta += 0.01;
    }
  } else {
    delta -= 0.1;
  }

  if (usedHints > 0) {
    delta -= 0.05;
  }

  return delta;
}

function updateConceptMastery(currentMastery, event) {
  const delta = getMasteryDelta(event);
  return clamp01((currentMastery || 0) + delta);
}

module.exports = {
  clamp01,
  getMasteryDelta,
  updateConceptMastery,
};
