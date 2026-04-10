export default function CognitiveLoadIndicator({ loadScore = 0 }) {
  let level, color, label;

  if (loadScore <= 2) {
    level = 1;
    color = 'var(--clr-success)';
    label = 'Low';
  } else if (loadScore <= 4) {
    level = 2;
    color = 'var(--clr-warning)';
    label = 'Medium';
  } else {
    level = 3;
    color = 'var(--clr-error)';
    label = 'High';
  }

  return (
    <div className="cognitive-load">
      <span className="cognitive-load__label">Cognitive Load</span>
      <div className="cognitive-load__bars">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="cognitive-load__bar"
            style={{
              background: i <= level ? color : 'var(--clr-border)',
              height: 8 + i * 4,
            }}
          />
        ))}
      </div>
      <span className="cognitive-load__text" style={{ color }}>{label}</span>
    </div>
  );
}
