const Session = require('../models/Session');
const Question = require('../models/Question');
const { processAttempt } = require('../services/learningService');
const { chooseAdaptiveAction } = require('../services/adaptiveEngineService');
const { selectQuestionForAction, selectQuestionForConcept } = require('../services/questionSelectionService');
const {
  CONCEPT_GRAPH,
  CONCEPT_TO_SUBTOPIC,
  ALLOWED_QUESTION_TYPES,
  MASTERY_UNLOCK_THRESHOLD,
  CONCEPT_UNLOCK_RULES,
} = require('../utils/constants');
const { getPendingLesson, markLessonAsComplete } = require('../services/lessonService');
const { getRequiredSessionIdentity } = require('../utils/sessionContext');

function ensureUserModelShape(user) {
  if (!user.progress.concept_levels) {
    user.progress.concept_levels = new Map(CONCEPT_GRAPH.map((c) => [c.id, 1]));
  }
  if (!user.progress.concept_attempt_counts) {
    user.progress.concept_attempt_counts = new Map(CONCEPT_GRAPH.map((c) => [c.id, 0]));
  }
  if (!user.progress.concept_correct_counts) {
    user.progress.concept_correct_counts = new Map(CONCEPT_GRAPH.map((c) => [c.id, 0]));
  }
  CONCEPT_GRAPH.forEach((node) => {
    if (!user.progress.concept_levels.has(node.id)) {
      user.progress.concept_levels.set(node.id, 1);
    }
    if (!user.progress.concept_attempt_counts.has(node.id)) {
      user.progress.concept_attempt_counts.set(node.id, 0);
    }
    if (!user.progress.concept_correct_counts.has(node.id)) {
      user.progress.concept_correct_counts.set(node.id, 0);
    }
  });
  if (!user.progress.unlocked_concepts || !user.progress.unlocked_concepts.length) {
    user.progress.unlocked_concepts = ['expressions_foundation'];
  }
  if (!user.progress.completed_concepts) {
    user.progress.completed_concepts = [];
  }
  if (!user.progress.taught_lessons) {
    user.progress.taught_lessons = [];
  }
  if (user.progress.xp === undefined) {
    user.progress.xp = 0;
  }
  if (user.progress.total_score === undefined) {
    user.progress.total_score = 0;
  }

  if (!user.learner_model.skill_mastery) {
    user.learner_model.skill_mastery = new Map();
  }
  if (!user.learner_model.behavioral_profile) {
    user.learner_model.behavioral_profile = {
      guessing_tendency: 0,
      persistence: 0.5,
      hint_dependency: 0,
      skip_tendency: 0,
    };
  }
  if (!user.learner_model.cognitive_state) {
    user.learner_model.cognitive_state = { load_score: 0, fatigue_level: 0 };
  }
  if (!user.learner_model.confidence_model) {
    user.learner_model.confidence_model = {
      self_reported: 'medium',
      inferred: 'medium',
      overconfidence_count: 0,
      underconfidence_count: 0,
    };
  }
  if (!user.learner_model.performance_trend) {
    user.learner_model.performance_trend = [];
  }
  if (!user.learner_model.streaks) {
    user.learner_model.streaks = { correct_streak: 0, wrong_streak: 0 };
  }
  if (!user.learner_model.evaluation_matrix) {
    user.learner_model.evaluation_matrix = {
      total_answered: 0,
      total_retries: 0,
      total_skips: 0,
      solved_after_retry: 0,
      wrong_after_retry: 0,
      skip_after_retry: 0,
      retry_success_rate: 0,
      skip_rate: 0,
    };
  }
}

function resolveMissionConceptForRequest(user, requestedConcept) {
  const unlocked = new Set(user.progress.unlocked_concepts || []);
  const completed = new Set(user.progress.completed_concepts || []);

  if (requestedConcept && unlocked.has(requestedConcept) && !completed.has(requestedConcept)) {
    return requestedConcept;
  }

  const currentConcept = user.progress.current_concept;
  if (currentConcept && unlocked.has(currentConcept) && !completed.has(currentConcept)) {
    return currentConcept;
  }

  const firstUnlockedIncomplete = CONCEPT_GRAPH.find(
    (node) => unlocked.has(node.id) && !completed.has(node.id)
  );

  return firstUnlockedIncomplete ? firstUnlockedIncomplete.id : null;
}

async function getOrCreateSession(req, fallbackName = 'Learner') {
  const { studentId, sessionId } = getRequiredSessionIdentity(req);
  const requestedName = String(req.body?.user_name || req.query?.user_name || '').trim();

  let user = await Session.findOne({
    student_id: studentId,
    session_id: sessionId,
  });

  if (!user) {
    user = await Session.create({
      student_id: studentId,
      session_id: sessionId,
      chapter_id: 'grade8_linear_eq',
      name: requestedName || studentId || fallbackName,
      total_questions: 10,
    });
  }

  if (!user.name) {
    user.name = requestedName || studentId || fallbackName;
  }

  ensureUserModelShape(user);
  await user.save();

  return user;
}

async function submitAttempt(req, res) {
  try {
    const {
      user_name,
      question_id,
      selected_answer,
      attempts,
      time_taken,
      used_hints,
      confidence,
      action_taken,
      skipped,
    } = req.body;

    if (!question_id || !selected_answer || !attempts || time_taken === undefined || !confidence) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await getOrCreateSession(req, user_name || 'Learner');
    const question = await Question.findById(question_id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const result = await processAttempt({
      user,
      question,
      submittedAnswer: selected_answer,
      attempts: Number(attempts),
      timeTaken: Number(time_taken),
      usedHints: Number(used_hints || 0),
      confidence: confidence || 'medium',
      actionTaken: action_taken,
      skipped: Boolean(skipped),
    });

    const nextStep = {
      remedial: result.struggling || !!result.repeatedError,
      action: result.struggling
        ? 'Switching to easier remedial question with explanation.'
        : result.finalCorrect
          ? 'Proceeding to next adaptive question.'
          : 'Review explanation and try another targeted question.',
      explanation: result.struggling || !result.finalCorrect ? question.explanation : '',
    };

    return res.json({
      user_id: user._id,
      student_id: user.student_id,
      session_id: user.session_id,
      correctness: result.finalCorrect,
      explanation: result.explanation,
      detected_error_type: result.detectedErrorType,
      cognitive_load: Number(result.load.toFixed(2)),
      inferred_confidence: result.inferredConfidence,
      confidence_alignment: result.confidenceState,
      mastery_update: {
        concept: result.mastery.concept,
        previous: Number(result.mastery.previous.toFixed(2)),
        updated: Number(result.mastery.updated.toFixed(2)),
      },
      skill_gain: Number(result.skillGain.toFixed(3)),
      reward_score: result.reward,
      xp_earned: result.xpEarned,
      current_xp: user.progress.xp,
      total_score: user.progress.total_score,
      behavior_flags: {
        struggling: result.struggling,
        guessing: result.guessing,
        repeated_error: result.repeatedError,
        skipped: Boolean(skipped),
      },
      confidence_calibration:
        (confidence === 'high' && !result.finalCorrect) ||
        (confidence === 'low' && result.finalCorrect)
          ? 'Mismatch between confidence and performance. Reflect before final answer.'
          : 'Confidence appears calibrated.',
      meta_feedback: result.metaFeedback,
      next_step: nextStep,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function nextQuestion(req, res) {
  try {
    const user = await getOrCreateSession(req, req.query?.user_name || 'Learner');

    const engine = chooseAdaptiveAction(user.learner_model);
    const requestedConcept = typeof req.query.concept === 'string' ? req.query.concept : '';
    const missionConcept = resolveMissionConceptForRequest(user, requestedConcept);
    let selected = null;
    if (missionConcept) {
      selected = await selectQuestionForConcept(user, engine.action, missionConcept);
    }
    if (!selected) {
      selected = await selectQuestionForAction(user, engine.action);
    }

    // Ensure selected question is of an allowed type; if not, try to find a replacement
    const allowedTypes = ALLOWED_QUESTION_TYPES;
    if (selected && selected.question && !allowedTypes.includes((selected.question.question_type || '').toLowerCase())) {
      try {
        const alt = await Question.findOne({
          concept: selected.target.concept,
          question_type: { $in: allowedTypes },
          _id: { $nin: user.progress.question_history || [] },
        }).sort({ createdAt: 1 }).exec();
        if (alt) {
          selected.question = alt;
        }
      } catch (e) {
        // ignore and fall back to original selected
      }
    }

    // If still not allowed, try to find an allowed-type question across unlocked concepts
    if (selected && selected.question && !allowedTypes.includes((selected.question.question_type || '').toLowerCase())) {
      try {
        const unlocked = user.progress.unlocked_concepts || ['expressions_foundation'];
        const history = user.progress.question_history || [];
        const altGlobal = await Question.findOne({
          concept: { $in: unlocked },
          question_type: { $in: allowedTypes },
          _id: { $nin: history },
        }).sort({ createdAt: 1 }).exec();
        if (altGlobal) {
          selected.question = altGlobal;
          selected.target = selected.target || {};
          selected.target.concept = altGlobal.concept;
          selected.target.weakest_skill = (altGlobal.skills && altGlobal.skills[0]) || null;
          selected.target.weakest_skill_mastery = 0;
        }
      } catch (e) {
        // ignore
      }
    }

    // Final enforcement: if question type still not allowed, return 404
    if (selected && selected.question && !allowedTypes.includes((selected.question.question_type || '').toLowerCase())) {
      return res.status(404).json({ message: 'No supported question types available at this time' });
    }

    if (!selected) {
      return res.status(404).json({ message: 'No questions available for current concept set' });
    }

    user.progress.current_concept = selected.target.concept;
    user.progress.current_subtopic =
      CONCEPT_TO_SUBTOPIC[selected.target.concept] || 'algebraic_expressions';
    await user.save();

    const remedial = user.learner_model.streaks.wrong_streak >= 2 || user.progress.last_load >= 4;
    const guidance = remedial
      ? 'Let us slow down with a guided remedial question. Use hints step by step.'
      : 'You are ready for this next adaptive question.';

    const pendingLesson = getPendingLesson(
      user,
      selected.target.concept,
      selected.question.level
    );

    if (pendingLesson) {
      return res.json({
        user_id: user._id,
        student_id: user.student_id,
        session_id: user.session_id,
        activity_type: 'lesson',
        lesson: pendingLesson,
        adaptive_context: {
          weakest_concept: selected.target.concept,
          weakest_skill: selected.target.weakest_skill,
          weakest_skill_mastery: Number(selected.target.weakest_skill_mastery.toFixed(2)),
          subtopic: CONCEPT_TO_SUBTOPIC[selected.target.concept] || 'algebraic_expressions',
          target_difficulty: engine.action.difficulty,
          selected_action: engine.action,
          rl_state: engine.state,
          remedial,
          guidance: 'Teach mode active: complete this mini-lesson before challenge mode.',
        },
      });
    }

    return res.json({
      user_id: user._id,
      student_id: user.student_id,
      session_id: user.session_id,
      activity_type: 'question',
      question: {
        id: selected.question._id,
        question_text: selected.question.question_text,
        options: selected.question.options,
        concept: selected.question.concept,
        level: selected.question.level,
        difficulty: selected.question.difficulty,
        question_type: selected.question.question_type,
        skills: selected.question.skills,
        misconception_target: selected.question.misconception_target,
        cognitive_level: selected.question.cognitive_level,
        story_based: selected.question.story_based,
        time_expected: selected.question.time_expected,
        hints: selected.question.hints,
        explanation_depth: selected.question.explanation_depth,
      },
      adaptive_context: {
        weakest_concept: selected.target.concept,
        weakest_skill: selected.target.weakest_skill,
        weakest_skill_mastery: Number(selected.target.weakest_skill_mastery.toFixed(2)),
        subtopic: CONCEPT_TO_SUBTOPIC[selected.target.concept] || 'algebraic_expressions',
        target_difficulty: engine.action.difficulty,
        selected_action: engine.action,
        rl_state: engine.state,
        remedial,
        guidance,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function completeLesson(req, res) {
  try {
    const { user_name, lesson_key } = req.body;

    if (!lesson_key) {
      return res.status(400).json({ message: 'lesson_key is required' });
    }

    const user = await getOrCreateSession(req, user_name || 'Learner');
    markLessonAsComplete(user, lesson_key);
    await user.save();

    return res.json({
      user_id: user._id,
      student_id: user.student_id,
      session_id: user.session_id,
      lesson_completed: lesson_key,
      message: 'Lesson completed. Challenge unlocked.',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getProgress(req, res) {
  try {
    const user = await getOrCreateSession(req, req.query?.user_name || 'Learner');

    return res.json({
      user_id: user._id,
      student_id: user.student_id,
      session_id: user.session_id,
      chapter_id: user.chapter_id,
      name: user.name || user.student_id,
      session_metrics: {
        correct_answers: user.correct_answers,
        wrong_answers: user.wrong_answers,
        questions_attempted: user.questions_attempted,
        total_questions: user.total_questions,
        retry_count: user.retry_count,
        hints_used: user.hints_used,
        total_hints_embedded: user.total_hints_embedded,
        time_spent_seconds: user.time_spent_seconds,
        topic_completion_ratio: user.topic_completion_ratio,
        status: user.status,
      },
      progress: user.progress,
      learner_model: {
        knowledge: Object.fromEntries(user.learner_model.knowledge || []),
        skill_mastery: Object.fromEntries(user.learner_model.skill_mastery || []),
        avg_time: user.learner_model.avg_time,
        hint_usage: user.learner_model.hint_usage,
        confidence_model: user.learner_model.confidence_model,
        cognitive_state: user.learner_model.cognitive_state,
        behavioral_profile: user.learner_model.behavioral_profile,
        evaluation_matrix: user.learner_model.evaluation_matrix,
        performance_trend: user.learner_model.performance_trend,
        error_distribution: user.learner_model.error_distribution,
        total_attempts: user.learner_model.total_attempts,
        streaks: user.learner_model.streaks,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getConceptMap(req, res) {
  try {
    const user = await getOrCreateSession(req, req.query?.user_name || 'Learner');
    const knowledge = Object.fromEntries(user.learner_model.knowledge || []);
    const levelMap = Object.fromEntries(user.progress.concept_levels || []);
    const unlocked = new Set(user.progress.unlocked_concepts || []);
    const completed = new Set(user.progress.completed_concepts || []);

    const nodes = CONCEPT_GRAPH.map((node) => {
      let status = 'locked';
      const mastery = knowledge[node.id] || 0.2;
      const masteryReached = mastery + 1e-9 >= MASTERY_UNLOCK_THRESHOLD;
      const treatAsCompleted =
        completed.has(node.id) ||
        (CONCEPT_UNLOCK_RULES.unlockOnMasteryOnly && masteryReached);

      if (treatAsCompleted) status = 'completed';
      else if (unlocked.has(node.id)) status = 'unlocked';

      return {
        id: node.id,
        label: node.label,
        prerequisites: node.prerequisites,
        status,
        mastery,
        current_level: levelMap[node.id] || 1,
      };
    });

    return res.json({
      user_id: user._id,
      student_id: user.student_id,
      session_id: user.session_id,
      xp: user.progress.xp,
      total_score: user.progress.total_score,
      nodes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getSessionSummary(req, res) {
  try {
    const user = await getOrCreateSession(req, req.query?.user_name || 'Learner');
    const knowledge = Object.fromEntries(user.learner_model.knowledge || []);

    const entries = Object.entries(knowledge);
    entries.sort((a, b) => b[1] - a[1]);

    const strengths = entries.slice(0, 2).map(([concept]) => concept);
    const weaknesses = [...entries].reverse().slice(0, 2).map(([concept]) => concept);

    return res.json({
      user_id: user._id,
      student_id: user.student_id,
      session_id: user.session_id,
      xp: user.progress.xp,
      total_score: user.progress.total_score,
      mastery: knowledge,
      strengths,
      weaknesses,
      behavioral_insights: user.learner_model.behavioral_profile,
      confidence_model: user.learner_model.confidence_model,
      performance_trend: user.learner_model.performance_trend,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  submitAttempt,
  nextQuestion,
  completeLesson,
  getProgress,
  getConceptMap,
  getSessionSummary,
};
