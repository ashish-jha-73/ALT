const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const { DIFFICULTY_ORDER, CONCEPT_TO_SUBTOPIC } = require('../utils/constants');

function getWeakestConcept(knowledgeMap) {
  const entries = Object.entries(knowledgeMap || {});
  if (!entries.length) {
    return 'simplifying_expressions';
  }

  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

function adjustDifficulty(baseDifficulty, direction) {
  const index = DIFFICULTY_ORDER.indexOf(baseDifficulty);
  const safeIndex = index === -1 ? 1 : index;
  const next = Math.max(0, Math.min(DIFFICULTY_ORDER.length - 1, safeIndex + direction));
  return DIFFICULTY_ORDER[next];
}

function chooseDifficulty(learnerModel, fallback = 'medium') {
  let difficulty = fallback;

  if (learnerModel.correct_streak >= 2) {
    difficulty = adjustDifficulty(fallback, 1);
  }

  if (learnerModel.wrong_streak >= 2) {
    difficulty = adjustDifficulty(difficulty, -1);
  }

  return difficulty;
}

function estimateTargetDifficultyFromLoad({ currentDifficulty, latestLoad }) {
  if (latestLoad >= 4) {
    return adjustDifficulty(currentDifficulty, -1);
  }

  if (latestLoad <= 2) {
    return adjustDifficulty(currentDifficulty, 1);
  }

  return currentDifficulty;
}

function hasRepeatedError(recentErrors) {
  if (!recentErrors || recentErrors.length < 2) {
    return null;
  }

  const last = recentErrors[recentErrors.length - 1];
  const prev = recentErrors[recentErrors.length - 2];

  return last && prev && last === prev ? last : null;
}

async function getAttemptsByQuestion(userId) {
  const rows = await Attempt.aggregate([
    { $match: { user_id: userId } },
    { $group: { _id: '$question_id', count: { $sum: 1 } } },
  ]);

  const map = new Map();
  rows.forEach((row) => map.set(String(row._id), row.count));
  return map;
}

function sortCandidateQuestions(candidates, attemptMap) {
  return [...candidates].sort((a, b) => {
    const ac = attemptMap.get(String(a._id)) || 0;
    const bc = attemptMap.get(String(b._id)) || 0;

    if (ac !== bc) {
      return ac - bc;
    }

    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

async function selectNextQuestion(user) {
  const knowledgeObj = Object.fromEntries(user.learner_model.knowledge || []);
  const concept = getWeakestConcept(knowledgeObj);
  const subtopic = CONCEPT_TO_SUBTOPIC[concept] || 'algebraic_expressions';

  const baseDifficulty = chooseDifficulty(user.learner_model, 'medium');
  const targetDifficulty = estimateTargetDifficultyFromLoad({
    currentDifficulty: baseDifficulty,
    latestLoad: user.progress.last_load || 0,
  });

  const historyIds = user.progress.question_history || [];
  const repeatedErrorType = hasRepeatedError(user.learner_model.recent_errors || []);
  const attemptMap = await getAttemptsByQuestion(user._id);

  const baseQuery = {
    concept,
    difficulty: targetDifficulty,
    _id: { $nin: historyIds },
  };

  if (repeatedErrorType && repeatedErrorType !== 'none') {
    baseQuery.misconception_target = repeatedErrorType;
  }

  let candidates = await Question.find(baseQuery).limit(50);

  if (!candidates.length) {
    candidates = await Question.find({
      concept,
      _id: { $nin: historyIds },
    }).limit(50);
  }

  if (!candidates.length) {
    candidates = await Question.find({ concept }).limit(50);
  }

  if (!candidates.length) {
    return null;
  }

  const sorted = sortCandidateQuestions(candidates, attemptMap);
  const selected = sorted[0];

  return {
    question: selected,
    target: {
      concept,
      subtopic,
      difficulty: targetDifficulty,
    },
    repeatedErrorType,
  };
}

module.exports = {
  selectNextQuestion,
  estimateTargetDifficultyFromLoad,
  hasRepeatedError,
};
