const mongoose = require('mongoose');

const checkpointMetricsSchema = new mongoose.Schema(
  {
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
      default: 0,
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
  },
  { _id: false }
);

const studentCheckpointSchema = new mongoose.Schema(
  {
    student_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    chapter_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    source_session_id: {
      type: String,
      default: '',
      trim: true,
    },
    progress: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    learner_model: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metrics: {
      type: checkpointMetricsSchema,
      default: () => ({}),
    },
    saved_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

studentCheckpointSchema.index({ student_id: 1, chapter_id: 1 }, { unique: true });

module.exports = mongoose.model('StudentCheckpoint', studentCheckpointSchema);
