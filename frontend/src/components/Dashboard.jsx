function formatPercent(value) {
  return Math.round((value || 0) * 100);
}

const conceptLabels = {
  simplifying_expressions: 'Simplifying Expressions',
  combining_like_terms: 'Combining Like Terms',
  solving_one_step_equations: 'One-Step Equations',
  solving_two_step_equations: 'Two-Step Equations',
};

export default function Dashboard({ learnerModel }) {
  const knowledge = learnerModel?.knowledge || {};
  const concepts = Object.keys(knowledge);

  return (
    <section className="panel dashboard-panel">
      <h2>Dashboard</h2>
      <p className="subtext">Mastery per concept</p>

      <div className="bars">
        {concepts.map((concept) => (
          <div key={concept} className="bar-row">
            <span>{conceptLabels[concept] || concept}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${formatPercent(knowledge[concept])}%` }}
              />
            </div>
            <strong>{formatPercent(knowledge[concept])}%</strong>
          </div>
        ))}
      </div>

      <div className="stats-grid">
        <div>
          <p>Total Attempts</p>
          <strong>{learnerModel?.total_attempts || 0}</strong>
        </div>
        <div>
          <p>Average Time</p>
          <strong>{Math.round(learnerModel?.avg_time || 0)}s</strong>
        </div>
        <div>
          <p>Hint Usage</p>
          <strong>{learnerModel?.hint_usage || 0}</strong>
        </div>
      </div>
    </section>
  );
}
