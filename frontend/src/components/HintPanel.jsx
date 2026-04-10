export default function HintPanel({ hints = [], revealedCount = 0, onReveal }) {
  const totalHints = hints.length;
  const visibleHints = hints.slice(0, revealedCount);
  const allRevealed = revealedCount >= totalHints;

  return (
    <div className="hint-panel">
      <div className="hint-panel__header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z" />
        </svg>
        <span className="hint-panel__title">Hints</span>
        <span className="hint-panel__count">{revealedCount}/{totalHints}</span>
      </div>

      {visibleHints.length === 0 && (
        <p className="hint-panel__empty">No hints revealed yet. Use hints if you're stuck.</p>
      )}

      <div className="hint-panel__list">
        {visibleHints.map((hint, idx) => (
          <div key={idx} className="hint-panel__item anim-fade-in">
            <span className="hint-panel__item-number">{idx + 1}</span>
            <p className="hint-panel__item-text">{hint}</p>
          </div>
        ))}
      </div>

      {totalHints > 0 && (
        <button
          type="button"
          className="hint-panel__reveal-btn"
          onClick={onReveal}
          disabled={allRevealed}
        >
          {allRevealed ? 'All Hints Revealed' : `Reveal Hint ${revealedCount + 1}`}
        </button>
      )}
    </div>
  );
}
