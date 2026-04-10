const SUPERSCRIPT_MAP = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
};

function normalizeMathAnswer(value) {
  if (value === null || value === undefined) return '';

  let text = String(value);

  // Normalize common unicode symbols before further comparison.
  text = text
    .replace(/[−–—]/g, '-')
    .replace(/＋/g, '+');

  // Convert superscript runs like x² or x⁻² into caret notation.
  text = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, (run) => {
    const normalizedRun = run
      .split('')
      .map((ch) => SUPERSCRIPT_MAP[ch] || ch)
      .join('');
    return `^${normalizedRun}`;
  });

  // Normalize alternate exponent forms: x^{2}, x^(2), x^ 2 -> x^2.
  text = text
    .replace(/\^\{\s*([+-]?\d+)\s*\}/g, '^$1')
    .replace(/\^\(\s*([+-]?\d+)\s*\)/g, '^$1')
    .replace(/\^\s*([+-]?\d+)/g, '^$1');

  return text.replace(/\s+/g, '').toLowerCase();
}

function areAnswersEquivalent(submittedAnswer, correctAnswer) {
  return normalizeMathAnswer(submittedAnswer) === normalizeMathAnswer(correctAnswer);
}

module.exports = {
  normalizeMathAnswer,
  areAnswersEquivalent,
};
