function toNumeric(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.replace(/\s/g, '');
  if (!/^[-+]?\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  return Number(normalized);
}

function detectErrorType({ question, submittedAnswer, finalCorrect, timeTaken, attempts }) {
  if (finalCorrect) {
    return 'none';
  }

  const submittedNum = toNumeric(submittedAnswer);
  const correctNum = toNumeric(question.correct_answer);

  if (
    submittedNum !== null &&
    correctNum !== null &&
    submittedNum === -1 * correctNum
  ) {
    return 'sign_error';
  }

  if (question.misconception_target === 'sign_error') {
    return 'sign_error';
  }

  if (question.misconception_target === 'concept_error') {
    return 'concept_error';
  }

  if (question.misconception_target === 'equation_error') {
    return 'equation_error';
  }

  const expected = question.time_expected || 60;
  const veryFastWrong = timeTaken < expected * 0.35;
  const singleAttemptWrong = attempts === 1;

  if (veryFastWrong && singleAttemptWrong) {
    return 'careless_error';
  }

  return 'concept_error';
}

module.exports = {
  detectErrorType,
};
