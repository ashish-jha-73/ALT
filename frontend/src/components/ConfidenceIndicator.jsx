const levelMap = { low: 1, medium: 2, high: 3, overconfident: 4 };
const labelColors = {
  low: 'var(--clr-error)',
  medium: 'var(--clr-warning)',
  high: 'var(--clr-success)',
  overconfident: 'var(--clr-error)',
  calibrated: 'var(--clr-success)',
  underconfident: 'var(--clr-warning)',
};

export default function ConfidenceIndicator({ selfReported, inferred, alignment }) {
  return (
    <div className="confidence-indicator">
      <div className="confidence-indicator__row">
        <span className="confidence-indicator__label">Self-reported</span>
        <span
          className="confidence-indicator__badge"
          style={{ color: labelColors[selfReported] || 'var(--clr-text-muted)' }}
        >
          {selfReported || '-'}
        </span>
      </div>
      <div className="confidence-indicator__row">
        <span className="confidence-indicator__label">Inferred</span>
        <span
          className="confidence-indicator__badge"
          style={{ color: labelColors[inferred] || 'var(--clr-text-muted)' }}
        >
          {inferred || '-'}
        </span>
      </div>
      {alignment && (
        <div className="confidence-indicator__alignment">
          <span
            className="confidence-indicator__alignment-badge"
            style={{ color: labelColors[alignment] || 'var(--clr-text-muted)' }}
          >
            {alignment}
          </span>
        </div>
      )}
    </div>
  );
}
