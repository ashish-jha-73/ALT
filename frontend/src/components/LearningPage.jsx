import { useMemo } from 'react';

const confidenceLevels = ['low', 'medium', 'high'];

export default function LearningPage({
  questionPayload,
  selectedAnswer,
  setSelectedAnswer,
  confidence,
  setConfidence,
  attemptsCount,
  setAttemptsCount,
  revealedHints,
  revealNextHint,
  onSubmit,
  loading,
}) {
  const question = questionPayload?.question;
  const context = questionPayload?.adaptive_context;

  const visibleHints = useMemo(() => {
    if (!question?.hints?.length) return [];
    return question.hints.slice(0, revealedHints);
  }, [question, revealedHints]);

  if (!question) {
    return (
      <section className="panel learning-panel">
        <h2>Learning</h2>
        <p>Loading adaptive question...</p>
      </section>
    );
  }

  return (
    <section className="panel learning-panel">
      <h2>Learning</h2>
      <div className="pill-row">
        <span className="pill">Concept: {question.concept}</span>
        <span className="pill">Difficulty: {question.difficulty}</span>
        <span className="pill">Expected: {question.time_expected}s</span>
      </div>

      <p className="question-text">{question.question_text}</p>

      <div className="options">
        {question.options.map((option) => (
          <label key={option} className="option-card">
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className="control-grid">
        <div>
          <p className="label">Confidence</p>
          <div className="button-group">
            {confidenceLevels.map((level) => (
              <button
                key={level}
                type="button"
                className={confidence === level ? 'btn active' : 'btn'}
                onClick={() => setConfidence(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label">Attempts Used Before Submit</p>
          <input
            type="number"
            min="1"
            max="5"
            value={attemptsCount}
            onChange={(e) => setAttemptsCount(Math.max(1, Number(e.target.value) || 1))}
            className="number-input"
          />
        </div>
      </div>

      <div className="hints-box">
        <p className="label">Hints (stepwise unlock)</p>
        {!visibleHints.length && <p className="subtext">No hint revealed yet.</p>}
        {visibleHints.map((hint, idx) => (
          <p key={hint}>{idx + 1}. {hint}</p>
        ))}
        <button
          type="button"
          className="btn secondary"
          onClick={revealNextHint}
          disabled={revealedHints >= (question.hints?.length || 0)}
        >
          Reveal Next Hint
        </button>
      </div>

      <div className="adaptive-note">
        <strong>Adaptive Guidance:</strong> {context?.guidance}
      </div>

      <button type="button" className="btn submit" onClick={onSubmit} disabled={loading || !selectedAnswer}>
        {loading ? 'Submitting...' : 'Submit Answer'}
      </button>
    </section>
  );
}
