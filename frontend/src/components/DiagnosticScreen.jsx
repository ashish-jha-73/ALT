import { useState } from 'react';

const levelLabels = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced'];
const levelDescriptions = [
  '',
  'We\'ll start with the fundamentals and build up your understanding step by step.',
  'You have some basics down. We\'ll strengthen your foundation and introduce new concepts.',
  'You\'re comfortable with simple equations. Let\'s tackle more complex problems.',
  'You\'re ready for advanced challenges. Let\'s refine your skills.',
];

export default function DiagnosticScreen({ questions, onSubmit, loading, result }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState(result ? 'result' : 'intro'); // intro, quiz, result

  const totalQuestions = questions?.length || 0;
  const currentQ = questions?.[currentIdx];

  const handleSelect = (answer) => {
    setAnswers({ ...answers, [currentQ.id]: answer });
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitAll = () => {
    const formatted = Object.entries(answers).map(([id, selected_answer]) => ({
      id,
      selected_answer,
    }));
    onSubmit(formatted);
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount >= totalQuestions;

  // Show result
  if (phase === 'result' && result) {
    return (
      <div className="diagnostic-screen anim-fade-in">
        <div className="diagnostic-result">
          <div className="diagnostic-result__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="diagnostic-result__title">Assessment Complete!</h2>

          <div className="diagnostic-result__level-card">
            <span className="diagnostic-result__level-badge">Level {result.learner_level}</span>
            <h3 className="diagnostic-result__level-label">{result.level_label}</h3>
            <p className="diagnostic-result__score">
              You got {result.score} out of {result.total} correct
            </p>
            <p className="diagnostic-result__desc">
              {levelDescriptions[result.learner_level]}
            </p>
          </div>

          {/* Question Review */}
          <div className="diagnostic-result__review">
            <h3>Review</h3>
            <div className="diagnostic-result__review-list">
              {result.results?.map((r, idx) => (
                <div key={r.id} className={`diagnostic-result__review-item ${r.is_correct ? 'diagnostic-result__review-item--correct' : 'diagnostic-result__review-item--incorrect'}`}>
                  <span className="diagnostic-result__review-num">{idx + 1}</span>
                  <span className="diagnostic-result__review-status">
                    {r.is_correct ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="diagnostic-screen anim-fade-in">
        <div className="diagnostic-intro">
          <div className="diagnostic-intro__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h2 className="diagnostic-intro__title">Let's See Where You Are</h2>
          <p className="diagnostic-intro__desc">
            Before we begin, we'll ask you a few questions to understand your current level.
            This helps us teach in the way that works best for you.
          </p>
          <div className="diagnostic-intro__details">
            <div className="diagnostic-intro__detail">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{totalQuestions} questions</span>
            </div>
            <div className="diagnostic-intro__detail">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z" />
              </svg>
              <span>No pressure — just do your best</span>
            </div>
            <div className="diagnostic-intro__detail">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span>Adapts teaching to your level</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setPhase('quiz')}
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  // Quiz phase
  if (!currentQ) return null;

  return (
    <div className="diagnostic-screen anim-fade-in">
      {/* Progress */}
      <div className="diagnostic-progress">
        <div className="diagnostic-progress__bar">
          <div
            className="diagnostic-progress__fill"
            style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        <span className="diagnostic-progress__text">
          Question {currentIdx + 1} of {totalQuestions}
        </span>
      </div>

      {/* Level indicator */}
      <div className="diagnostic-level-tag">
        <span className={`diagnostic-level-tag__badge diagnostic-level-tag__badge--${currentQ.diagnostic_level}`}>
          {currentQ.diagnostic_level}
        </span>
      </div>

      {/* Question */}
      <div className="diagnostic-question anim-fade-in" key={currentQ.id}>
        <p className="diagnostic-question__text">{currentQ.question_text}</p>

        <div className="diagnostic-question__options">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentQ.id] === opt;
            const letter = String.fromCharCode(65 + idx);
            return (
              <button
                key={opt}
                type="button"
                className={`mcq-option ${isSelected ? 'mcq-option--selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                <span className="mcq-option__letter">{letter}</span>
                <span className="mcq-option__text">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="diagnostic-nav">
        <button
          type="button"
          className="btn-ghost"
          onClick={handlePrev}
          disabled={currentIdx === 0}
        >
          Previous
        </button>

        {currentIdx < totalQuestions - 1 ? (
          <button
            type="button"
            className="btn-primary"
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmitAll}
            disabled={!allAnswered || loading}
          >
            {loading ? <span className="spinner spinner--sm" /> : null}
            {loading ? 'Analyzing...' : `Submit (${answeredCount}/${totalQuestions})`}
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="diagnostic-dots">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            className={`diagnostic-dot ${idx === currentIdx ? 'diagnostic-dot--active' : ''} ${answers[q.id] ? 'diagnostic-dot--answered' : ''}`}
            onClick={() => setCurrentIdx(idx)}
          />
        ))}
      </div>
    </div>
  );
}
