function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function updateBKT({
  prior,       
  correct,     
  slip = 0.05,
  guess = 0.2,
  transition = 0.1
}) {
  prior = clamp01(prior);

  let posterior;

  if (correct) {
    const numerator = prior * (1 - slip);
    const denominator =
      prior * (1 - slip) + (1 - prior) * guess;

    posterior = denominator === 0 ? prior : numerator / denominator;
  } else {
    const numerator = prior * slip;
    const denominator =
      prior * slip + (1 - prior) * (1 - guess);

    posterior = denominator === 0 ? prior : numerator / denominator;
  }

  const learned = posterior + (1 - posterior) * transition;

  return clamp01(learned);
}

module.exports = {
  updateBKT,
};