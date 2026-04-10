const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question_text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (arr) {
          // Some question types rely on selectable or draggable options.
          const qt = (this.question_type || '').toLowerCase();
          const requiresOptions = ['mcq', 'fill_blank', 'drag_sort', 'drag_and_drop'];
          if (requiresOptions.includes(qt)) {
            return Array.isArray(arr) && arr.length >= 2;
          }
          return true;
        },
        message: 'At least two options are required for multiple-choice or sortable questions',
      },
    },
    correct_answer: {
      type: String,
      required: true,
    },
    concept: {
      type: String,
      required: true,
      index: true,
    },
    level: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
      default: 1,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      index: true,
    },
    question_type: {
      type: String,
      enum: [
        'mcq',
        'fill_blank',
        'fill_in_the_blank',
        'drag_sort',
        'drag_and_drop',
      ],
      default: 'mcq',
      index: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    misconception_target: {
      type: String,
      default: 'concept_error',
    },
    cognitive_level: {
      type: String,
      default: 'apply',
    },
    story_based: {
      type: Boolean,
      default: false,
    },
    time_expected: {
      type: Number,
      default: 60,
    },
    hints: {
      type: [String],
      default: [],
    },
    explanation: {
      type: String,
      default: '',
    },
    explanation_depth: {
      type: String,
      enum: ['short', 'medium', 'deep'],
      default: 'medium',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
