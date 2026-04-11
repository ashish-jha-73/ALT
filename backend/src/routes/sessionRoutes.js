const express = require('express');
const {
  startSession,
  updateProgress,
  saveCheckpoint,
  submitSession,
} = require('../controllers/sessionController');

const router = express.Router();

router.post('/start-session', startSession);
router.post('/update-progress', updateProgress);
router.post('/save-checkpoint', saveCheckpoint);
router.post('/submit-session', submitSession);

module.exports = router;