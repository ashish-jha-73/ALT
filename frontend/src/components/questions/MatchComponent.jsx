import { useState } from 'react';

export default function MatchComponent({ leftItems = [], rightItems = [], onResult, disabled }) {
  const [selected, setSelected] = useState({ side: null, index: null });
  const [matches, setMatches] = useState([]);

  const matchedLeft = matches.map((m) => m.left);
  const matchedRight = matches.map((m) => m.right);

  const handleClick = (side, index) => {
    if (disabled) return;

    if (side === 'left' && matchedLeft.includes(index)) {
      setMatches(matches.filter((m) => m.left !== index));
      setSelected({ side: null, index: null });
      return;
    }
    if (side === 'right' && matchedRight.includes(index)) {
      setMatches(matches.filter((m) => m.right !== index));
      setSelected({ side: null, index: null });
      return;
    }

    if (selected.side === null) {
      setSelected({ side, index });
      return;
    }

    if (selected.side === side) {
      setSelected({ side, index });
      return;
    }

    const newMatch = side === 'left'
      ? { left: index, right: selected.index }
      : { left: selected.index, right: index };

    const next = [...matches.filter((m) => m.left !== newMatch.left && m.right !== newMatch.right), newMatch];
    setMatches(next);
    setSelected({ side: null, index: null });

    if (onResult) {
      const result = {};
      next.forEach((m) => {
        result[leftItems[m.left]] = rightItems[m.right];
      });
      onResult(result);
    }
  };

  const getMatchColor = (idx) => {
    const colors = ['var(--clr-primary)', 'var(--clr-secondary)', 'var(--clr-success)', '#8b5cf6', '#e67e22'];
    return colors[idx % colors.length];
  };

  const getLeftMatchIdx = (idx) => matches.findIndex((m) => m.left === idx);
  const getRightMatchIdx = (idx) => matches.findIndex((m) => m.right === idx);

  return (
    <div className="match-pairs">
      <p className="match-pairs__instruction">Click one item from each column to create a match. Click a matched item to remove it.</p>
      <div className="match-pairs__columns">
        <div className="match-pairs__column">
          {leftItems.map((item, idx) => {
            const matchIdx = getLeftMatchIdx(idx);
            const isMatched = matchIdx !== -1;
            const isSelected = selected.side === 'left' && selected.index === idx;

            return (
              <button
                key={idx}
                type="button"
                className={`match-pairs__item ${isSelected ? 'match-pairs__item--selected' : ''} ${isMatched ? 'match-pairs__item--matched' : ''}`}
                style={isMatched ? { borderColor: getMatchColor(matchIdx), background: `${getMatchColor(matchIdx)}10` } : undefined}
                onClick={() => handleClick('left', idx)}
                disabled={disabled}
              >
                {isMatched && <span className="match-pairs__dot" style={{ background: getMatchColor(matchIdx) }} />}
                {item}
              </button>
            );
          })}
        </div>

        <div className="match-pairs__divider">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-muted)" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="match-pairs__column">
          {rightItems.map((item, idx) => {
            const matchIdx = getRightMatchIdx(idx);
            const isMatched = matchIdx !== -1;
            const isSelected = selected.side === 'right' && selected.index === idx;

            return (
              <button
                key={idx}
                type="button"
                className={`match-pairs__item ${isSelected ? 'match-pairs__item--selected' : ''} ${isMatched ? 'match-pairs__item--matched' : ''}`}
                style={isMatched ? { borderColor: getMatchColor(matchIdx), background: `${getMatchColor(matchIdx)}10` } : undefined}
                onClick={() => handleClick('right', idx)}
                disabled={disabled}
              >
                {isMatched && <span className="match-pairs__dot" style={{ background: getMatchColor(matchIdx) }} />}
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
