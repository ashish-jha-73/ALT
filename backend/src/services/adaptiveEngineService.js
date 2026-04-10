const { DIFFICULTY_ORDER, QUESTION_TYPES } = require('../utils/constants');
const { difficultyToIndex } = require('./scoringService');

function getTrendSlope(trend) {
  if (!trend || trend.length < 4) return 0;
  const recent = trend.slice(-4);
  return (recent[3] - recent[0]) / 3;
}

function getRecentErrorRepeat(recentErrors) {
  if (!recentErrors || recentErrors.length < 2) return false;
  const tail = recentErrors.slice(-3);
  return tail.length >= 2 && new Set(tail).size === 1;
}

function actionSpace(baseDifficulty) {
  const actions = [];
  const hintModes = ['normal', 'guided', 'minimal'];
  const explanationDepths = ['short', 'medium', 'deep'];

  QUESTION_TYPES.forEach((questionType) => {
    DIFFICULTY_ORDER.forEach((difficulty) => {
      hintModes.forEach((hintMode) => {
        explanationDepths.forEach((explanationDepth) => {
          actions.push({ difficulty, questionType, hintMode, explanationDepth, baseDifficulty });
        });
      });
    });
  });

  return actions;
}

function evaluateAction(action, state) {
  const baseIdx = difficultyToIndex(action.baseDifficulty);
  const actionIdx = difficultyToIndex(action.difficulty);
  const diffGap = Math.abs(actionIdx - baseIdx);
  const structuredTypes = new Set(['drag_sort', 'drag_and_drop']);
  const quickRecallTypes = new Set(['mcq', 'fill_blank', 'fill_in_the_blank']);

  const loadPenalty = state.loadScore > 4 && actionIdx > baseIdx ? 0.7 : 0;
  const fatiguePenalty = state.fatigue > 0.6 && action.explanationDepth === 'short' ? 0.5 : 0;
  const errorPenalty = state.errorRepeat && quickRecallTypes.has(action.questionType) ? 0.2 : 0;
  const confusionPenalty = diffGap > 1 ? 0.3 : 0;

  const learningGain =
    (state.correctStreak >= 2 && actionIdx >= baseIdx ? 0.9 : 0.5) +
    (state.wrongStreak >= 2 && actionIdx <= baseIdx ? 0.35 : 0) +
    (state.correctStreak >= 2 && structuredTypes.has(action.questionType) ? 0.1 : 0) +
    (state.wrongStreak >= 2 && quickRecallTypes.has(action.questionType) ? 0.12 : 0) +
    (state.errorRepeat && structuredTypes.has(action.questionType) ? 0.18 : 0);

  const cognitiveLoad =
    (actionIdx + 1) * 0.8 +
    (action.hintMode === 'minimal' ? 0.4 : 0) -
    (action.hintMode === 'guided' ? 0.25 : 0);

  const errorRepeat = state.errorRepeat ? 1 : 0;

  const score = 1.2 * learningGain - 0.45 * cognitiveLoad - 0.5 * errorRepeat;

  return score - loadPenalty - fatiguePenalty - errorPenalty - confusionPenalty;
}

function chooseBaseDifficulty({ streaks, loadScore }) {
  let idx = 1;
  if (streaks.correct_streak >= 2) idx += 1;
  if (streaks.wrong_streak >= 2) idx -= 1;
  if (loadScore >= 4.5) idx -= 1;
  if (loadScore <= 2) idx += 1;

  idx = Math.max(0, Math.min(2, idx));
  return DIFFICULTY_ORDER[idx];
}

function chooseAdaptiveAction(learnerModel) {
  const trendSlope = getTrendSlope(learnerModel.performance_trend || []);
  const state = {
    correctStreak: learnerModel.streaks.correct_streak || 0,
    wrongStreak: learnerModel.streaks.wrong_streak || 0,
    loadScore: learnerModel.cognitive_state.load_score || 0,
    fatigue: learnerModel.cognitive_state.fatigue_level || 0,
    trendSlope,
    errorRepeat: getRecentErrorRepeat(learnerModel.recent_errors || []),
  };

  const baseDifficulty = chooseBaseDifficulty({
    streaks: learnerModel.streaks,
    loadScore: state.loadScore,
  });

  const actions = actionSpace(baseDifficulty);
  let best = null;

  actions.forEach((action) => {
    const score = evaluateAction(action, state);
    if (!best || score > best.score) {
      best = { ...action, score: Number(score.toFixed(3)) };
    }
  });

  return {
    action: best,
    state,
  };
}

module.exports = {
  chooseAdaptiveAction,
};
