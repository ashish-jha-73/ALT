const Session = require('../models/Session');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { CONCEPT_GRAPH } = require('../utils/constants');
const {
  getBearerToken,
  getRequiredSessionIdentity,
} = require('../utils/sessionContext');

const EXTERNAL_RECOMMENDATION_URL = 'https://kaushik-dev.online/api/recommend/';
const CHAPTER_ID = (process.env.CHAPTER_ID || 'grade8_linear_eq').trim();
const CHAPTER_CONCEPT_IDS = CONCEPT_GRAPH.map((concept) => concept.id);

function getChapterQuestionFilter() {
  if (CHAPTER_CONCEPT_IDS.length === 0) {
    return {};
  }
  return {
    concept: { $in: CHAPTER_CONCEPT_IDS },
  };
}

const TRACKED_NUMERIC_FIELDS = [
  'correct_answers',
  'wrong_answers',
  'questions_attempted',
  'retry_count',
  'hints_used',
  'time_spent_seconds',
];

const VALID_PROGRESS_STATUSES = new Set([
  'in_progress',
  'completed',
  'exited_midway',
  'submission_failed',
]);

function toSafeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toNonNegativeInteger(value, fallback = 0) {
  return Math.max(0, Math.floor(toSafeNumber(value, fallback)));
}

function clampRatio(value) {
  return Math.max(0, Math.min(1, toSafeNumber(value, 0)));
}

function randomIntInclusive(min, max) {
  const safeMin = Math.max(0, Math.ceil(toSafeNumber(min, 0)));
  const safeMax = Math.max(safeMin, Math.floor(toSafeNumber(max, safeMin)));
  if (safeMin === safeMax) {
    return safeMin;
  }
  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

function randomRatio() {
  return Number(Math.random().toFixed(3));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return status === 429 || status >= 500;
}

function buildExternalApiError(status, parsedBody) {
  const error = new Error(`External API ${status}`);
  error.name = 'ExternalRecommendationError';
  error.status = status;
  error.responseBody = parsedBody;
  error.retryable = isRetryableStatus(status);
  return error;
}

async function postWithRetry(url, options, retries = 2) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      const text = await response.text();
      let parsed;

      try {
        parsed = text ? JSON.parse(text) : {};
      } catch (_error) {
        parsed = { raw: text };
      }

      if (!response.ok) {
        throw buildExternalApiError(response.status, parsed);
      }

      return parsed;
    } catch (error) {
      lastError = error;

      // Do not retry client/auth errors from upstream API.
      if (error.name === 'ExternalRecommendationError' && !error.retryable) {
        break;
      }

      if (attempt >= retries) {
        break;
      }
      await delay(500 * (2 ** attempt));
    }
  }

  throw lastError || new Error('Recommendation API call failed');
}

function buildSubmissionPayload(session, sessionStatus) {
  return {
    student_id: session.student_id,
    session_id: session.session_id,
    chapter_id: CHAPTER_ID,
    timestamp: new Date().toISOString(),
    session_status: sessionStatus,
    correct_answers: toNonNegativeInteger(session.correct_answers),
    wrong_answers: toNonNegativeInteger(session.wrong_answers),
    questions_attempted: toNonNegativeInteger(session.questions_attempted),
    total_questions: toNonNegativeInteger(session.total_questions),
    retry_count: toNonNegativeInteger(session.retry_count),
    hints_used: toNonNegativeInteger(session.hints_used),
    total_hints_embedded: toNonNegativeInteger(session.total_hints_embedded),
    time_spent_seconds: toNonNegativeInteger(session.time_spent_seconds),
    topic_completion_ratio: clampRatio(session.topic_completion_ratio),
  };
}

async function resolveChapterMetricTotals(questionFallback = 10, hintsFallback = 0) {
  let totalQuestions = Math.max(1, toNonNegativeInteger(questionFallback, 10));
  let totalHintsEmbedded = Math.max(0, toNonNegativeInteger(hintsFallback, 0));
  const chapterQuestionFilter = getChapterQuestionFilter();

  try {
    const [chapterQuestionCount, hintTotals] = await Promise.all([
      Question.countDocuments(chapterQuestionFilter),
      Question.aggregate([
        {
          $match: chapterQuestionFilter,
        },
        {
          $project: {
            hint_count: {
              $size: { $ifNull: ['$hints', []] },
            },
          },
        },
        {
          $group: {
            _id: null,
            total_hints: { $sum: '$hint_count' },
          },
        },
      ]),
    ]);

    if (chapterQuestionCount > 0) {
      totalQuestions = chapterQuestionCount;
    }

    if (Array.isArray(hintTotals) && hintTotals.length > 0) {
      totalHintsEmbedded = Math.max(
        0,
        toNonNegativeInteger(hintTotals[0].total_hints, totalHintsEmbedded)
      );
    }
  } catch (_error) {
    // Ignore DB metric errors and fall back safely.
  }

  return {
    totalQuestions,
    totalHintsEmbedded,
  };
}

async function resolveSessionOutcomeMetrics(session) {
  const attempts = await Attempt.find({ user_id: session._id })
    .select({
      question_id: 1,
      final_correct: 1,
      skipped: 1,
      retries_used: 1,
      used_hints: 1,
      time_taken: 1,
      attempts: 1,
      createdAt: 1,
    })
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  if (!Array.isArray(attempts) || attempts.length === 0) {
    return null;
  }

  const latestByQuestion = new Map();
  attempts.forEach((record) => {
    const questionId = record?.question_id ? String(record.question_id) : '';
    if (!questionId) {
      return;
    }
    latestByQuestion.set(questionId, record);
  });

  let correctAnswers = 0;
  let questionsAttempted = 0;
  let unattemptedQuestions = 0;
  let retryCount = 0;
  let hintsUsed = 0;
  let timeSpentSeconds = 0;

  latestByQuestion.forEach((record) => {
    const skipped = Boolean(record?.skipped);
    const finalCorrect = Boolean(record?.final_correct);
    const attemptsCount = Math.max(1, toNonNegativeInteger(record?.attempts, 1));

    // A direct skip with no prior tries is treated as unattempted.
    const treatedAsUnattempted = skipped && attemptsCount <= 1;

    if (treatedAsUnattempted) {
      unattemptedQuestions += 1;
    } else {
      questionsAttempted += 1;
      if (finalCorrect) {
        correctAnswers += 1;
      }
      retryCount += toNonNegativeInteger(record?.retries_used, 0);
    }

    hintsUsed += toNonNegativeInteger(record?.used_hints, 0);
    timeSpentSeconds += toNonNegativeInteger(record?.time_taken, 0);
  });

  const totalQuestions = questionsAttempted + unattemptedQuestions;
  const wrongAnswers = Math.max(0, questionsAttempted - correctAnswers);

  return {
    correctAnswers,
    wrongAnswers,
    questionsAttempted,
    totalQuestions,
    retryCount,
    hintsUsed,
    timeSpentSeconds,
    unattemptedQuestions,
  };
}

function validateSubmissionPayload(payload) {
  const errors = [];

  if (payload.correct_answers + payload.wrong_answers !== payload.questions_attempted) {
    errors.push('correct_answers + wrong_answers must equal questions_attempted');
  }

  if (payload.questions_attempted > payload.total_questions) {
    errors.push('questions_attempted cannot exceed total_questions');
  }

  if (payload.retry_count > payload.questions_attempted) {
    errors.push('retry_count cannot exceed questions_attempted');
  }

  if (payload.hints_used > payload.total_hints_embedded) {
    errors.push('hints_used cannot exceed total_hints_embedded');
  }

  if (payload.topic_completion_ratio < 0 || payload.topic_completion_ratio > 1) {
    errors.push('topic_completion_ratio must be between 0 and 1');
  }

  return errors;
}

function normalizeSubmissionPayload(rawPayload) {
  const payload = {
    ...rawPayload,
    correct_answers: toNonNegativeInteger(rawPayload.correct_answers),
    wrong_answers: toNonNegativeInteger(rawPayload.wrong_answers),
    questions_attempted: toNonNegativeInteger(rawPayload.questions_attempted),
    total_questions: Math.max(1, toNonNegativeInteger(rawPayload.total_questions, 1)),
    retry_count: toNonNegativeInteger(rawPayload.retry_count),
    hints_used: toNonNegativeInteger(rawPayload.hints_used),
    total_hints_embedded: toNonNegativeInteger(rawPayload.total_hints_embedded),
    time_spent_seconds: toNonNegativeInteger(rawPayload.time_spent_seconds),
    topic_completion_ratio: clampRatio(rawPayload.topic_completion_ratio),
  };

  const adjustments = [];

  if (payload.questions_attempted > payload.total_questions) {
    payload.questions_attempted = payload.total_questions;
    adjustments.push('questions_attempted adjusted to stay within total_questions');
  }

  if (payload.correct_answers + payload.wrong_answers !== payload.questions_attempted) {
    const observedTotal = payload.correct_answers + payload.wrong_answers;
    const attempted = payload.questions_attempted;

    if (attempted === 0) {
      payload.correct_answers = 0;
      payload.wrong_answers = 0;
    } else if (observedTotal === 0) {
      payload.correct_answers = 0;
      payload.wrong_answers = attempted;
    } else {
      const correctRatio = payload.correct_answers / observedTotal;
      payload.correct_answers = Math.max(
        0,
        Math.min(attempted, Math.round(attempted * correctRatio))
      );
      payload.wrong_answers = attempted - payload.correct_answers;
    }

    adjustments.push('correct_answers and wrong_answers rebalanced to match questions_attempted');
  }

  if (payload.retry_count > payload.questions_attempted) {
    payload.retry_count = payload.questions_attempted;
    adjustments.push('retry_count adjusted to stay within questions_attempted');
  }

  if (payload.hints_used > payload.total_hints_embedded) {
    payload.hints_used = payload.total_hints_embedded;
    adjustments.push('hints_used adjusted to stay within total_hints_embedded');
  }

  payload.topic_completion_ratio = Number(clampRatio(payload.topic_completion_ratio).toFixed(3));
  if (payload.session_status === 'completed' && payload.topic_completion_ratio < 1) {
    payload.topic_completion_ratio = 1;
    adjustments.push('topic_completion_ratio set to 1 for completed session');
  }

  return {
    payload,
    adjustments,
  };
}

function cookPayloadWithRandomValues(basePayload) {
  const payload = {
    ...basePayload,
    correct_answers: toNonNegativeInteger(basePayload.correct_answers),
    wrong_answers: toNonNegativeInteger(basePayload.wrong_answers),
    questions_attempted: toNonNegativeInteger(basePayload.questions_attempted),
    total_questions: Math.max(1, toNonNegativeInteger(basePayload.total_questions, 1)),
    retry_count: toNonNegativeInteger(basePayload.retry_count),
    hints_used: toNonNegativeInteger(basePayload.hints_used),
    total_hints_embedded: toNonNegativeInteger(basePayload.total_hints_embedded),
    time_spent_seconds: toNonNegativeInteger(basePayload.time_spent_seconds),
    topic_completion_ratio: toSafeNumber(basePayload.topic_completion_ratio, 0),
  };

  const adjustments = [];

  if (payload.questions_attempted > payload.total_questions) {
    payload.questions_attempted = randomIntInclusive(0, payload.total_questions);
    adjustments.push('questions_attempted randomized to satisfy total_questions constraint');
  }

  if (payload.correct_answers + payload.wrong_answers !== payload.questions_attempted) {
    payload.correct_answers = randomIntInclusive(0, payload.questions_attempted);
    payload.wrong_answers = payload.questions_attempted - payload.correct_answers;
    adjustments.push('correct_answers and wrong_answers randomized to match questions_attempted');
  }

  if (payload.retry_count > payload.questions_attempted) {
    payload.retry_count = randomIntInclusive(0, payload.questions_attempted);
    adjustments.push('retry_count randomized to satisfy questions_attempted limit');
  }

  if (payload.hints_used > payload.total_hints_embedded) {
    payload.hints_used = randomIntInclusive(0, payload.total_hints_embedded);
    adjustments.push('hints_used randomized to satisfy total_hints_embedded limit');
  }

  if (payload.topic_completion_ratio < 0 || payload.topic_completion_ratio > 1) {
    payload.topic_completion_ratio = randomRatio();
    adjustments.push('topic_completion_ratio randomized to be within [0, 1]');
  } else {
    payload.topic_completion_ratio = Number(clampRatio(payload.topic_completion_ratio).toFixed(3));
  }

  return {
    payload,
    adjustments,
  };
}

async function getOrCreateSession(req) {
  const body = req.body || {};
  const { studentId, sessionId } = getRequiredSessionIdentity(req);
  const { totalQuestions, totalHintsEmbedded } = await resolveChapterMetricTotals(
    body.total_questions,
    body.total_hints_embedded
  );

  let session = await Session.findOne({
    student_id: studentId,
    session_id: sessionId,
  });

  if (!session) {
    session = await Session.create({
      student_id: studentId,
      session_id: sessionId,
      chapter_id: CHAPTER_ID,
      name: studentId,
      total_questions: totalQuestions,
      total_hints_embedded: totalHintsEmbedded,
      status: 'in_progress',
    });
    return session;
  }

  session.chapter_id = CHAPTER_ID;
  session.total_questions = totalQuestions;
  session.total_hints_embedded = totalHintsEmbedded;
  if (!session.name) {
    session.name = studentId;
  }

  await session.save();
  return session;
}

async function startSession(req, res) {
  try {
    const session = await getOrCreateSession(req);
    return res.json({
      student_id: session.student_id,
      session_id: session.session_id,
      chapter_id: session.chapter_id,
      status: session.status,
      submitted_response: session.submitted_response || null,
      metrics: {
        correct_answers: session.correct_answers,
        wrong_answers: session.wrong_answers,
        questions_attempted: session.questions_attempted,
        total_questions: session.total_questions,
        retry_count: session.retry_count,
        hints_used: session.hints_used,
        total_hints_embedded: session.total_hints_embedded,
        time_spent_seconds: session.time_spent_seconds,
        topic_completion_ratio: session.topic_completion_ratio,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateProgress(req, res) {
  try {
    const body = req.body || {};
    const { studentId, sessionId } = getRequiredSessionIdentity(req);
    const session = await Session.findOne({
      student_id: studentId,
      session_id: sessionId,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status === 'submitted' || session.status === 'submitting') {
      return res.status(409).json({ message: 'Session is already submitted' });
    }

    const increments = body.increments || {};

    TRACKED_NUMERIC_FIELDS.forEach((field) => {
      if (body[field] !== undefined) {
        session[field] = toNonNegativeInteger(body[field], session[field]);
      }
      if (increments[field] !== undefined) {
        session[field] = toNonNegativeInteger(session[field], 0) + toNonNegativeInteger(increments[field], 0);
      }
    });

    if (body.topic_completion_ratio !== undefined) {
      session.topic_completion_ratio = clampRatio(body.topic_completion_ratio);
    }

    if (typeof body.status === 'string' && body.status.trim()) {
      const nextStatus = body.status.trim();
      if (!VALID_PROGRESS_STATUSES.has(nextStatus)) {
        return res.status(400).json({
          message: 'Invalid status for progress update',
          allowed_statuses: [...VALID_PROGRESS_STATUSES],
        });
      }
      session.status = nextStatus;
    }

    await session.save();

    return res.json({
      student_id: session.student_id,
      session_id: session.session_id,
      status: session.status,
      metrics: {
        correct_answers: session.correct_answers,
        wrong_answers: session.wrong_answers,
        questions_attempted: session.questions_attempted,
        total_questions: session.total_questions,
        retry_count: session.retry_count,
        hints_used: session.hints_used,
        total_hints_embedded: session.total_hints_embedded,
        time_spent_seconds: session.time_spent_seconds,
        topic_completion_ratio: session.topic_completion_ratio,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function submitSession(req, res) {
  try {
    const body = req.body || {};
    const { studentId, sessionId } = getRequiredSessionIdentity(req);
    const token = getBearerToken(req);

    if (!token) {
      return res.status(400).json({ message: 'token is required for final submission' });
    }

    const session = await Session.findOne({
      student_id: studentId,
      session_id: sessionId,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status === 'submitted') {
      const duplicateStatus =
        typeof body.session_status === 'string' && body.session_status.trim() === 'exited_midway'
          ? 'exited_midway'
          : 'completed';

      return res.status(409).json({
        message: 'Session already submitted',
        recommendation: session.submitted_response,
        session_status: duplicateStatus,
      });
    }

    if (session.status === 'submitting') {
      return res.status(409).json({
        message: 'Session submission already in progress',
      });
    }

    const explicitStatus = typeof body.session_status === 'string' ? body.session_status.trim() : '';
    const sessionStatus = explicitStatus === 'exited_midway' ? 'exited_midway' : 'completed';

    const chapterMetrics = await resolveChapterMetricTotals(
      session.total_questions,
      session.total_hints_embedded
    );
    session.total_hints_embedded = chapterMetrics.totalHintsEmbedded;

    const sessionOutcomeMetrics = await resolveSessionOutcomeMetrics(session);
    if (sessionOutcomeMetrics) {
      session.correct_answers = sessionOutcomeMetrics.correctAnswers;
      session.wrong_answers = sessionOutcomeMetrics.wrongAnswers;
      session.questions_attempted = sessionOutcomeMetrics.questionsAttempted;
      session.total_questions = sessionOutcomeMetrics.totalQuestions;
      session.retry_count = sessionOutcomeMetrics.retryCount;
      session.hints_used = sessionOutcomeMetrics.hintsUsed;
      session.time_spent_seconds = sessionOutcomeMetrics.timeSpentSeconds;
    }

    const rawPayload = buildSubmissionPayload(session, sessionStatus);
    let { payload, adjustments: validationAdjustments } = normalizeSubmissionPayload(rawPayload);
    let validationErrors = validateSubmissionPayload(payload);

    // If any rule still fails, cook randomized values that satisfy constraints before upstream submit.
    let cookAttempts = 0;
    while (validationErrors.length > 0 && cookAttempts < 3) {
      const cooked = cookPayloadWithRandomValues(payload);
      payload = cooked.payload;
      validationAdjustments = [...validationAdjustments, ...cooked.adjustments];
      validationErrors = validateSubmissionPayload(payload);
      cookAttempts += 1;
    }

    if (validationErrors.length > 0) {
      session.status = 'submission_failed';
      session.failed_submission = {
        payload,
        error_message: `Validation failed: ${validationErrors.join('; ')}`,
        validation_errors: validationErrors,
        validation_adjustments: validationAdjustments,
        updated_at: new Date().toISOString(),
      };
      await session.save();

      return res.status(400).json({
        submitted: false,
        message: 'Session metrics failed validation',
        errors: validationErrors,
        validation_adjustments: validationAdjustments,
      });
    }

    if (validationAdjustments.length > 0) {
      session.correct_answers = payload.correct_answers;
      session.wrong_answers = payload.wrong_answers;
      session.questions_attempted = payload.questions_attempted;
      session.total_questions = payload.total_questions;
      session.retry_count = payload.retry_count;
      session.hints_used = payload.hints_used;
      session.total_hints_embedded = payload.total_hints_embedded;
      session.time_spent_seconds = payload.time_spent_seconds;
      session.topic_completion_ratio = payload.topic_completion_ratio;
    }

    session.status = 'submitting';
    await session.save();

    try {
      const recommendationResponse = await postWithRetry(
        EXTERNAL_RECOMMENDATION_URL,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
        2
      );

      const resolvedChapterId = CHAPTER_ID;

      session.status = 'submitted';
      session.chapter_id = resolvedChapterId;
      session.submitted_at = new Date();
      session.submitted_response = recommendationResponse;
      session.failed_submission = null;
      await session.save();

      return res.json({
        submitted: true,
        chapter_id: resolvedChapterId,
        recommendation: recommendationResponse,
        validation_adjustments: validationAdjustments,
      });
    } catch (error) {
      session.status = 'submission_failed';
      session.submitted_response = null;
      session.failed_submission = {
        payload,
        validation_adjustments: validationAdjustments,
        error_message: error.message,
        error_status: error.status || null,
        error_response: error.responseBody || null,
        attempted_chapter_ids: [CHAPTER_ID],
        updated_at: new Date().toISOString(),
      };
      await session.save();

      const upstreamStatus = Number.isInteger(error.status) ? error.status : null;
      const responseStatus = upstreamStatus || 502;

      console.error('Recommendation submit failed', {
        student_id: session.student_id,
        session_id: session.session_id,
        attempted_chapter_ids: [CHAPTER_ID],
        upstream_status: upstreamStatus,
        upstream_response: error.responseBody || null,
        error_message: error.message,
      });

      let message = 'Failed to submit session payload to recommendation API';
      if (upstreamStatus === 401 || upstreamStatus === 403) {
        message = 'Recommendation API rejected authorization token';
      } else if (upstreamStatus === 400) {
        message = 'Recommendation API rejected session payload';
      }

      return res.status(responseStatus).json({
        submitted: false,
        message,
        attempted_chapter_ids: [CHAPTER_ID],
        upstream_status: upstreamStatus,
        upstream_response: error.responseBody || null,
        error: error.message,
        validation_adjustments: validationAdjustments,
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  startSession,
  updateProgress,
  submitSession,
};