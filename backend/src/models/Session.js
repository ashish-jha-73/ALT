const mongoose = require('mongoose');
const { CONCEPT_GRAPH } = require('../utils/constants');

function initKnowledgeMap() {
  return Object.fromEntries(CONCEPT_GRAPH.map((c) => [c.id, 0.2]));
}

function initConceptLevels() {
  return Object.fromEntries(CONCEPT_GRAPH.map((c) => [c.id, 1]));
}

function initConceptCounterMap() {
  return Object.fromEntries(CONCEPT_GRAPH.map((c) => [c.id, 0]));
}

function initSkillMastery() {
  const skills = new Set();
  CONCEPT_GRAPH.forEach((concept) => {
    concept.skills.forEach((skill) => skills.add(skill));
  });
  return Object.fromEntries([...skills].map((skill) => [skill, 0.2]));
}

const learnerModelSchema = new mongoose.Schema(
  {
    knowledge: {
      type: Map,
      of: Number,
      default: initKnowledgeMap,
    },
    skill_mastery: {
      type: Map,
      of: Number,
      default: initSkillMastery,
    },
    error_distribution: {
      sign_error: { type: Number, default: 0 },
      concept_error: { type: Number, default: 0 },
      careless_error: { type: Number, default: 0 },
      equation_error: { type: Number, default: 0 },
    },
    behavioral_profile: {
      guessing_tendency: { type: Number, default: 0 },
      persistence: { type: Number, default: 0.5 },
      hint_dependency: { type: Number, default: 0 },
      skip_tendency: { type: Number, default: 0 },
    },
    cognitive_state: {
      load_score: { type: Number, default: 0 },
      fatigue_level: { type: Number, default: 0 },
    },
    confidence_model: {
      self_reported: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
      inferred: {
        type: String,
        enum: ['low', 'medium', 'high', 'overconfident'],
        default: 'medium',
      },
      overconfidence_count: { type: Number, default: 0 },
      underconfidence_count: { type: Number, default: 0 },
    },
    performance_trend: {
      type: [Number],
      default: [],
    },
    streaks: {
      correct_streak: { type: Number, default: 0 },
      wrong_streak: { type: Number, default: 0 },
    },
    evaluation_matrix: {
      total_answered: { type: Number, default: 0 },
      total_retries: { type: Number, default: 0 },
      total_skips: { type: Number, default: 0 },
      solved_after_retry: { type: Number, default: 0 },
      wrong_after_retry: { type: Number, default: 0 },
      skip_after_retry: { type: Number, default: 0 },
      retry_success_rate: { type: Number, default: 0 },
      skip_rate: { type: Number, default: 0 },
    },
    avg_time: {
      type: Number,
      default: 0,
    },
    hint_usage: {
      type: Number,
      default: 0,
    },
    total_attempts: {
      type: Number,
      default: 0,
    },
    recent_errors: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    current_subtopic: {
      type: String,
      default: 'algebraic_expressions',
    },
    current_concept: {
      type: String,
      default: 'expressions_foundation',
    },
    concept_levels: {
      type: Map,
      of: Number,
      default: initConceptLevels,
    },
    concept_attempt_counts: {
      type: Map,
      of: Number,
      default: initConceptCounterMap,
    },
    concept_correct_counts: {
      type: Map,
      of: Number,
      default: initConceptCounterMap,
    },
    unlocked_concepts: {
      type: [String],
      default: ['expressions_foundation'],
    },
    completed_concepts: {
      type: [String],
      default: [],
    },
    taught_lessons: {
      type: [String],
      default: [],
    },
    xp: {
      type: Number,
      default: 0,
    },
    total_score: {
      type: Number,
      default: 0,
    },
    question_history: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Question',
      default: [],
    },
    last_load: {
      type: Number,
      default: 0,
    },
    diagnostic_completed: {
      type: Boolean,
      default: false,
    },
    learner_level: {
      type: Number,
      default: 0,
      min: 0,
      max: 4,
    },
    diagnostic_score: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    student_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    session_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    chapter_id: {
      type: String,
      default: process.env.CHAPTER_ID || 'grade8-linear-equations-one-variable',
      trim: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    correct_answers: {
      type: Number,
      default: 0,
      min: 0,
    },
    wrong_answers: {
      type: Number,
      default: 0,
      min: 0,
    },
    questions_attempted: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_questions: {
      type: Number,
      default: 10,
      min: 0,
    },
    retry_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    hints_used: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_hints_embedded: {
      type: Number,
      default: 0,
      min: 0,
    },
    time_spent_seconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    topic_completion_ratio: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    status: {
      type: String,
      default: 'in_progress',
      enum: ['in_progress', 'completed', 'exited_midway', 'submitting', 'submitted', 'submission_failed'],
    },
    submitted_at: {
      type: Date,
      default: null,
    },
    submitted_response: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    failed_submission: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    progress: {
      type: progressSchema,
      default: () => ({}),
    },
    learner_model: {
      type: learnerModelSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

sessionSchema.index({ student_id: 1, session_id: 1 }, { unique: true });

module.exports = mongoose.model('Session', sessionSchema);