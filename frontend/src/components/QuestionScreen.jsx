import { useEffect, useMemo, useState } from 'react';
import MCQComponent from './questions/MCQComponent';
import FillBlankComponent from './questions/FillBlankComponent';
import DragDropComponent from './questions/DragDropComponent';
import DragSortComponent from './questions/DragSortComponent';
import HintPanel from './HintPanel';
import ConfidenceIndicator from './ConfidenceIndicator';

const confidenceLevels = ['low', 'medium', 'high'];

const SUPERSCRIPT_MAP = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
};

function normalizeAnswer(value) {
  if (value === null || value === undefined) return '';
  let asString = typeof value === 'string' ? value : JSON.stringify(value);

  asString = asString
    .replace(/[−–—]/g, '-')
    .replace(/＋/g, '+')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, (run) => {
      const normalizedRun = run
        .split('')
        .map((ch) => SUPERSCRIPT_MAP[ch] || ch)
        .join('');
      return `^${normalizedRun}`;
    })
    .replace(/\^\{\s*([+-]?\d+)\s*\}/g, '^$1')
    .replace(/\^\(\s*([+-]?\d+)\s*\)/g, '^$1')
    .replace(/\^\s*([+-]?\d+)/g, '^$1');

  return asString.replace(/\s+/g, '').toLowerCase();
}

function extractOptionId(option) {
  if (typeof option !== 'string') return null;
  const idx = option.indexOf(':');
  if (idx === -1) return null;
  return option.slice(0, idx).trim();
}

function parseDragOptions(options = []) {
  const categories = [];
  const items = [];

  options.forEach((opt) => {
    if (typeof opt !== 'string') return;
    if (opt.startsWith('CAT:')) {
      categories.push(opt.slice(4).trim());
      return;
    }
    items.push(opt);
  });

  return {
    categories,
    items,
    isCategorization: categories.length > 0,
  };
}

function sortIds(ids) {
  return [...ids].sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a).localeCompare(String(b));
  });
}

function formatCategoryAnswer(assignments, categories) {
  const parts = categories.map((category) => {
    const ids = sortIds(
      (assignments?.[category] || [])
        .map((item) => extractOptionId(item))
        .filter(Boolean)
    );
    return `${category}: [${ids.join(',')}]`;
  });

  return parts.join(' | ');
}

function isCategoryPlacementComplete(assignments, categories, expectedItemsCount) {
  if (!expectedItemsCount) return false;

  const assignedCount = categories.reduce(
    (sum, category) => sum + ((assignments?.[category] || []).length),
    0
  );

  return assignedCount === expectedItemsCount;
}

function getInitialAnswer(question) {
  return '';
}

export default function QuestionScreen({
  payload,
  onSubmit,
  loading,
  initialAttempts,
  feedback,
  allowSkip = true,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [confidence, setConfidence] = useState('');
  const [attemptsCount, setAttemptsCount] = useState(1);
  const [revealedHints, setRevealedHints] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [dragCorrect, setDragCorrect] = useState(null);

  const question = payload?.question;
  const adaptiveContext = payload?.adaptive_context;
  const dragOptions = useMemo(
    () => parseDragOptions(question?.options || []),
    [question?.id, question?.options]
  );

  useEffect(() => {
    setSelectedAnswer(getInitialAnswer(question));
    setAttemptsCount(initialAttempts || 1);
    setConfidence('medium');
    setRevealedHints(0);
    setSecondsElapsed(0);
    setSubmitted(false);
    setDragCorrect(null);
  }, [question?.id, initialAttempts]);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [question?.id]);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit({
      selected_answer: selectedAnswer,
      confidence,
      attempts: attemptsCount,
      used_hints: revealedHints,
      time_taken: Math.max(1, secondsElapsed),
      skipped: false,
    });
  };

  const handleSkip = () => {
    setSubmitted(true);
    onSubmit({
      selected_answer: '__SKIPPED__',
      confidence,
      attempts: attemptsCount,
      used_hints: revealedHints,
      time_taken: Math.max(1, secondsElapsed),
      skipped: true,
    });
  };

  if (!question) {
    return (
      <div className="question-screen">
        <div className="question-screen__loading">
          <div className="spinner" />
          <p>Loading challenge...</p>
        </div>
      </div>
    );
  }

  const timePercent = question.time_expected > 0
    ? Math.min(100, (secondsElapsed / question.time_expected) * 100)
    : 0;
  const isOverTime = secondsElapsed > question.time_expected;

  const renderQuestionType = () => {
    switch (question.question_type) {
      case 'fill_blank':
      case 'fill_in_the_blank':
        return (
          <FillBlankComponent
            key={question.id || question.question_text}
            questionText={question.question_text}
            answer={selectedAnswer}
            onChange={(formatted) => {
              setSelectedAnswer(formatted);
              if (formatted === null || formatted === undefined || formatted === '') {
                setDragCorrect(null);
                return;
              }
              const expectedRaw = question.correct_answer || '';
              setDragCorrect(normalizeAnswer(formatted) === normalizeAnswer(expectedRaw));
            }}
            disabled={loading || submitted}
          />
        );
      case 'drag_sort':
      case 'drag_and_drop': {
        if (dragOptions.isCategorization) {
          return (
            <>
              <DragDropComponent
                key={question.id || question.question_text}
                items={dragOptions.items}
                categories={dragOptions.categories}
                onResult={(assignments) => {
                  if (!isCategoryPlacementComplete(assignments, dragOptions.categories, dragOptions.items.length)) {
                    setSelectedAnswer('');
                    setDragCorrect(null);
                    return;
                  }

                  const formatted = formatCategoryAnswer(assignments, dragOptions.categories);
                  setSelectedAnswer(formatted);
                  const expectedRaw = question.correct_answer || '';
                  setDragCorrect(normalizeAnswer(formatted) === normalizeAnswer(expectedRaw));
                }}
                disabled={loading || submitted}
              />
              {dragCorrect === true && <div className="question-screen__inline-correct">Correct!</div>}
              {dragCorrect === false && <div className="question-screen__inline-incorrect">Not correct</div>}
            </>
          );
        }

        return (
          <>
            <DragSortComponent
              key={question.id || question.question_text}
              items={dragOptions.items}
              onChange={(formatted, _order, meta) => {
                setSelectedAnswer(formatted);

                if (meta?.isInitial) {
                  setDragCorrect(null);
                  return;
                }

                const expectedRaw = question.correct_answer || '';
                setDragCorrect(normalizeAnswer(formatted) === normalizeAnswer(expectedRaw));
              }}
              disabled={loading || submitted}
            />
            {dragCorrect === true && <div className="question-screen__inline-correct">Correct!</div>}
            {dragCorrect === false && <div className="question-screen__inline-incorrect">Not correct</div>}
          </>
        );
      }
      case 'mcq':
      default:
        return (
          <MCQComponent
            options={question.options || []}
            selectedAnswer={selectedAnswer}
            onSelect={setSelectedAnswer}
            disabled={loading || submitted}
          />
        );
    }
  };

  return (
    <div className="question-screen anim-fade-in">
      {/* Concept Intro Card */}
      <div className="question-screen__intro-card">
        <div className="question-screen__intro-left">
          <h2 className="question-screen__concept-title">
            {(question.concept || '').replace(/_/g, ' ')}
          </h2>
          <div className="question-screen__meta-pills">
            <span className="pill pill--level">Level {question.level}</span>
            <span className={`pill pill--difficulty pill--${question.difficulty}`}>
              {question.difficulty}
            </span>
            <span className="pill pill--type">{(question.question_type || 'mcq').replace(/_/g, ' ')}</span>
          </div>
        </div>
        <div className="question-screen__timer-wrap">
          <div className="question-screen__timer-ring">
            <svg viewBox="0 0 36 36" className="question-screen__timer-svg">
              <path
                className="question-screen__timer-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="question-screen__timer-fill"
                strokeDasharray={`${timePercent}, 100`}
                style={{ stroke: isOverTime ? 'var(--clr-error)' : 'var(--clr-primary)' }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className={`question-screen__timer-text ${isOverTime ? 'question-screen__timer-text--over' : ''}`}>
              {secondsElapsed}s
            </span>
          </div>
        </div>
      </div>

      {/* Adaptive Guidance */}
      {adaptiveContext?.guidance && (
        <div className="question-screen__guidance">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{adaptiveContext.guidance}</span>
        </div>
      )}

      {/* Remedial Banner */}
      {adaptiveContext?.remedial && (
        <div className="question-screen__remedial-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
          <div>
            <strong>Remedial Mode</strong>
            <span>Simplified questions to help you build confidence</span>
          </div>
        </div>
      )}

      {/* Question Text */}
      <div className="question-screen__question-card">
        <p className="question-screen__question-text">{question.question_text}</p>
      </div>

      {/* Question Type Component */}
      <div className="question-screen__answer-area">
        {renderQuestionType()}
      </div>

      {/* Confidence Selector */}
      <div className="question-screen__confidence-row">
        <span className="question-screen__confidence-label">How confident are you?</span>
        <div className="question-screen__confidence-btns">
          {confidenceLevels.map((level) => (
            <button
              key={level}
              type="button"
              className={`confidence-btn ${confidence === level ? `confidence-btn--${level}` : ''}`}
              onClick={() => setConfidence(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Hints */}
      <HintPanel
        hints={question.hints || []}
        revealedCount={revealedHints}
        onReveal={() => setRevealedHints((n) => Math.min(n + 1, (question.hints || []).length))}
      />

      {/* Inline Feedback (after submission) */}
      {feedback && submitted && (
        <div className={`question-screen__feedback anim-fade-in ${feedback.correctness ? 'question-screen__feedback--correct' : 'question-screen__feedback--incorrect'}`}>
          <div className="question-screen__feedback-header">
            {feedback.correctness ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
            <h3>{feedback.correctness ? 'Correct!' : 'Not Quite Right'}</h3>
            {feedback.xp_earned > 0 && (
              <span className="question-screen__feedback-xp">+{feedback.xp_earned} XP</span>
            )}
          </div>

          {feedback.explanation && (
            <p className="question-screen__feedback-explanation">{feedback.explanation}</p>
          )}

          {feedback.detected_error_type && feedback.detected_error_type !== 'none' && (
            <p className="question-screen__feedback-error">
              Detected: {feedback.detected_error_type.replace(/_/g, ' ')}
            </p>
          )}

          {feedback.meta_feedback?.length > 0 && (
            <div className="question-screen__meta-feedback">
              <strong>Insights:</strong>
              <ul>
                {feedback.meta_feedback.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback.confidence_calibration && (
            <p className="question-screen__feedback-calibration">{feedback.confidence_calibration}</p>
          )}

          <ConfidenceIndicator
            selfReported={feedback.inferred_confidence?.self_reported || confidence}
            inferred={feedback.inferred_confidence?.label || feedback.inferred_confidence}
            alignment={feedback.confidence_alignment}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="question-screen__actions">
        <button
          type="button"
          className="btn-primary"
          disabled={loading || !selectedAnswer || submitted}
          onClick={handleSubmit}
        >
          {loading ? <span className="spinner spinner--sm" /> : null}
          {loading ? 'Checking...' : 'Submit Answer'}
        </button>

        {allowSkip ? (
          <button
            type="button"
            className="btn-ghost"
            disabled={loading || submitted}
            onClick={handleSkip}
          >
            Skip Question
          </button>
        ) : (
          <button
            type="button"
            className="btn-ghost"
            disabled
            title="Skip is disabled until all pending questions are answered"
          >
            Skip Disabled
          </button>
        )}
      </div>
    </div>
  );
}
