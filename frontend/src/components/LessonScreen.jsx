export default function LessonScreen({ payload, onComplete, loading }) {
  const lesson = payload?.lesson;

  if (!lesson) {
    return (
      <div className="lesson-screen">
        <div className="lesson-screen__loading">
          <div className="spinner" />
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-screen anim-fade-in">
      {/* Concept Header */}
      <div className="lesson-screen__header">
        <div className="lesson-screen__badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Teach Mode</span>
        </div>
        <div className="lesson-screen__meta-pills">
          <span className="pill pill--level">Level {lesson.level}</span>
          <span className="pill pill--concept">{(lesson.concept || '').replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Teaching Card */}
      <div className="lesson-screen__teaching-card">
        <h2 className="lesson-screen__title">{lesson.title}</h2>
        <p className="lesson-screen__objective">
          <strong>Objective:</strong> {lesson.objective}
        </p>

        <div className="lesson-screen__steps">
          <h3 className="lesson-screen__steps-title">Key Concepts</h3>
          <ol className="lesson-screen__steps-list">
            {lesson.steps?.map((step, idx) => (
              <li key={idx} className="lesson-screen__step anim-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <span className="lesson-screen__step-number">{idx + 1}</span>
                <span className="lesson-screen__step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Worked Example */}
        <div className="lesson-screen__example">
          <div className="lesson-screen__example-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>Worked Example</span>
          </div>
          <div className="lesson-screen__example-content mono">
            {lesson.worked_example}
          </div>
        </div>

        {/* Checkpoint */}
        <div className="lesson-screen__checkpoint">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z" />
          </svg>
          <div>
            <strong>Quick Check:</strong>
            <p>{lesson.checkpoint}</p>
          </div>
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        className="btn-primary"
        disabled={loading}
        onClick={() => onComplete(lesson.key)}
      >
        {loading ? <span className="spinner spinner--sm" /> : null}
        {loading ? 'Unlocking Challenge...' : "I've Got It — Start Challenge"}
      </button>
    </div>
  );
}
