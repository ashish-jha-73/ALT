import MasteryBar from './MasteryBar';

function formatPercent(value) {
  return Math.round((value || 0) * 100);
}

function getStatusClass(status) {
  if (status === 'completed') return 'concept-map-node--completed';
  if (status === 'unlocked') return 'concept-map-node--unlocked';
  return 'concept-map-node--locked';
}

function getStatusLabel(status) {
  if (status === 'completed') return 'Mastered';
  if (status === 'unlocked') return 'In Progress';
  return 'Locked';
}

function getStatusIcon(status) {
  if (status === 'completed') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
  if (status === 'unlocked') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

import { useState, useEffect } from 'react';

export default function ConceptMapView({ conceptMap, onStart }) {
  const nodes = conceptMap?.nodes || [];
  const xp = conceptMap?.xp || 0;
  const totalScore = conceptMap?.total_score || 0;
  const [showScore, setShowScore] = useState(false);
  useEffect(() => {
    try {
      const s = (typeof window !== 'undefined') ? window.localStorage.getItem('show_score') : null;
      setShowScore(s === '1');
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="concept-map anim-fade-in">
      <div className="concept-map__hero">
        <div className="concept-map__hero-text">
          <h2 className="concept-map__title">Your Learning Journey</h2>
          <p className="concept-map__subtitle">
            Master each concept to unlock the next. Reach about 65% mastery with consistent practice to progress.
          </p>
        </div>
        <button type="button" className="concept-map__start-btn" onClick={onStart}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start Mission
        </button>
      </div>

      {/* Score Cards */}
      <div className="concept-map__scores">
        <div className="concept-map__score-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--clr-primary)" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <div>
            <span className="concept-map__score-value">{xp}</span>
            <span className="concept-map__score-label">Experience Points</span>
          </div>
        </div>
        {showScore && (
          <div className="concept-map__score-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9zM18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <div>
              <span className="concept-map__score-value">{totalScore}</span>
              <span className="concept-map__score-label">Total Score</span>
            </div>
          </div>
        )}
      </div>

      {/* Concept Path */}
      <div className="concept-map__path">
        {nodes.map((node, idx) => (
          <div key={node.id} className="concept-map__step">
            {idx > 0 && (() => {
              const connectorActive = node.status !== 'locked';
              return (
                <div className={`concept-map__connector ${connectorActive ? 'concept-map__connector--active' : ''}`}>
                <svg width="2" height="40" viewBox="0 0 2 40">
                  <line x1="1" y1="0" x2="1" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray={connectorActive ? 'none' : '4 4'} />
                </svg>
              </div>
              );
            })()}
            <div className={`concept-map-node ${getStatusClass(node.status)}`}>
              <div className="concept-map-node__header">
                <div className="concept-map-node__icon">
                  {getStatusIcon(node.status)}
                </div>
                <div className="concept-map-node__info">
                  <h3 className="concept-map-node__name">{node.label}</h3>
                  <div className="concept-map-node__meta">
                    <span className={`concept-map-node__status-badge concept-map-node__status-badge--${node.status}`}>
                      {getStatusLabel(node.status)}
                    </span>
                    <span className="concept-map-node__level">Level {node.current_level}</span>
                  </div>
                </div>
                <span className="concept-map-node__percent">{formatPercent(node.mastery)}%</span>
              </div>
              <MasteryBar
                value={node.mastery || 0}
                max={1}
                showLabel={false}
                showPercent={false}
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
