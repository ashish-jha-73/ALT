import MasteryBar from '../MasteryBar';

const conceptLabels = {
  expressions_foundation: 'Expressions',
  simplification_arena: 'Simplification',
  equation_dojo: 'Equations',
  word_problem_lab: 'Word Problems',
  multiplication_basic: 'Multiplication Basics',
  multiplication_expressions: 'Multiplication & Identities',
  equation_basics: "Equation Basics",
  equation_solving: "Solving Equations",
  advanced_equations: "Advanced Equations",
  word_problem_basic: "Word Problems",
  word_problem_advanced: "Advanced Word Problems"
};

function getDifficultyColor(level) {
  if (level >= 3) return 'var(--clr-error)';
  if (level >= 2) return 'var(--clr-warning)';
  return 'var(--clr-success)';
}

function getStatusIcon(status) {
  if (status === 'completed') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (status === 'locked') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }
  return (
    <span className="sidebar-nav__active-dot" />
  );
}

export default function Sidebar({
  userName,
  progress,
  conceptMap,
  attemptsInSession = 0,
  hintsUsedSession = 0,
  timeSpentSession = 0,
  currentScreen,
  onNavigateMap,
  onSaveProgress,
  savingProgress = false,
  loggingOut = false,
  onLogout,
}) {
  const nodes = conceptMap?.nodes || [];
  const knowledge = progress?.learner_model?.knowledge || {};
  const xp = progress?.progress?.xp || conceptMap?.xp || 0;
  const currentConcept = progress?.progress?.current_concept || '';
  const conceptLevels = progress?.progress?.concept_levels || {};

  const userLevel = Math.max(1, ...Object.values(conceptLevels).map(Number).filter(Boolean));

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="22" x2="12" y2="15.5" />
          <polyline points="22 8.5 12 15.5 2 8.5" />
        </svg>
        <div>
          <span className="sidebar__logo-title">TEAM GIFT</span>
          <span className="sidebar__logo-sub">Adaptive Tutor</span>
        </div>
      </div>

      {/* Student Info */}
      <div className="sidebar__student">
        <div className="sidebar__avatar">
          {(userName || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="sidebar__student-info">
          <span className="sidebar__student-name">{userName || 'Student'}</span>
          <span className="sidebar__student-level">Level {userLevel}</span>
        </div>
        <div className="sidebar__xp-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--clr-primary)" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{xp} XP</span>
        </div>
      </div>

      {/* Mastery Panel */}
      <div className="sidebar__section">
        <h3 className="sidebar__section-title">Concept Mastery</h3>
        <div className="sidebar__mastery-list">
          {Object.entries(knowledge).map(([concept, mastery]) => (
            <MasteryBar
              key={concept}
              label={conceptLabels[concept] || concept}
              value={mastery}
              max={1}
              size="sm"
            />
          ))}
          {Object.keys(knowledge).length === 0 && (
            <p className="sidebar__empty-text">No progress yet</p>
          )}
        </div>
      </div>

      {/* Concept Navigation */}
      <div className="sidebar__section">
        <h3 className="sidebar__section-title">Concepts</h3>
        <nav className="sidebar-nav">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`sidebar-nav__item ${node.status} ${node.id === currentConcept ? 'sidebar-nav__item--current' : ''}`}
            >
              <div className="sidebar-nav__icon">
                {getStatusIcon(node.status)}
              </div>
              <div className="sidebar-nav__content">
                <span className="sidebar-nav__label">{node.label}</span>
                <span className="sidebar-nav__meta">
                  Lvl {node.current_level}
                  <span className="sidebar-nav__diff-dots">
                    {[1, 2, 3].map((d) => (
                      <span
                        key={d}
                        className="sidebar-nav__diff-dot"
                        style={{
                          background: d <= (node.current_level || 1)
                            ? getDifficultyColor(node.current_level || 1)
                            : 'var(--clr-border-sidebar)',
                        }}
                      />
                    ))}
                  </span>
                </span>
              </div>
              <span className="sidebar-nav__mastery-mini">
                {Math.round((node.mastery || 0) * 100)}%
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Session Stats */}
      <div className="sidebar__section sidebar__section--stats">
        <h3 className="sidebar__section-title">Session Stats</h3>
        <div className="sidebar__stats-grid">
          <div className="sidebar__stat">
            <span className="sidebar__stat-value">{attemptsInSession}</span>
            <span className="sidebar__stat-label">Answered</span>
          </div>
          <div className="sidebar__stat">
            <span className="sidebar__stat-value">{hintsUsedSession}</span>
            <span className="sidebar__stat-label">Hints</span>
          </div>
          <div className="sidebar__stat">
            <span className="sidebar__stat-value">{Math.floor(timeSpentSession / 60)}m</span>
            <span className="sidebar__stat-label">Time</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sidebar__bottom">
        {currentScreen !== 'map' && (
          <button type="button" className="sidebar__nav-btn" onClick={onNavigateMap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Concept Map
          </button>
        )}
        {onSaveProgress && (
          <button
            type="button"
            className="sidebar__nav-btn"
            onClick={onSaveProgress}
            disabled={savingProgress}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {savingProgress ? 'Saving...' : 'Save Progress'}
          </button>
        )}
        <button
          type="button"
          className="sidebar__logout-btn"
          onClick={onLogout}
          disabled={loggingOut}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
