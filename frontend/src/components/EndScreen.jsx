import { useEffect, useMemo, useState } from 'react';
import MasteryBar from './MasteryBar';

const conceptLabels = {
  expressions_foundation: 'Expressions',
  simplification_arena: 'Simplification',
  equation_dojo: 'Equations',
  word_problem_lab: 'Word Problems',
};

function formatScore(score) {
  const num = Number(score);
  if (!Number.isFinite(num)) return '-';
  if (num >= 0 && num <= 1) return `${Math.round(num * 100)}%`;
  return `${num}`;
}

function humanizeToken(value) {
  return String(value || '-')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function EndScreen({
  summary,
  onContinue,
  onSubmitSession,
  submittingSession,
  chapterCompleted,
  sessionSubmission,
}) {
  const mastery = summary?.mastery || {};
  const strengths = summary?.strengths || [];
  const weaknesses = summary?.weaknesses || [];
  const behavioral = summary?.behavioral_insights || {};
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    try {
      const s = (typeof window !== 'undefined') ? window.localStorage.getItem('show_score') : null;
      setShowScore(s === '1');
    } catch (_error) {
      // ignore
    }
  }, []);

  const recommendation = useMemo(() => {
    if (!sessionSubmission?.recommendation) return {};
    return sessionSubmission.recommendation;
  }, [sessionSubmission]);

  const recommendationBlock = recommendation?.recommendation || {};
  const diagnosis = recommendation?.diagnosis || {};
  const diagnosisHistory = diagnosis?.history || {};

  const learningState = recommendation?.learning_state || '';
  const recommendationReason = recommendationBlock.reason || recommendation?.reason || '';
  const recommendationType = recommendationBlock.type || recommendation?.type || '';
  const prerequisiteUrl = recommendationBlock.prerequisite_url || recommendation?.prerequisite_url || '';

  const nextSteps = useMemo(() => {
    const nested = recommendationBlock?.next_steps;
    const direct = recommendation?.next_steps;
    if (Array.isArray(nested)) return nested;
    if (Array.isArray(direct)) return direct;
    return [];
  }, [recommendation, recommendationBlock]);

  const diagnosisItems = useMemo(() => {
    return [
      { label: 'Accuracy', value: diagnosis?.accuracy },
      { label: 'Hint Dependency', value: diagnosis?.hint_dependency },
      { label: 'Retry Behavior', value: diagnosis?.retry_behavior },
      { label: 'Time Efficiency', value: diagnosis?.time_efficiency },
    ].filter((item) => item.value !== undefined && item.value !== null && String(item.value).trim() !== '');
  }, [diagnosis]);

  const diagnosisHistoryItems = useMemo(() => {
    return [
      { label: 'Past Attempts', value: diagnosisHistory?.past_attempts },
      { label: 'Average Performance', value: diagnosisHistory?.avg_performance },
      { label: 'Trend', value: diagnosisHistory?.trend },
    ].filter((item) => item.value !== undefined && item.value !== null && String(item.value).trim() !== '');
  }, [diagnosisHistory]);

  const canContinue = !submittingSession;

  return (
    <div className="end-screen anim-fade-in">
      <div className="end-screen__hero">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9zM18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
        <h2 className="end-screen__title">Session Complete!</h2>
        <p className="end-screen__subtitle">Here is how you performed</p>
      </div>

      <div className="end-screen__scores">
        <div className="end-screen__score-card end-screen__score-card--xp">
          <span className="end-screen__score-value">{summary?.xp || 0}</span>
          <span className="end-screen__score-label">Total XP</span>
        </div>
        {showScore && (
          <div className="end-screen__score-card end-screen__score-card--score">
            <span className="end-screen__score-value">{summary?.total_score || 0}</span>
            <span className="end-screen__score-label">Total Score</span>
          </div>
        )}
      </div>

      <div className="end-screen__card">
        <h3>Concept Mastery</h3>
        <div className="end-screen__mastery-list">
          {Object.entries(mastery).map(([concept, value]) => (
            <MasteryBar
              key={concept}
              label={conceptLabels[concept] || concept.replace(/_/g, ' ')}
              value={value}
              max={1}
            />
          ))}
        </div>
      </div>

      <div className="end-screen__two-col">
        <div className="end-screen__card end-screen__card--strengths">
          <h3>Strengths</h3>
          {strengths.length > 0 ? (
            <ul>
              {strengths.map((s) => (
                <li key={s}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {(conceptLabels[s] || s).replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          ) : (
            <p className="end-screen__empty">Keep practicing!</p>
          )}
        </div>
        <div className="end-screen__card end-screen__card--weaknesses">
          <h3>Areas to Improve</h3>
          {weaknesses.length > 0 ? (
            <ul>
              {weaknesses.map((w) => (
                <li key={w}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {(conceptLabels[w] || w).replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          ) : (
            <p className="end-screen__empty">No weaknesses detected!</p>
          )}
        </div>
      </div>

      <div className="end-screen__card">
        <h3>Behavioral Profile</h3>
        <div className="end-screen__behavior-grid">
          <div className="end-screen__behavior-item">
            <span className="end-screen__behavior-label">Persistence</span>
            <div className="end-screen__behavior-bar">
              <div className="end-screen__behavior-fill" style={{ width: `${Math.round((behavioral.persistence || 0) * 100)}%`, background: 'var(--clr-success)' }} />
            </div>
            <span className="end-screen__behavior-value">{Math.round((behavioral.persistence || 0) * 100)}%</span>
          </div>
          <div className="end-screen__behavior-item">
            <span className="end-screen__behavior-label">Guessing</span>
            <div className="end-screen__behavior-bar">
              <div className="end-screen__behavior-fill" style={{ width: `${Math.round((behavioral.guessing_tendency || 0) * 100)}%`, background: 'var(--clr-error)' }} />
            </div>
            <span className="end-screen__behavior-value">{Math.round((behavioral.guessing_tendency || 0) * 100)}%</span>
          </div>
          <div className="end-screen__behavior-item">
            <span className="end-screen__behavior-label">Hint Dependency</span>
            <div className="end-screen__behavior-bar">
              <div className="end-screen__behavior-fill" style={{ width: `${Math.round((behavioral.hint_dependency || 0) * 100)}%`, background: 'var(--clr-warning)' }} />
            </div>
            <span className="end-screen__behavior-value">{Math.round((behavioral.hint_dependency || 0) * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="end-screen__card">
        <h3>Final Submission</h3>
        {sessionSubmission?.submitted ? (
          <>
            <p className="feedback-screen__calibration">Session submitted successfully.</p>

            <div className="end-screen__reco-badges">
              {learningState ? (
                <span className="end-screen__badge end-screen__badge--state">
                  Learning State: {humanizeToken(learningState)}
                </span>
              ) : null}
              {recommendationType ? (
                <span className="end-screen__badge end-screen__badge--type">
                  Recommendation: {humanizeToken(recommendationType)}
                </span>
              ) : null}
            </div>

            <div className="end-screen__api-grid">
              <div className="end-screen__api-item">
                <span className="end-screen__api-key">student_id</span>
                <span className="end-screen__api-value">{recommendation?.student_id || '-'}</span>
              </div>
              <div className="end-screen__api-item">
                <span className="end-screen__api-key">chapter_id</span>
                <span className="end-screen__api-value">{recommendation?.chapter_id || '-'}</span>
              </div>
              <div className="end-screen__api-item">
                <span className="end-screen__api-key">performance_score</span>
                <span className="end-screen__api-value">{formatScore(recommendation?.performance_score)}</span>
              </div>
              <div className="end-screen__api-item">
                <span className="end-screen__api-key">confidence_score</span>
                <span className="end-screen__api-value">{formatScore(recommendation?.confidence_score)}</span>
              </div>
            </div>

            {recommendationReason ? (
              <p className="end-screen__reco-reason">
                <strong>Why this recommendation:</strong> {recommendationReason}
              </p>
            ) : null}

            {diagnosisItems.length > 0 && (
              <div className="end-screen__api-diagnosis">
                <h4>Diagnosis</h4>
                <div className="end-screen__diagnosis-grid">
                  {diagnosisItems.map((item) => (
                    <div key={item.label} className="end-screen__diagnosis-item">
                      <span className="end-screen__diagnosis-label">{item.label}</span>
                      <span className="end-screen__diagnosis-value">{humanizeToken(item.value)}</span>
                    </div>
                  ))}
                </div>
                {diagnosisHistoryItems.length > 0 && (
                  <div className="end-screen__history-grid">
                    {diagnosisHistoryItems.map((item) => (
                      <div key={item.label} className="end-screen__history-item">
                        <span className="end-screen__history-label">{item.label}</span>
                        <span className="end-screen__history-value">{humanizeToken(item.value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {nextSteps.length > 0 ? (
              <ol className="end-screen__steps-list">
                {nextSteps.map((step, idx) => (
                  <li key={`${step}-${idx}`}>
                    <span className="end-screen__step-index">{idx + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="end-screen__empty">No recommendation.next_steps returned.</p>
            )}
            {prerequisiteUrl ? (
              <a className="end-screen__resource-link" href={prerequisiteUrl} target="_blank" rel="noreferrer">
                Open prerequisite resource
              </a>
            ) : null}
          </>
        ) : chapterCompleted ? (
          <p className="end-screen__empty">Chapter complete. Submit once to receive recommendation.next_steps.</p>
        ) : (
          <p className="end-screen__empty">Checkpoint reached. Final submission unlocks only after full chapter mastery and the configured final chapter concept are complete.</p>
        )}
      </div>

      {chapterCompleted && (
        <button
          type="button"
          className="btn-primary"
          onClick={() => onSubmitSession('completed')}
          disabled={submittingSession}
          style={{ marginBottom: 10 }}
        >
          {submittingSession
            ? 'Submitting Session...'
            : (sessionSubmission?.submitted ? 'Send Payload Again' : 'Retry Session Submission')}
        </button>
      )}

      <button type="button" className="btn-primary" onClick={onContinue} disabled={!canContinue}>
        {sessionSubmission?.submitted
          ? 'Finish and Go to Dashboard'
          : 'Continue Learning'}
      </button>
    </div>
  );
}
