const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      required: true,
      min: 1,
    },
    retries_used: {
      type: Number,
      default: 0,
      min: 0,
    },
    skipped: {
      type: Boolean,
      default: false,
    },
    time_taken: {
      type: Number,
      required: true,
      min: 0,
    },
    used_hints: {
      type: Number,
      default: 0,
      min: 0,
    },
    final_correct: {
      type: Boolean,
      required: true,
    },
    confidence: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    inferred_confidence: {
      type: String,
      enum: ['low', 'medium', 'high', 'overconfident'],
      default: 'medium',
    },
    detected_error_type: {
      type: String,
      default: 'none',
    },
    submitted_answer: {
      type: String,
      required: true,
    },
    load_index: {
      type: Number,
      default: 0,
    },
    reward_score: {
      type: Number,
      default: 0,
    },
    action_taken: {
      difficulty: { type: String, default: 'medium' },
      question_type: { type: String, default: 'mcq' },
      hint_mode: { type: String, default: 'normal' },
      explanation_depth: { type: String, default: 'medium' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attempt', attemptSchema);
