const { DIFFICULTY_ORDER } = require('../utils/constants');

function scoreToBand(score) {
  if (score >= 0.66) return 'high';
  if (score <= 0.33) return 'low';
  return 'medium';
}

function inferConfidence({ finalCorrect, timeTaken, attempts, usedHints, expectedTime }) {
  const speedRatio = expectedTime > 0 ? timeTaken / expectedTime : 1;

  if (!finalCorrect && speedRatio < 0.5 && attempts <= 1) {
    return { label: 'overconfident', score: 0.95 };
  }

  let confidenceScore = 0.5;
  if (finalCorrect && speedRatio <= 0.8 && attempts === 1 && usedHints === 0) confidenceScore += 0.35;
  if (attempts >= 3) confidenceScore -= 0.2;
  if (speedRatio >= 1.4) confidenceScore -= 0.15;
  if (usedHints >= 2) confidenceScore -= 0.2;
  if (!finalCorrect) confidenceScore -= 0.2;

  const bounded = Math.max(0, Math.min(1, confidenceScore));
  return { label: scoreToBand(bounded), score: bounded };
}

function getLearningGain({ previousMastery, newMastery, skillGain = 0 }) {
  return Math.max(0, (newMastery - previousMastery) + skillGain * 0.6);
}

function computeReward({ learningGain, cognitiveLoad, errorRepeat, finalCorrect }) {
  const w1 = 1.2;
  const w2 = 0.45;
  const w3 = 0.5;
  const base = w1 * learningGain - w2 * (cognitiveLoad / 5) - w3 * (errorRepeat ? 1 : 0);
  return Number((base + (finalCorrect ? 0.2 : -0.2)).toFixed(3));
}

function calculateXP({ finalCorrect, timeTaken, expectedTime, attempts, usedHints, difficulty, skipped }) {
  if (skipped) {
    return -6;
  }

  const baseByDifficulty = { easy: 20, medium: 30, hard: 40 };
  let xp = finalCorrect ? baseByDifficulty[difficulty] || 20 : -8;

  if (finalCorrect && timeTaken <= expectedTime && attempts === 1 && usedHints === 0) xp += 15;
  if (attempts >= 3) xp -= 8;
  if (usedHints >= 2) xp -= 6;

  return Math.max(-10, Math.round(xp));
}

function difficultyToIndex(difficulty) {
  const idx = DIFFICULTY_ORDER.indexOf(difficulty);
  return idx === -1 ? 1 : idx;
}

module.exports = {
  inferConfidence,
  getLearningGain,
  computeReward,
  calculateXP,
  difficultyToIndex,
};
