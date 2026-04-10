const express = require('express');
const {
  submitAttempt,
  nextQuestion,
  completeLesson,
  getProgress,
  getConceptMap,
  getSessionSummary,
} = require('../controllers/learningController');
const {
  getDiagnosticQuestions,
  submitDiagnostic,
  getTeachingContent,
} = require('../controllers/diagnosticController');

const router = express.Router();

router.post('/attempt', submitAttempt);
router.post('/complete-lesson', completeLesson);
router.get('/next-question', nextQuestion);
router.get('/progress', getProgress);
router.get('/concept-map', getConceptMap);
router.get('/session-summary', getSessionSummary);
router.get('/diagnostic', getDiagnosticQuestions);
router.post('/diagnostic', submitDiagnostic);
router.get('/teaching-content', getTeachingContent);

module.exports = router;
