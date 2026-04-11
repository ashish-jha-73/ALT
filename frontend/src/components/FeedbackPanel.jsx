import { useState, useEffect } from 'react';
import ConfidenceIndicator from './ConfidenceIndicator';

export default function FeedbackPanel({
  feedback,
  retryEnabled,
  pendingRetryAttempts,
  onContinue,
  onRetry,
  onSkip,
  loading,
  showStats,
  allowSkip = true,
}) {
  if (!feedback) return null;
  const [localShowStats, setLocalShowStats] = useState(false);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    if (typeof showStats !== 'undefined') return;
    try {
      const stored = (typeof window !== 'undefined') ? window.localStorage.getItem('feedback_show_stats') : null;
      setLocalShowStats(stored === null ? false : stored === '1');
    } catch (e) {
      // ignore
    }
  }, [showStats]);

  useEffect(() => {
    try {
      const s = (typeof window !== 'undefined') ? window.localStorage.getItem('show_score') : null;
      setShowScore(s === '1');
    } catch (e) {
      // ignore
    }
  }, []);

  const effectiveShowStats = typeof showStats !== 'undefined' ? showStats : localShowStats;

  function toggleLocalShowStats(next) {
    // `next` may be an event or a boolean
    const value = typeof next === 'boolean' ? next : (next?.target ? next.target.checked : !localShowStats);
    setLocalShowStats(value);
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('feedback_show_stats', value ? '1' : '0');
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="feedback-screen anim-fade-in">
      {}
      {typeof showStats === 'undefined' && (
        <div className="feedback-screen__toggle" style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 12px' }}>
          <label style={{ cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={localShowStats} onChange={(e) => toggleLocalShowStats(e)} />
            <span>Show stats</span>
          </label>
        </div>
      )}
      {}
      <div className={`feedback-screen__result ${feedback.correctness ? 'feedback-screen__result--correct' : 'feedback-screen__result--incorrect'}`}>
        <div className="feedback-screen__result-icon">
          {feedback.correctness ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--clr-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </div>
        <h2 className="feedback-screen__result-title">
          {feedback.correctness ? 'Well Done!' : 'Keep Trying!'}
        </h2>
        {feedback.xp_earned > 0 && (
          <span className="feedback-screen__xp-badge">+{feedback.xp_earned} XP</span>
        )}
      </div>

      {/* Explanation */}
      {feedback.explanation && (
        <div className="feedback-screen__card">
          <h3>Explanation</h3>
          <p>{feedback.explanation}</p>
        </div>
      )}

      {/* Error Detection */}
      {feedback.detected_error_type && feedback.detected_error_type !== 'none' && (
        <div className="feedback-screen__card feedback-screen__card--error">
          <h3>Error Detected</h3>
          <p className="feedback-screen__error-type">{feedback.detected_error_type.replace(/_/g, ' ')}</p>
        </div>
      )}

      {/* Mastery Update */}
      {feedback.mastery_update && (
        <div className="feedback-screen__card">
          <h3>Mastery Update</h3>
          <div className="feedback-screen__mastery-change">
            <span>{(feedback.mastery_update.concept || '').replace(/_/g, ' ')}</span>
            <div className="feedback-screen__mastery-arrow">
              <span>{Math.round((feedback.mastery_update.previous || 0) * 100)}%</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
              <span className={feedback.mastery_update.updated > feedback.mastery_update.previous ? 'text-success' : 'text-error'}>
                {Math.round((feedback.mastery_update.updated || 0) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Meta Feedback: show only when there is meta feedback AND the answer was incorrect */}
      {feedback.meta_feedback?.length > 0 && !feedback.correctness && (
        <div className="feedback-screen__card">
          <h3>Learning Insights</h3>
          <ul className="feedback-screen__insights">
            {feedback.meta_feedback.map((msg, idx) => (
              <li key={idx}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z" />
                </svg>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confidence */}
      <div className="feedback-screen__card">
        <h3>Confidence Analysis</h3>
        <ConfidenceIndicator
          selfReported={feedback.inferred_confidence?.self_reported || ''}
          inferred={feedback.inferred_confidence?.label || feedback.inferred_confidence}
          alignment={feedback.confidence_alignment}
        />
        {feedback.confidence_calibration && (
          <p className="feedback-screen__calibration">{feedback.confidence_calibration}</p>
        )}
      </div>

      {/* Stats Row (optional) */}
      {effectiveShowStats && (
        <div className="feedback-screen__stats">
          {showScore && (
            <div className="feedback-screen__stat">
              <span className="feedback-screen__stat-value">{Number(feedback.reward_score || 0).toFixed(2)}</span>
              <span className="feedback-screen__stat-label">Reward</span>
            </div>
          )}
          <div className="feedback-screen__stat">
            <span className="feedback-screen__stat-value">{feedback.cognitive_load || '-'}</span>
            <span className="feedback-screen__stat-label">Cog. Load</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="feedback-screen__actions">
        {retryEnabled ? (
          <>
            <p className="feedback-screen__retry-note">
              Try again! Attempt #{pendingRetryAttempts}
            </p>
            <button type="button" className="btn-primary" onClick={onRetry} disabled={loading}>
              Retry Question
            </button>
            {allowSkip ? (
              <button type="button" className="btn-ghost" onClick={onSkip} disabled={loading}>
                Skip & Move On
              </button>
            ) : (
              <p className="feedback-screen__progress-note">Skip is disabled until pending questions are answered.</p>
            )}
          </>
        ) : (
          <>
            <p className="feedback-screen__progress-note">Ready for the next challenge.</p>
            <button type="button" className="btn-primary" onClick={onContinue} disabled={loading}>
              Continue Challenge
            </button>
          </>
        )}
      </div>
    </div>
  );
}
