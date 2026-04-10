const Attempt = require('../models/Attempt');
const { detectErrorType } = require('./errorDetectionService');
const { buildMetaFeedback } = require('./feedbackService');
const { CONCEPT_GRAPH } = require('../utils/constants');
const { areAnswersEquivalent } = require('../utils/answerNormalization');
const {
  updateLearnerState,
  computeCognitiveLoad,
  updatePerformanceTrend,
} = require('./learnerModelService');
const {
  getLearningGain,
  computeReward,
  calculateXP,
} = require('./scoringService');

function hasRepeatedError(recentErrors) {
  if (!recentErrors || recentErrors.length < 2) return null;
  const recentPair = recentErrors.slice(-2);
  return recentPair[0] === recentPair[1] ? recentPair[0] : null;
}

function detectGuessingBehavior({ attempts, timeTaken, expectedTime }) {
  return attempts >= 2 && timeTaken < expectedTime * 0.45;
}

async function processAttempt({
  user,
  question,
  submittedAnswer,
  attempts,
  timeTaken,
  usedHints,
  confidence,
  actionTaken,
  skipped,
}) {
  const finalCorrect = !skipped && areAnswersEquivalent(submittedAnswer, question.correct_answer);
  const expectedTime = question.time_expected || 60;

  const detectedErrorType = detectErrorType({
    question,
    submittedAnswer,
    finalCorrect,
    timeTaken,
    attempts,
  });

  const learnerState = updateLearnerState({
    user,
    question,
    finalCorrect,
    attempts,
    timeTaken,
    usedHints,
    selfReportedConfidence: confidence,
    detectedErrorType,
    conceptGraph: CONCEPT_GRAPH,
    skipped,
  });
  const concept = question.concept;
  const repeatedError = hasRepeatedError(user.learner_model.recent_errors || []);
  const struggling = attempts >= 3 || (!finalCorrect && user.learner_model.streaks.wrong_streak >= 2);
  const guessing = detectGuessingBehavior({ attempts, timeTaken, expectedTime });

  const learningGain = getLearningGain({
    previousMastery: learnerState.previousMastery,
    newMastery: learnerState.updatedMastery,
    skillGain: learnerState.skillGain,
  });

  const load = computeCognitiveLoad({ attempts, usedHints, timeTaken, expectedTime });
  const reward = computeReward({
    learningGain,
    cognitiveLoad: load,
    errorRepeat: Boolean(repeatedError),
    finalCorrect,
  });

  const xpEarned = calculateXP({
    finalCorrect,
    timeTaken,
    expectedTime,
    attempts,
    usedHints,
    difficulty: question.difficulty,
    skipped,
  });

  user.progress.xp += xpEarned;
  user.progress.total_score += Math.round(reward * 100);
  updatePerformanceTrend(user, reward);

  const attemptRecord = await Attempt.create({
    user_id: user._id,
    question_id: question._id,
    attempts,
    retries_used: Math.max(0, attempts - 1),
    skipped,
    time_taken: timeTaken,
    used_hints: usedHints,
    final_correct: finalCorrect,
    confidence,
    inferred_confidence: learnerState.inferredConfidence.label,
    detected_error_type: detectedErrorType,
    submitted_answer: submittedAnswer,
    load_index: load,
    reward_score: reward,
    action_taken: {
      difficulty: actionTaken?.difficulty || question.difficulty,
      question_type: actionTaken?.questionType || question.question_type || 'mcq',
      hint_mode: actionTaken?.hintMode || 'normal',
      explanation_depth: actionTaken?.explanationDepth || 'medium',
    },
  });

  await user.save();

  const metaFeedback = buildMetaFeedback({
    learnerModel: user.learner_model,
    confidenceState: learnerState.confidenceState,
    latestAttempt: {
      attempts,
      used_hints: usedHints,
      load_index: load,
    },
  });

  return {
    attempt: attemptRecord,
    finalCorrect,
    struggling,
    guessing,
    repeatedError,
    mastery: {
      concept,
      previous: learnerState.previousMastery,
      updated: learnerState.updatedMastery,
    },
    skillGain: learnerState.skillGain,
    detectedErrorType,
    load,
    reward,
    xpEarned,
    inferredConfidence: learnerState.inferredConfidence,
    confidenceState: learnerState.confidenceState,
    explanation: question.explanation,
    metaFeedback,
  };
}

module.exports = {
  processAttempt,
  computeCognitiveLoad,
  detectGuessingBehavior,
};
