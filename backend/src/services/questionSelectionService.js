const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const {
  CONCEPT_GRAPH,
  ALLOWED_QUESTION_TYPES,
} = require('../utils/constants');

function getWeakestUnlockedConcept(user) {
  const knowledge = Object.fromEntries(user.learner_model.knowledge || []);
  const unlocked = new Set(user.progress.unlocked_concepts || []);

  let weakest = null;
  CONCEPT_GRAPH.forEach((node) => {
    if (!unlocked.has(node.id)) return;
    const mastery = knowledge[node.id] || 0;
    if (!weakest || mastery < weakest.mastery) {
      weakest = { id: node.id, mastery, node };
    }
  });

  return weakest || { id: 'expressions_foundation', mastery: 0.2, node: CONCEPT_GRAPH[0] };
}

function getSequentialMissionConcept(user) {
  const knowledge = Object.fromEntries(user.learner_model.knowledge || []);
  const unlocked = new Set(user.progress.unlocked_concepts || []);
  const completed = new Set(user.progress.completed_concepts || []);
  const currentConcept = user.progress.current_concept;

  if (currentConcept && unlocked.has(currentConcept) && !completed.has(currentConcept)) {
    const node = CONCEPT_GRAPH.find((c) => c.id === currentConcept) || CONCEPT_GRAPH[0];
    return {
      id: currentConcept,
      mastery: knowledge[currentConcept] || 0,
      node,
    };
  }

  const firstUnlockedIncomplete = CONCEPT_GRAPH.find(
    (node) => unlocked.has(node.id) && !completed.has(node.id)
  );

  if (firstUnlockedIncomplete) {
    return {
      id: firstUnlockedIncomplete.id,
      mastery: knowledge[firstUnlockedIncomplete.id] || 0,
      node: firstUnlockedIncomplete,
    };
  }

  return null;
}

function getWeakestSkill(user, conceptNode) {
  const skillMap = Object.fromEntries(user.learner_model.skill_mastery || []);
  let weakestSkill = conceptNode.skills[0];
  let weakestValue = skillMap[weakestSkill] || 0.2;

  conceptNode.skills.forEach((skill) => {
    const val = skillMap[skill] || 0.2;
    if (val < weakestValue) {
      weakestValue = val;
      weakestSkill = skill;
    }
  });

  return { skill: weakestSkill, mastery: weakestValue };
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

function recentErrorType(user) {
  const recent = user.learner_model.recent_errors || [];
  if (recent.length < 2) return null;
  const tail = recent.slice(-2);
  return tail[0] === tail[1] ? tail[1] : null;
}

function getAllowedTypes(allowedTypes) {
  if (Array.isArray(allowedTypes) && allowedTypes.length) {
    return allowedTypes;
  }
  return ALLOWED_QUESTION_TYPES;
}

function buildQuestionQuery({ user, conceptId, weakestSkill, action, allowedTypes }) {
  const allowed = getAllowedTypes(allowedTypes);
  const query = {
    concept: conceptId,
    difficulty: action.difficulty,
    _id: { $nin: user.progress.question_history || [] },
    skills: weakestSkill,
  };

  // Prefer the adaptive engine suggestion if it is in allowed set.
  if (action.questionType && allowed.includes(action.questionType)) {
    query.question_type = action.questionType;
  } else {
    query.question_type = { $in: allowed };
  }

  const repeatedError = recentErrorType(user);
  if (repeatedError) {
    query.misconception_target = repeatedError;
  }

  const level = user.progress.concept_levels.get(conceptId) || 1;
  query.level = level;

  return query;
}

function sortCandidates(candidates, attemptsMap) {
  return [...candidates].sort((a, b) => {
    const aCount = attemptsMap.get(String(a._id)) || 0;
    const bCount = attemptsMap.get(String(b._id)) || 0;
    if (aCount !== bCount) return aCount - bCount;
    const aTime = a.createdAt ? a.createdAt.getTime() : 0;
    const bTime = b.createdAt ? b.createdAt.getTime() : 0;
    return aTime - bTime;
  });
}

async function getRecentQuestionMeta(historyIds, limit = 8) {
  const recentIds = (historyIds || []).slice(-limit);
  if (!recentIds.length) return [];

  const rows = await Question.find({ _id: { $in: recentIds } })
    .select('_id question_type concept')
    .exec();
  const rowMap = new Map(rows.map((row) => [String(row._id), row]));

  return recentIds
    .map((id) => rowMap.get(String(id)))
    .filter(Boolean);
}

function getRecentTypeCountsForConcept(recentQuestions, conceptId) {
  const counts = {};
  recentQuestions
    .filter((q) => q.concept === conceptId)
    .forEach((q) => {
      const type = (q.question_type || '').toLowerCase();
      counts[type] = (counts[type] || 0) + 1;
    });
  return counts;
}

function selectWeightedCandidate({
  candidates,
  attemptsMap,
  lastQuestionType,
  preferredType,
  recentTypeCounts,
}) {
  const topPool = sortCandidates(candidates, attemptsMap).slice(0, 30);

  const weights = topPool.map((q) => {
    const attempts = attemptsMap.get(String(q._id)) || 0;
    const questionType = (q.question_type || '').toLowerCase();

    let w = 1 / (1 + attempts);

    // Encourage engine preference but still keep type diversity.
    if (preferredType && questionType === preferredType) {
      w *= 1.15;
    }

    // Strongly discourage same type repetition back-to-back.
    if (lastQuestionType && questionType === lastQuestionType) {
      w *= 0.45;
    }

    // Within a concept/topic, prefer less recently used types.
    const seenInRecent = recentTypeCounts[questionType] || 0;
    if (seenInRecent === 0) {
      w *= 1.4;
    } else {
      w *= 1 / (1 + seenInRecent * 0.35);
    }

    w += Math.random() * 0.08;
    return Math.max(w, 0.01);
  });

  const totalW = weights.reduce((sum, val) => sum + val, 0);
  let r = Math.random() * totalW;
  let chosen = topPool[0];

  for (let i = 0; i < topPool.length; i++) {
    r -= weights[i];
    if (r <= 0) {
      chosen = topPool[i];
      break;
    }
  }

  return chosen;
}

async function resolveCandidates({ user, conceptId, action, baseQuery, allowedTypes }) {
  const history = user.progress.question_history || [];
  const allowed = getAllowedTypes(allowedTypes);

  let candidates = await Question.find(baseQuery).limit(80);

  if (!candidates.length) {
    candidates = await Question.find({
      concept: conceptId,
      difficulty: action.difficulty,
      question_type: { $in: allowed },
      _id: { $nin: history },
    }).limit(80);
  }

  if (!candidates.length) {
    candidates = await Question.find({
      concept: conceptId,
      question_type: { $in: allowed },
      _id: { $nin: history },
    }).limit(80);
  }

  if (!candidates.length) {
    candidates = await Question.find({
      concept: conceptId,
      question_type: { $in: allowed },
    }).limit(80);
  }

  return candidates;
}

async function selectQuestionForAction(user, action) {
  const prioritizedConcept = getSequentialMissionConcept(user) || getWeakestUnlockedConcept(user);
  const weakestSkill = getWeakestSkill(user, prioritizedConcept.node);

  const query = buildQuestionQuery({
    user,
    conceptId: prioritizedConcept.id,
    weakestSkill: weakestSkill.skill,
    action,
    allowedTypes: ALLOWED_QUESTION_TYPES,
  });

  const candidates = await resolveCandidates({
    user,
    conceptId: prioritizedConcept.id,
    action,
    baseQuery: query,
    allowedTypes: ALLOWED_QUESTION_TYPES,
  });

  if (!candidates.length) return null;

  const attemptsMap = await getAttemptsByQuestion(user._id);
  const history = user.progress.question_history || [];
  const recentQuestions = await getRecentQuestionMeta(history, 8);
  const lastQuestionType = recentQuestions.length
    ? (recentQuestions[recentQuestions.length - 1].question_type || '').toLowerCase()
    : null;
  const preferredType = ALLOWED_QUESTION_TYPES.includes((action.questionType || '').toLowerCase())
    ? action.questionType.toLowerCase()
    : null;
  const recentTypeCounts = getRecentTypeCountsForConcept(recentQuestions, prioritizedConcept.id);

  const chosen = selectWeightedCandidate({
    candidates,
    attemptsMap,
    lastQuestionType,
    preferredType,
    recentTypeCounts,
  });

  const completed = new Set(user.progress.completed_concepts || []);
  const conceptStatus = completed.has(prioritizedConcept.id) ? 'completed' : 'in_progress';

  return {
    question: chosen,
    target: {
      concept: prioritizedConcept.id,
      concept_label: prioritizedConcept.node.label,
      weakest_skill: weakestSkill.skill,
      weakest_skill_mastery: weakestSkill.mastery,
      concept_status: conceptStatus,
    },
  };
}

async function selectQuestionForConcept(user, action, conceptId) {
  // Find the concept node in graph
  const conceptNode = CONCEPT_GRAPH.find((n) => n.id === conceptId) || CONCEPT_GRAPH[0];
  const weakestSkill = getWeakestSkill(user, conceptNode);

  const query = buildQuestionQuery({
    user,
    conceptId,
    weakestSkill: weakestSkill.skill,
    action,
    allowedTypes: ALLOWED_QUESTION_TYPES,
  });

  const candidates = await resolveCandidates({
    user,
    conceptId,
    action,
    baseQuery: query,
    allowedTypes: ALLOWED_QUESTION_TYPES,
  });

  if (!candidates.length) return null;

  const attemptsMap = await getAttemptsByQuestion(user._id);
  const history = user.progress.question_history || [];
  const recentQuestions = await getRecentQuestionMeta(history, 8);
  const lastQuestionType = recentQuestions.length
    ? (recentQuestions[recentQuestions.length - 1].question_type || '').toLowerCase()
    : null;
  const preferredType = ALLOWED_QUESTION_TYPES.includes((action.questionType || '').toLowerCase())
    ? action.questionType.toLowerCase()
    : null;
  const recentTypeCounts = getRecentTypeCountsForConcept(recentQuestions, conceptId);

  const chosen = selectWeightedCandidate({
    candidates,
    attemptsMap,
    lastQuestionType,
    preferredType,
    recentTypeCounts,
  });

  const completed = new Set(user.progress.completed_concepts || []);
  const conceptStatus = completed.has(conceptId) ? 'completed' : 'in_progress';

  return {
    question: chosen,
    target: {
      concept: conceptId,
      concept_label: conceptNode.label,
      weakest_skill: weakestSkill.skill,
      weakest_skill_mastery: weakestSkill.mastery,
      concept_status: conceptStatus,
    },
  };
}

module.exports = {
  selectQuestionForAction,
  selectQuestionForConcept,
};
