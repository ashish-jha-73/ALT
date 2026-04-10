const Session = require('../models/Session');
const {
  getBearerToken,
  getRequiredSessionIdentity,
  resolveChapterId,
} = require('../utils/sessionContext');

const EXTERNAL_RECOMMENDATION_URL = 'https://kaushik-dev.online/api/recommend/';
const CHAPTER_ID = (process.env.CHAPTER_ID || 'grade8_linear_eq').trim();
const CHAPTER_ID_ALIASES = String(process.env.CHAPTER_ID_ALIASES || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const TRACKED_NUMERIC_FIELDS = [
  'correct_answers',
  'wrong_answers',
  'questions_attempted',
  'total_questions',
  'retry_count',
  'hints_used',
  'total_hints_embedded',
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

function toText(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function parseGradePrefix(chapterId) {
  const text = toText(chapterId).toLowerCase();
  const match = text.match(/grade\d+/);
  return match ? match[0] : '';
}

function buildChapterIdCandidates(primaryChapterId) {
  const candidates = new Set();
  const push = (value) => {
    const text = toText(value);
    if (text) candidates.add(text);
  };

  const primary = toText(primaryChapterId);
  push(primary);

  if (primary.includes('_')) {
    push(primary.replace(/_/g, '-'));
  }
  if (primary.includes('-')) {
    push(primary.replace(/-/g, '_'));
  }

  const gradePrefix = parseGradePrefix(primary) || parseGradePrefix(CHAPTER_ID) || 'grade8';
  push(`${gradePrefix}_linear_eq`);
  push(`${gradePrefix}-linear-eq`);
  push(`${gradePrefix}_linear_equations_one_variable`);
  push(`${gradePrefix}-linear-equations-one-variable`);

  CHAPTER_ID_ALIASES.forEach((alias) => push(alias));

  return [...candidates];
}

function collectErrorMessages(responseBody) {
  const messages = [];

  if (typeof responseBody === 'string' && responseBody.trim()) {
    messages.push(responseBody.trim());
  }

  if (responseBody && typeof responseBody.message === 'string' && responseBody.message.trim()) {
    messages.push(responseBody.message.trim());
  }

  if (responseBody && Array.isArray(responseBody.errors)) {
    responseBody.errors.forEach((item) => {
      const text = toText(item);
      if (text) messages.push(text);
    });
  }

  if (responseBody && typeof responseBody.raw === 'string' && responseBody.raw.trim()) {
    messages.push(responseBody.raw.trim());
  }

  return messages;
}

function isChapterMetadataError(error) {
  if (!error || error.status !== 400) return false;

  const text = collectErrorMessages(error.responseBody)
    .join(' ')
    .toLowerCase();

  return (
    text.includes('chapter_id')
    && text.includes('not found')
    && text.includes('metadata')
  );
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
    chapter_id: (session.chapter_id || CHAPTER_ID || '').trim(),
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

  if (payload.session_status === 'completed' && payload.questions_attempted !== payload.total_questions) {
    errors.push('completed sessions must have questions_attempted equal to total_questions');
  }

  return errors;
}

async function getOrCreateSession(req) {
  const body = req.body || {};
  const { studentId, sessionId } = getRequiredSessionIdentity(req);
  const requestedChapterId = resolveChapterId(req);
  const chapterId = (requestedChapterId || CHAPTER_ID || '').trim();
  const totalQuestions = Math.max(1, toNonNegativeInteger(body.total_questions, 10));

  let session = await Session.findOne({
    student_id: studentId,
    session_id: sessionId,
  });

  if (!session) {
    session = await Session.create({
      student_id: studentId,
      session_id: sessionId,
      chapter_id: chapterId,
      name: studentId,
      total_questions: totalQuestions || 10,
      status: 'in_progress',
    });
    return session;
  }

  if (chapterId) {
    session.chapter_id = chapterId;
  }
  if (body.total_questions !== undefined) {
    session.total_questions = totalQuestions;
  }
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
      return res.status(409).json({
        message: 'Session already submitted',
        recommendation: session.submitted_response,
      });
    }

    if (session.status === 'submitting') {
      return res.status(409).json({
        message: 'Session submission already in progress',
      });
    }

    const explicitStatus = typeof body.session_status === 'string' ? body.session_status.trim() : '';
    const sessionStatus = explicitStatus === 'exited_midway' ? 'exited_midway' : 'completed';

    const payload = buildSubmissionPayload(session, sessionStatus);
    const validationErrors = validateSubmissionPayload(payload);

    if (validationErrors.length > 0) {
      session.status = 'submission_failed';
      session.failed_submission = {
        payload,
        error_message: `Validation failed: ${validationErrors.join('; ')}`,
        validation_errors: validationErrors,
        updated_at: new Date().toISOString(),
      };
      await session.save();

      return res.status(400).json({
        submitted: false,
        message: 'Session metrics failed validation',
        errors: validationErrors,
      });
    }

    session.status = 'submitting';
    await session.save();

    try {
      const chapterIdCandidates = buildChapterIdCandidates(payload.chapter_id);
      let recommendationResponse = null;
      let resolvedChapterId = payload.chapter_id;
      let chapterRetryError = null;

      for (const candidateChapterId of chapterIdCandidates) {
        const candidatePayload = {
          ...payload,
          chapter_id: candidateChapterId,
        };

        try {
          recommendationResponse = await postWithRetry(
            EXTERNAL_RECOMMENDATION_URL,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(candidatePayload),
            },
            2
          );

          resolvedChapterId = candidateChapterId;
          payload.chapter_id = candidateChapterId;
          break;
        } catch (error) {
          chapterRetryError = error;

          if (!isChapterMetadataError(error)) {
            throw error;
          }
        }
      }

      if (!recommendationResponse) {
        if (chapterRetryError) {
          chapterRetryError.attemptedChapterIds = chapterIdCandidates;
          throw chapterRetryError;
        }

        throw new Error('Recommendation API call failed');
      }

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
      });
    } catch (error) {
      session.status = 'submission_failed';
      session.submitted_response = null;
      session.failed_submission = {
        payload,
        error_message: error.message,
        error_status: error.status || null,
        error_response: error.responseBody || null,
        attempted_chapter_ids: error.attemptedChapterIds || [payload.chapter_id],
        updated_at: new Date().toISOString(),
      };
      await session.save();

      const upstreamStatus = Number.isInteger(error.status) ? error.status : null;
      const responseStatus = upstreamStatus || 502;

      console.error('Recommendation submit failed', {
        student_id: session.student_id,
        session_id: session.session_id,
        attempted_chapter_ids: error.attemptedChapterIds || [payload.chapter_id],
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
        attempted_chapter_ids: error.attemptedChapterIds || [payload.chapter_id],
        upstream_status: upstreamStatus,
        upstream_response: error.responseBody || null,
        error: error.message,
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