const Session = require('../models/Session');
const { getRequiredSessionIdentity } = require('../utils/sessionContext');

const DIAGNOSTIC_QUESTIONS = [
  // Novice (weight 1)
  {
    id: 'd1',
    question_text: 'If x + 3 = 7, what is x?',
    options: ['2', '3', '4', '5'],
    correct_answer: '4',
    diagnostic_level: 'novice',
    difficulty_weight: 1,
    concept_tested: 'basic_equation',
  },
  {
    id: 'd2',
    question_text: 'Which of these is a linear equation?',
    options: ['x² = 4', '2x + 1 = 7', 'x³ = 8', '√x = 2'],
    correct_answer: '2x + 1 = 7',
    diagnostic_level: 'novice',
    difficulty_weight: 1,
    concept_tested: 'identify_equation',
  },
  {
    id: 'd3',
    question_text: "What does 'solving an equation' mean?",
    options: ['Finding a pattern', 'Finding the value of the unknown', 'Drawing a graph', 'Counting terms'],
    correct_answer: 'Finding the value of the unknown',
    diagnostic_level: 'novice',
    difficulty_weight: 1,
    concept_tested: 'understanding',
  },
  // Beginner (weight 2)
  {
    id: 'd4',
    question_text: 'Solve: 2x = 10. What is x?',
    options: ['2', '5', '10', '20'],
    correct_answer: '5',
    diagnostic_level: 'beginner',
    difficulty_weight: 2,
    concept_tested: 'one_step',
  },
  {
    id: 'd5',
    question_text: 'Solve: x – 4 = 9. What is x?',
    options: ['5', '13', '4', '9'],
    correct_answer: '13',
    diagnostic_level: 'beginner',
    difficulty_weight: 2,
    concept_tested: 'one_step',
  },
  {
    id: 'd6',
    question_text: 'If 3x + 2 = 11, what is x?',
    options: ['3', '4', '9', '2'],
    correct_answer: '3',
    diagnostic_level: 'beginner',
    difficulty_weight: 2,
    concept_tested: 'two_step',
  },
  {
    id: 'd7',
    question_text: 'What operation undoes multiplication?',
    options: ['Addition', 'Subtraction', 'Division', 'Squaring'],
    correct_answer: 'Division',
    diagnostic_level: 'beginner',
    difficulty_weight: 2,
    concept_tested: 'inverse_ops',
  },
  // Intermediate (weight 3)
  {
    id: 'd8',
    question_text: 'Solve: 2x + 5 = 15. What is x?',
    options: ['5', '10', '7', '4'],
    correct_answer: '5',
    diagnostic_level: 'intermediate',
    difficulty_weight: 3,
    concept_tested: 'two_step',
  },
  {
    id: 'd9',
    question_text: 'Solve: 4(x – 2) = 12. What is x?',
    options: ['5', '4', '3', '7'],
    correct_answer: '5',
    diagnostic_level: 'intermediate',
    difficulty_weight: 3,
    concept_tested: 'brackets',
  },
  {
    id: 'd10',
    question_text: 'Solve: 3x = x + 8. What is x?',
    options: ['2', '4', '8', '3'],
    correct_answer: '4',
    diagnostic_level: 'intermediate',
    difficulty_weight: 3,
    concept_tested: 'both_sides',
  },
  {
    id: 'd11',
    question_text: 'A number doubled then reduced by 3 equals 11. What is the number?',
    options: ['4', '7', '8', '5'],
    correct_answer: '7',
    diagnostic_level: 'intermediate',
    difficulty_weight: 3,
    concept_tested: 'word_problem',
  },
  {
    id: 'd12',
    question_text: 'Solve: x/3 + 2 = 5. What is x?',
    options: ['6', '9', '3', '12'],
    correct_answer: '9',
    diagnostic_level: 'intermediate',
    difficulty_weight: 3,
    concept_tested: 'fractions',
  },
  // Advanced (weight 4)
  {
    id: 'd13',
    question_text: 'Solve: 5x + 2 = 3x + 10. What is x?',
    options: ['3', '4', '5', '6'],
    correct_answer: '4',
    diagnostic_level: 'advanced',
    difficulty_weight: 4,
    concept_tested: 'both_sides',
  },
  {
    id: 'd14',
    question_text: 'Solve: 2(x + 3) = 3(x – 1). What is x?',
    options: ['6', '9', '3', '12'],
    correct_answer: '9',
    diagnostic_level: 'advanced',
    difficulty_weight: 4,
    concept_tested: 'brackets_both',
  },
  {
    id: 'd15',
    question_text: 'If 2/x = 4/6, what is x?',
    options: ['2', '3', '4', '6'],
    correct_answer: '3',
    diagnostic_level: 'advanced',
    difficulty_weight: 4,
    concept_tested: 'cross_mult',
  },
  {
    id: 'd16',
    question_text: "A father is 4 times as old as his son. In 6 years he'll be twice as old. What is the son's current age?",
    options: ['6', '8', '9', '12'],
    correct_answer: '6',
    diagnostic_level: 'advanced',
    difficulty_weight: 4,
    concept_tested: 'word_problem_adv',
  },
  {
    id: 'd17',
    question_text: 'Solve: 3(2x – 1) – 2(x + 4) = 1. What is x?',
    options: ['2', '3', '4', '5'],
    correct_answer: '3',
    diagnostic_level: 'advanced',
    difficulty_weight: 4,
    concept_tested: 'complex_brackets',
  },
];

function classifyLevel(answers) {
  let weightedScore = 0;
  let maxPossible = 0;
  let noviceCorrect = 0;
  let noviceTotal = 0;
  let beginnerCorrect = 0;
  let beginnerTotal = 0;
  let intermediateCorrect = 0;
  let intermediateTotal = 0;
  let advancedCorrect = 0;
  let advancedTotal = 0;

  answers.forEach((a) => {
    const q = DIAGNOSTIC_QUESTIONS.find((dq) => dq.id === a.id);
    if (!q) return;
    const correct = a.selected_answer === q.correct_answer;
    const w = q.difficulty_weight;
    maxPossible += w;
    if (correct) weightedScore += w;

    if (q.diagnostic_level === 'novice') { noviceTotal++; if (correct) noviceCorrect++; }
    if (q.diagnostic_level === 'beginner') { beginnerTotal++; if (correct) beginnerCorrect++; }
    if (q.diagnostic_level === 'intermediate') { intermediateTotal++; if (correct) intermediateCorrect++; }
    if (q.diagnostic_level === 'advanced') { advancedTotal++; if (correct) advancedCorrect++; }
  });

  const ratio = maxPossible > 0 ? weightedScore / maxPossible : 0;

  // Level classification
  if (advancedTotal > 0 && advancedCorrect / advancedTotal >= 0.6 && ratio >= 0.7) return 4;
  if (intermediateTotal > 0 && intermediateCorrect / intermediateTotal >= 0.6 && ratio >= 0.5) return 3;
  if (beginnerTotal > 0 && beginnerCorrect / beginnerTotal >= 0.5 && ratio >= 0.3) return 2;
  return 1;
}

async function getDiagnosticQuestions(req, res) {
  try {
    const { studentId, sessionId } = getRequiredSessionIdentity(req);
    let user = await Session.findOne({ student_id: studentId, session_id: sessionId });

    if (!user) {
      user = await Session.create({
        student_id: studentId,
        session_id: sessionId,
        chapter_id: 'grade8_linear_eq',
        name: studentId,
      });
    }

    if (user.progress.diagnostic_completed) {
      return res.json({
        diagnostic_completed: true,
        learner_level: user.progress.learner_level,
      });
    }

    // Send questions without correct answers
    const questions = DIAGNOSTIC_QUESTIONS.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      options: q.options,
      diagnostic_level: q.diagnostic_level,
    }));

    res.json({ diagnostic_completed: false, questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function submitDiagnostic(req, res) {
  try {
    const { studentId, sessionId } = getRequiredSessionIdentity(req);
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array required' });
    }

    const user = await Session.findOne({ student_id: studentId, session_id: sessionId });
    if (!user) return res.status(404).json({ message: 'Session not found' });

    const level = classifyLevel(answers);

    // Calculate detailed score
    let correct = 0;
    let total = answers.length;
    answers.forEach((a) => {
      const q = DIAGNOSTIC_QUESTIONS.find((dq) => dq.id === a.id);
      if (q && a.selected_answer === q.correct_answer) correct++;
    });

    user.progress.diagnostic_completed = true;
    user.progress.learner_level = level;
    user.progress.diagnostic_score = correct;

    // Award XP based on weighted diagnostic performance
    // Compute weighted score and max possible using DIAGNOSTIC_QUESTIONS
    let weightedScore = 0;
    let maxPossible = 0;
    answers.forEach((a) => {
      const q = DIAGNOSTIC_QUESTIONS.find((dq) => dq.id === a.id);
      if (!q) return;
      const w = q.difficulty_weight || 1;
      maxPossible += w;
      if (a.selected_answer === q.correct_answer) weightedScore += w;
    });

    const performanceRatio = maxPossible > 0 ? weightedScore / maxPossible : 0;
    // Scale XP: give up to 100 XP for perfect diagnostic; scale linearly
    const xpAwarded = Math.round(performanceRatio * 100);
    user.progress.xp = (user.progress.xp || 0) + xpAwarded;

    // Conservative post-diagnostic start: keep one active concept and only adjust initial readiness.
    user.progress.unlocked_concepts = ['expressions_foundation'];

    if (level >= 3) {
      if (user.learner_model.knowledge) {
        user.learner_model.knowledge.set('expressions_foundation', 0.45);
      }
      if (user.progress.concept_levels && typeof user.progress.concept_levels.set === 'function') {
        user.progress.concept_levels.set('expressions_foundation', 2);
      }
    }

    if (level >= 4) {
      if (user.learner_model.knowledge) {
        user.learner_model.knowledge.set('expressions_foundation', 0.55);
      }
      if (user.progress.concept_levels && typeof user.progress.concept_levels.set === 'function') {
        user.progress.concept_levels.set('expressions_foundation', 3);
      }
    }

    await user.save();

    // Return results with correct answers for review
    const results = answers.map((a) => {
      const q = DIAGNOSTIC_QUESTIONS.find((dq) => dq.id === a.id);
      return {
        id: a.id,
        selected: a.selected_answer,
        correct_answer: q?.correct_answer,
        is_correct: q ? a.selected_answer === q.correct_answer : false,
      };
    });

    res.json({
      user_id: user._id,
      student_id: user.student_id,
      session_id: user.session_id,
      learner_level: level,
      score: correct,
      total,
      level_label: ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced'][level],
      results,
      xp_earned: xpAwarded || 0,
      current_xp: user.progress.xp || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getTeachingContent(req, res) {
  try {
    const { studentId, sessionId } = getRequiredSessionIdentity(req);
    const { concept } = req.query;

    const user = await Session.findOne({ student_id: studentId, session_id: sessionId });
    if (!user) return res.status(404).json({ message: 'Session not found' });

    const learnerLevel = user.progress.learner_level || 1;
    const targetConcept = concept || user.progress.current_concept || 'expressions_foundation';
    const errorDist = user.learner_model?.error_distribution || {};
    const behavioral = user.learner_model?.behavioral_profile || {};
    const cogState = user.learner_model?.cognitive_state || {};

    // Determine explanation style based on learner model
    let explanationStyle = 'story'; // default for beginners
    if (learnerLevel >= 4) {
      explanationStyle = 'symbolic';
    } else if (learnerLevel >= 3) {
      explanationStyle = 'visual';
    } else if (learnerLevel >= 2) {
      explanationStyle = 'guided';
    }

    // Override based on error patterns
    const signErrors = errorDist.sign_error || 0;
    const conceptErrors = errorDist.concept_error || 0;
    const totalErrors = signErrors + conceptErrors + (errorDist.careless_error || 0) + (errorDist.equation_error || 0);

    let adaptiveHint = null;
    if (totalErrors > 0 && signErrors / totalErrors > 0.4) {
      adaptiveHint = 'number_line';
      explanationStyle = 'visual';
    }
    if (behavioral.guessing_tendency > 0.4) {
      explanationStyle = 'guided';
      adaptiveHint = 'slow_down';
    }
    if (cogState.load_score > 4) {
      explanationStyle = 'story';
      adaptiveHint = 'simplify';
    }

    res.json({
      user_id: user._id,
      student_id: user.student_id,
      session_id: user.session_id,
      learner_level: learnerLevel,
      concept: targetConcept,
      explanation_style: explanationStyle,
      adaptive_hint: adaptiveHint,
      cognitive_load: cogState.load_score || 0,
      fatigue: cogState.fatigue_level || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getDiagnosticQuestions,
  submitDiagnostic,
  getTeachingContent,
};
