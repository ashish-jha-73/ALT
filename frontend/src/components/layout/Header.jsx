import { useState, useEffect } from 'react';
import CognitiveLoadIndicator from '../CognitiveLoadIndicator';

export default function Header({
  progress,
  conceptMap,
  screen,
  questionPayload,
  activeMissionConcept,
}) {
  const xp = progress?.progress?.xp || conceptMap?.xp || 0;
  const totalScore = progress?.progress?.total_score || conceptMap?.total_score || 0;
  const loadScore = progress?.learner_model?.cognitive_state?.load_score || 0;

  const [showScore, setShowScore] = useState(false);
  useEffect(() => {
    try {
      const stored = (typeof window !== 'undefined') ? window.localStorage.getItem('show_score') : null;
      setShowScore(stored === '1');
    } catch (e) {
      // ignore
    }
  }, []);

  function toggleShowScore(e) {
    const next = typeof e === 'boolean' ? e : (e?.target ? e.target.checked : !showScore);
    setShowScore(next);
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('show_score', next ? '1' : '0');
    } catch (err) {
      // ignore
    }
  }

  const currentConcept = questionPayload?.question?.concept ||
    questionPayload?.lesson?.concept ||
    progress?.progress?.current_concept || '';

  const missionConcept = activeMissionConcept || currentConcept;
  const conceptLevels = progress?.progress?.concept_levels || {};
  const missionLevel = (() => {
    if (!missionConcept) return null;
    if (typeof conceptLevels.get === 'function') {
      return Number(conceptLevels.get(missionConcept) || 1);
    }
    return Number(conceptLevels[missionConcept] || questionPayload?.question?.level || questionPayload?.lesson?.level || 1);
  })();
  const showMissionProgress = Boolean(missionConcept) && screen !== 'map' && screen !== 'end';

  function formatConceptLabel(value) {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  const screenTitles = {
    map: 'Concept Map',
    question: 'Challenge Mode',
    feedback: 'Review',
    end: 'Session Summary',
  };

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">{screenTitles[screen] || 'Learning'}</h1>
        {currentConcept && screen !== 'map' && screen !== 'end' && (
          <span className="header__concept-pill">{currentConcept.replace(/_/g, ' ')}</span>
        )}
      </div>

      <div className="header__center">
        {showMissionProgress && (
          <div className="header__mission-progress" role="status" aria-live="polite">
            <span className="header__mission-label">Mission</span>
            <span className="header__mission-concept">{formatConceptLabel(missionConcept)}</span>
            <span className="header__mission-sep">•</span>
            <span className="header__mission-step">Step L{missionLevel || 1}</span>
          </div>
        )}
      </div>

      <div className="header__right">
        <CognitiveLoadIndicator loadScore={loadScore} />

        <div className="header__stat-badge header__stat-badge--xp">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--clr-primary)" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{xp}</span>
        </div>
        {showScore && (
          <div className="header__stat-badge header__stat-badge--score">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{totalScore}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
          <label style={{ cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={showScore} onChange={(e) => toggleShowScore(e)} />
            <span>Show Score</span>
          </label>
        </div>
      </div>
    </header>
  );
}
