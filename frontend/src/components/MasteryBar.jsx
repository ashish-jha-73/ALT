export default function MasteryBar({ label, value = 0, max = 1, size = 'md', showLabel = true, showPercent = true }) {
  const percent = Math.round((value / max) * 100);
  const height = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;

  const getColor = () => {
    if (percent >= 70) return 'var(--clr-success)';
    if (percent >= 40) return 'var(--clr-primary)';
    return 'var(--clr-secondary)';
  };

  return (
    <div className="mastery-bar">
      {showLabel && (
        <div className="mastery-bar__header">
          <span className="mastery-bar__label">{label}</span>
          {showPercent && <span className="mastery-bar__percent">{percent}%</span>}
        </div>
      )}
      <div className="mastery-bar__track" style={{ height }}>
        <div
          className="mastery-bar__fill"
          style={{
            width: `${percent}%`,
            background: getColor(),
            height,
          }}
        />
      </div>
    </div>
  );
}
