const { updateConceptMastery } = require('./masteryService');
const { inferConfidence } = require('./scoringService');
const {
  MASTERY_UNLOCK_THRESHOLD,
  CONCEPT_UNLOCK_RULES,
  MASTERY_UPDATE_RULES,
} = require('../utils/constants');
const { updateBKT } = require('./bktService');


function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function clampRange(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getConfidenceAlignment(selfReported, inferredLabel, finalCorrect) {
  if ((selfReported === 'high' && !finalCorrect) || inferredLabel === 'overconfident') {
    return 'overconfidence';
  }

  if (selfReported === 'low' && finalCorrect && (inferredLabel === 'high' || inferredLabel === 'medium')) {
    return 'underconfidence';
  }

  return 'calibrated';
}

function getDifficultyFactorForDelta(delta, difficulty, contextCfg) {
  const difficultyKey = (difficulty || 'medium').toLowerCase();
  if (delta < 0) {
    return (contextCfg.difficultyLoss && contextCfg.difficultyLoss[difficultyKey]) || 1;
  }
  return (contextCfg.difficultyGain && contextCfg.difficultyGain[difficultyKey]) || 1;
}

function computeMasteryContextWeight({
  delta,
  difficulty,
  timeTaken,
  expectedTime,
  finalCorrect,
  selfReportedConfidence,
  inferredLabel,
}) {
  const contextCfg = MASTERY_UPDATE_RULES.context || {};

  let weight = getDifficultyFactorForDelta(delta, difficulty, contextCfg);

  const speedRatio = expectedTime > 0 ? timeTaken / expectedTime : 1;
  const fastScore = clamp01((1 - speedRatio) / 0.5);
  const slowScore = clamp01((speedRatio - 1) / 0.8);

  if (finalCorrect && delta >= 0) {
    weight += fastScore * (contextCfg.fastTimeBonus || 0);
    weight -= slowScore * (contextCfg.slowTimePenalty || 0);
  } else if (!finalCorrect) {
    const fastWrongScore = clamp01((0.6 - speedRatio) / 0.3);
    weight -= fastWrongScore * (contextCfg.fastWrongPenalty || 0);
  }

  const alignment = getConfidenceAlignment(selfReportedConfidence, inferredLabel, finalCorrect);
  if (alignment === 'calibrated' && finalCorrect && delta >= 0) {
    weight += contextCfg.calibratedBonus || 0;
  } else if (alignment === 'overconfidence') {
    weight -= contextCfg.overconfidencePenalty || 0;
  } else if (alignment === 'underconfidence') {
    weight -= contextCfg.underconfidencePenalty || 0;
  }

  return clampRange(weight, contextCfg.minWeight || 0.8, contextCfg.maxWeight || 1.2);
}

function computeCognitiveLoad({ attempts, usedHints, timeTaken, expectedTime }) {
  const safeExpected = expectedTime > 0 ? expectedTime : 60;
  return attempts + usedHints + timeTaken / safeExpected;
}

function updateRunningAverage(previousAvg, count, latest) {
  if (count <= 0) return latest;
  return (previousAvg * (count - 1) + latest) / count;
}

function updateSkillMastery(user, skills, finalCorrect) {
  let totalGain = 0;
  skills.forEach((skill) => {
    const prev = user.learner_model.skill_mastery.get(skill) || 0.2;
    const delta = finalCorrect ? 0.08 : -0.04;
    const next = clamp01(prev + delta);
    user.learner_model.skill_mastery.set(skill, next);
    totalGain += Math.max(0, next - prev);
  });
  return skills.length ? totalGain / skills.length : 0;
}

function updateErrorDistribution(errorDistribution, errorType) {
  if (!errorType || errorType === 'none') return;
  if (errorType in errorDistribution) errorDistribution[errorType] += 1;
}

function detectGuessing({ attempts, timeTaken, expectedTime, finalCorrect }) {
  return !finalCorrect && attempts <= 1 && timeTaken < expectedTime * 0.45;
}

function updateUnlocks(user, conceptGraph) {
  const unlocked = new Set(user.progress.unlocked_concepts || []);
  const completed = new Set(user.progress.completed_concepts || []);
  const knowledge = Object.fromEntries(user.learner_model.knowledge || []);
  const attemptsMap = Object.fromEntries(user.progress.concept_attempt_counts || []);
  const correctMap = Object.fromEntries(user.progress.concept_correct_counts || []);
  const levelMap = Object.fromEntries(user.progress.concept_levels || []);

  conceptGraph.forEach((node) => {
    if (completed.has(node.id)) return;

    const mastery = knowledge[node.id] || 0;
    const attempts = attemptsMap[node.id] || 0;
    const correct = correctMap[node.id] || 0;
    const accuracy = attempts > 0 ? correct / attempts : 0;
    const level = levelMap[node.id] || 1;

    const masteryReached = mastery >= MASTERY_UNLOCK_THRESHOLD;
    const meetsPracticeEvidence =
      attempts >= CONCEPT_UNLOCK_RULES.minAttemptsPerConcept &&
      correct >= CONCEPT_UNLOCK_RULES.minCorrectPerConcept &&
      accuracy >= CONCEPT_UNLOCK_RULES.minAccuracy &&
      level >= CONCEPT_UNLOCK_RULES.requireLevel;

    const meetsCompletionRules =
      masteryReached &&
      (CONCEPT_UNLOCK_RULES.unlockOnMasteryOnly || meetsPracticeEvidence);

    if (meetsCompletionRules) {
      completed.add(node.id);
    }
  });

  completed.forEach((conceptId) => unlocked.add(conceptId));

  const unlockedIncomplete = [...unlocked].filter((conceptId) => !completed.has(conceptId));

  if (!CONCEPT_UNLOCK_RULES.singleActiveConcept || unlockedIncomplete.length === 0) {
    const nextNode = conceptGraph.find((node) => {
      if (completed.has(node.id) || unlocked.has(node.id)) return false;
      return node.prerequisites.every((pid) => completed.has(pid));
    });

    if (nextNode) {
      unlocked.add(nextNode.id);
    }
  }

  user.progress.completed_concepts = [...completed];
  user.progress.unlocked_concepts = [...unlocked];
}

function updatePerformanceTrend(user, reward) {
  user.learner_model.performance_trend.push(Number(reward.toFixed(3)));
  if (user.learner_model.performance_trend.length > 30) {
    user.learner_model.performance_trend = user.learner_model.performance_trend.slice(-30);
  }
}

function updateFatigueState(user, load) {
  const prevLoad = user.learner_model.cognitive_state.load_score || 0;
  const fatigue = user.learner_model.cognitive_state.fatigue_level || 0;
  const trendUp = load > prevLoad ? 0.06 : -0.03;

  user.learner_model.cognitive_state.load_score = load;
  user.learner_model.cognitive_state.fatigue_level = clamp01(fatigue + trendUp);
}

function updateConfidenceCalibration(user, selfReported, inferredLabel, finalCorrect) {
  user.learner_model.confidence_model.self_reported = selfReported;
  user.learner_model.confidence_model.inferred = inferredLabel;

  const alignment = getConfidenceAlignment(selfReported, inferredLabel, finalCorrect);

  if (alignment === 'overconfidence') {
    user.learner_model.confidence_model.overconfidence_count += 1;
    return 'overconfidence';
  }

  if (alignment === 'underconfidence') {
    user.learner_model.confidence_model.underconfidence_count += 1;
    return 'underconfidence';
  }

  return 'calibrated';
}

function updateEvaluationMatrix(user, { attempts, skipped, finalCorrect }) {
  const matrix = user.learner_model.evaluation_matrix;
  const totalRetriesForItem = Math.max(0, attempts - 1);

  matrix.total_answered += 1;
  matrix.total_retries += totalRetriesForItem;

  if (skipped) {
    matrix.total_skips += 1;
    if (totalRetriesForItem > 0) {
      matrix.skip_after_retry += 1;
    }
  } else if (totalRetriesForItem > 0 && finalCorrect) {
    matrix.solved_after_retry += 1;
  } else if (totalRetriesForItem > 0 && !finalCorrect) {
    matrix.wrong_after_retry += 1;
  }

  const attemptsWithRetry =
    matrix.solved_after_retry + matrix.wrong_after_retry + matrix.skip_after_retry;
  matrix.retry_success_rate =
    attemptsWithRetry > 0 ? matrix.solved_after_retry / attemptsWithRetry : 0;
  matrix.skip_rate = matrix.total_answered > 0 ? matrix.total_skips / matrix.total_answered : 0;
}

function updateBehaviorProfile(user, { guessing, attempts, usedHints, skipped }) {
  const total = Math.max(1, user.learner_model.total_attempts);
  const prevGuess = user.learner_model.behavioral_profile.guessing_tendency || 0;
  user.learner_model.behavioral_profile.guessing_tendency =
    (prevGuess * (total - 1) + (guessing ? 1 : 0)) / total;

  const persistenceRaw = 1 - Math.abs(2 - attempts) * 0.25;
  user.learner_model.behavioral_profile.persistence = clamp01(
    (user.learner_model.behavioral_profile.persistence * (total - 1) + persistenceRaw) / total
  );

  const hintDependency = (user.learner_model.hint_usage || 0) / total;
  user.learner_model.behavioral_profile.hint_dependency = clamp01(hintDependency / 3);

  const prevSkip = user.learner_model.behavioral_profile.skip_tendency || 0;
  user.learner_model.behavioral_profile.skip_tendency =
    (prevSkip * (total - 1) + (skipped ? 1 : 0)) / total;
}

function updateLearnerState({
  user,
  question,
  finalCorrect,
  attempts,
  timeTaken,
  usedHints,
  selfReportedConfidence,
  detectedErrorType,
  conceptGraph,
  skipped,
}) {
  const expectedTime = question.time_expected || 60;
  const load = computeCognitiveLoad({ attempts, usedHints, timeTaken, expectedTime });
  const concept = question.concept;
  const previousMastery = user.learner_model.knowledge.get(concept) ?? MASTERY_UPDATE_RULES.defaultPrior;

  const inferredConfidence = inferConfidence({
    finalCorrect,
    timeTaken,
    attempts,
    usedHints,
    expectedTime,
  });

  const bktMastery = updateBKT({
    prior: previousMastery,
    correct: finalCorrect,
    slip: MASTERY_UPDATE_RULES.bkt.slip,
    guess: MASTERY_UPDATE_RULES.bkt.guess,
    transition: MASTERY_UPDATE_RULES.bkt.transition,
  });

  const behaviorAdjustedMastery = updateConceptMastery(previousMastery, {
    finalCorrect,
    attempts,
    usedHints,
  });

  const blendWeight = clamp01(MASTERY_UPDATE_RULES.behaviorBlendWeight);
  const blendedMastery =
    (1 - blendWeight) * bktMastery + blendWeight * behaviorAdjustedMastery;

  let delta = blendedMastery - previousMastery;

  const maxDelta = Math.max(0, Number(MASTERY_UPDATE_RULES.maxDeltaPerAttempt || 0));
  if (maxDelta > 0) {
    delta = clampRange(delta, -maxDelta, maxDelta);
  }

  const smoothingFactor = clamp01(MASTERY_UPDATE_RULES.smoothingFactor ?? 1);
  delta *= smoothingFactor;

  const contextWeight = computeMasteryContextWeight({
    delta,
    difficulty: question.difficulty,
    timeTaken,
    expectedTime,
    finalCorrect,
    selfReportedConfidence,
    inferredLabel: inferredConfidence.label,
  });
  delta *= contextWeight;

  if (maxDelta > 0) {
    const contextCfg = MASTERY_UPDATE_RULES.context || {};
    const maxBoostCap = Math.max(1, Number(contextCfg.maxBoostCap || 1));
    const finalCap = maxDelta * Math.max(smoothingFactor, 0.01) * maxBoostCap;
    delta = clampRange(delta, -finalCap, finalCap);
  }

  let updatedMastery = previousMastery + delta;
  updatedMastery = clamp01(updatedMastery);
  user.learner_model.knowledge.set(concept, updatedMastery);

  const skillGain = updateSkillMastery(user, question.skills || [], finalCorrect);

  user.learner_model.total_attempts += 1;
  user.learner_model.hint_usage += usedHints;
  user.learner_model.avg_time = updateRunningAverage(
    user.learner_model.avg_time,
    user.learner_model.total_attempts,
    timeTaken
  );

  if (finalCorrect) {
    user.learner_model.streaks.correct_streak += 1;
    user.learner_model.streaks.wrong_streak = 0;
  } else {
    user.learner_model.streaks.wrong_streak += 1;
    user.learner_model.streaks.correct_streak = 0;
  }

  updateErrorDistribution(user.learner_model.error_distribution, detectedErrorType);

  if (!finalCorrect && detectedErrorType !== 'none') {
    user.learner_model.recent_errors.push(detectedErrorType);
    if (user.learner_model.recent_errors.length > 12) {
      user.learner_model.recent_errors = user.learner_model.recent_errors.slice(-12);
    }
  }

  const confidenceState = updateConfidenceCalibration(
    user,
    selfReportedConfidence,
    inferredConfidence.label,
    finalCorrect
  );

  const guessing = detectGuessing({ attempts, timeTaken, expectedTime, finalCorrect });
  updateBehaviorProfile(user, { guessing, attempts, usedHints, skipped });
  updateEvaluationMatrix(user, { attempts, skipped, finalCorrect });
  updateFatigueState(user, load);

  user.progress.current_concept = concept;
  user.progress.last_load = load;

  if (!user.progress.concept_attempt_counts) {
    user.progress.concept_attempt_counts = new Map();
  }
  if (!user.progress.concept_correct_counts) {
    user.progress.concept_correct_counts = new Map();
  }

  const prevAttempts = user.progress.concept_attempt_counts.get(concept) || 0;
  user.progress.concept_attempt_counts.set(concept, prevAttempts + 1);
  if (finalCorrect) {
    const prevCorrect = user.progress.concept_correct_counts.get(concept) || 0;
    user.progress.concept_correct_counts.set(concept, prevCorrect + 1);
  }

  const questionId = question._id;
  const history = user.progress.question_history || [];
  if (!history.some((id) => String(id) === String(questionId))) {
    history.push(questionId);
    user.progress.question_history = history.slice(-200);
  }

  const currentLevel = user.progress.concept_levels.get(concept) || 1;
  if (finalCorrect && currentLevel < 3) {
    user.progress.concept_levels.set(concept, currentLevel + 1);
  }

  updateUnlocks(user, conceptGraph);

  return {
    load,
    guessing,
    inferredConfidence,
    confidenceState,
    previousMastery,
    updatedMastery,
    skillGain,
  };
}

module.exports = {
  computeCognitiveLoad,
  updateLearnerState,
  updatePerformanceTrend,
};
