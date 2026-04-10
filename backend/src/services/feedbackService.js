const { MISCONCEPTION_GRAPH } = require('../utils/constants');

function getDominantError(errorDistribution) {
  const entries = Object.entries(errorDistribution || {});
  if (!entries.length) {
    return null;
  }

  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][1] > 0 ? entries[0][0] : null;
}

function buildMetaFeedback({ learnerModel, latestAttempt, confidenceState }) {
  const messages = [];
  const dominantError = getDominantError(learnerModel.error_distribution);

  if (dominantError === 'sign_error') {
    messages.push('You are making sign errors frequently. Slow down and track positive/negative signs carefully.');
  } else if (dominantError === 'concept_error') {
    messages.push('Concept-level mistakes are recurring. Let us review the underlying rule before moving ahead.');
  } else if (dominantError === 'careless_error') {
    messages.push('Some mistakes look careless. Recheck each step once before submitting.');
  }

  if (latestAttempt.attempts >= 3) {
    messages.push('You are taking multiple attempts on this question, so we will switch to a remedial step.');
  }

  if (latestAttempt.used_hints >= 2) {
    messages.push('You used several hints. That is okay, but we should reinforce this concept with one easier problem.');
  }

  if (latestAttempt.load_index >= 4) {
    messages.push('Your cognitive load is high right now. Next question will be easier with extra guidance.');
  }

  const matrix = learnerModel.evaluation_matrix;
  if (matrix?.skip_rate > 0.3) {
    messages.push('You are skipping many questions. Let us use simpler scaffolded steps before skipping.');
  }

  if (matrix?.retry_success_rate > 0.65 && matrix?.total_retries >= 3) {
    messages.push('Great persistence: your retries are often successful. Keep using structured retries.');
  }

  if (learnerModel.cognitive_state?.fatigue_level >= 0.65) {
    messages.push('Your load trend is rising. Let us use shorter, scaffolded steps to reduce fatigue.');
  }

  if (learnerModel.behavioral_profile?.guessing_tendency > 0.45) {
    messages.push('You may be guessing often. Try solving one full step before choosing an answer.');
  }

  if (learnerModel.behavioral_profile?.hint_dependency > 0.55) {
    messages.push('You depend heavily on hints. Next round will train independent solving with gradual hint release.');
  }

  if (confidenceState === 'overconfidence') {
    messages.push('You are overconfident in this concept. Validate each operation before final submission.');
  }

  if (confidenceState === 'underconfidence') {
    messages.push('You solved correctly but reported low confidence. Trust your process and reasoning more.');
  }

  if (dominantError && MISCONCEPTION_GRAPH[dominantError]) {
    messages.push(`Remediation focus: ${MISCONCEPTION_GRAPH[dominantError].replace(/_/g, ' ')}.`);
  }

  if (!messages.length) {
    messages.push('Good momentum. Keep focusing on method and accuracy.');
  }

  return messages;
}

module.exports = {
  buildMetaFeedback,
};
