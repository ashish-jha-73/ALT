import { useState } from 'react';
import teachingContent from '../data/teachingContent.js';
import videoLinks from '../data/videoLinks.js';

function VisualBlock({ visual }) {
  if (!visual) return null;
  const icons = {
    box: '📦', coefficient: '🔢', constant: '🔒', like_terms: '🔗',
    combine: '➕', balance: '⚖️', solution: '🎯', check: '✅',
    variable: '❓', mono_mono: '✖️', distributive: '📤',
    translate: '📝', digit: '🔟', ratio: '📊',
  };
  return (
    <span className="teaching-visual-icon" title={visual}>
      {icons[visual] || '💡'}
    </span>
  );
}

function StepProgress({ current, total }) {
  return (
    <div className="teaching-step-progress">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`teaching-step-dot ${i < current ? 'teaching-step-dot--done' : ''} ${i === current ? 'teaching-step-dot--active' : ''}`}
        />
      ))}
    </div>
  );
}

export default function TeachingCard({ concept, learnerLevel, adaptiveHint, onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro, explanation, example, checkpoint
  const [currentStep, setCurrentStep] = useState(0);
  const [checkpointAnswer, setCheckpointAnswer] = useState('');

  const content = teachingContent[concept];
  if (!content) {
    return (
      <div className="teaching-card anim-fade-in">
        <p>No teaching content available for this concept.</p>
        <button type="button" className="btn-primary" onClick={onComplete}>
          Continue to Practice
        </button>
      </div>
    );
  }

  const level = Math.max(1, Math.min(4, learnerLevel || 1));
  const levelContent = content.levels[level];
  if (!levelContent) {
    return (
      <div className="teaching-card anim-fade-in">
        <p>Content being prepared for this level.</p>
        <button type="button" className="btn-primary" onClick={onComplete}>
          Continue to Practice
        </button>
      </div>
    );
  }

  const { intro, explanation, workedExample, analogy, checkpoint } = levelContent;
  const steps = explanation?.steps || [];
  const exampleSteps = workedExample?.steps || [];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase('example');
      setCurrentStep(0);
    }
  };

  const handleNextExampleStep = () => {
    if (currentStep < exampleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase('checkpoint');
    }
  };

  // Adaptive hint banner
  const renderAdaptiveHint = () => {
    if (!adaptiveHint) return null;
    const hints = {
      number_line: { text: "We've noticed sign errors. Let's use a number line to visualize.", icon: '📏' },
      slow_down: { text: 'Take your time with each step. Rushing leads to mistakes.', icon: '🐢' },
      simplify: { text: "Let's slow down and use simpler examples to build confidence.", icon: '🌱' },
    };
    const h = hints[adaptiveHint];
    if (!h) return null;
    return (
      <div className="teaching-adaptive-hint">
        <span>{h.icon}</span>
        <span>{h.text}</span>
      </div>
    );
  };

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <div className="teaching-card anim-fade-in">
        {renderAdaptiveHint()}

        {/* If not confident: show topic videos */}
        {videoLinks[concept] && (
          <div className="teaching-card__videos">
            <strong>If not confident — watch:</strong>
            <ul>
              {videoLinks[concept].map((v, i) => (
                <li key={i}><a href={v.url} target="_blank" rel="noopener noreferrer">{v.title}</a></li>
              ))}
            </ul>
          </div>
        )}

        <div className="teaching-card__header">
          <span className="teaching-card__badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Learn
          </span>
          <span className="pill pill--level">Level {level}</span>
          <span className="pill pill--concept">{content.title}</span>
        </div>

        <h2 className="teaching-card__title">{intro.headline}</h2>

        {intro.story && (
          <div className="teaching-card__story">
            <p>{intro.story}</p>
          </div>
        )}

        <div className="teaching-card__key-idea">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z" />
          </svg>
          <div>
            <strong>Key Idea</strong>
            <p>{intro.keyIdea}</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => { setPhase('explanation'); setCurrentStep(0); }}
        >
          Let's Learn This
        </button>
      </div>
    );
  }

  // EXPLANATION PHASE (step-by-step)
  if (phase === 'explanation') {
    const step = steps[currentStep];
    return (
      <div className="teaching-card anim-fade-in" key={`exp-${currentStep}`}>
        {videoLinks[concept] && (
          <div className="teaching-card__videos">
            <strong>If not confident — watch:</strong>
            <ul>
              {videoLinks[concept].map((v, i) => (
                <li key={i}><a href={v.url} target="_blank" rel="noopener noreferrer">{v.title}</a></li>
              ))}
            </ul>
          </div>
        )}

        <div className="teaching-card__header">
          <span className="teaching-card__badge teaching-card__badge--active">
            Explaining
          </span>
          <span className="pill pill--concept">{content.title}</span>
        </div>

        <StepProgress current={currentStep} total={steps.length} />

        <div className="teaching-explanation-card anim-fade-in" key={currentStep}>
          <div className="teaching-explanation-card__content">
            {step?.visual && <VisualBlock visual={step.visual} />}
            <p className="teaching-explanation-card__text">{step?.text}</p>
          </div>
        </div>

        {/* Analogy (show on last step) */}
        {analogy && currentStep === steps.length - 1 && (
          <div className="teaching-analogy">
            <strong>{analogy.type === 'real_world' ? 'Real-World Analogy' : 'Visual Analogy'}</strong>
            <p>{analogy.content}</p>
          </div>
        )}

        <div className="teaching-nav">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Back
          </button>
          <span className="teaching-nav__counter">{currentStep + 1} / {steps.length}</span>
          <button
            type="button"
            className="btn-primary"
            onClick={handleNextStep}
          >
            {currentStep < steps.length - 1 ? 'Next' : 'See Example'}
          </button>
        </div>
      </div>
    );
  }

  // WORKED EXAMPLE PHASE
  if (phase === 'example') {
    const exStep = exampleSteps[currentStep];
    return (
      <div className="teaching-card anim-fade-in" key={`ex-${currentStep}`}>
        {videoLinks[concept] && (
          <div className="teaching-card__videos">
            <strong>If not confident — watch:</strong>
            <ul>
              {videoLinks[concept].map((v, i) => (
                <li key={i}><a href={v.url} target="_blank" rel="noopener noreferrer">{v.title}</a></li>
              ))}
            </ul>
          </div>
        )}

        <div className="teaching-card__header">
          <span className="teaching-card__badge teaching-card__badge--example">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Worked Example
          </span>
        </div>

        <div className="teaching-example-problem">
          <strong>Problem:</strong> {workedExample?.problem}
        </div>

        <StepProgress current={currentStep} total={exampleSteps.length} />

        <div className="teaching-example-step anim-fade-in" key={currentStep}>
          <div className="teaching-example-step__main mono">
            {exStep?.step}
          </div>
          {exStep?.explanation && (
            <p className="teaching-example-step__explain">{exStep.explanation}</p>
          )}
        </div>

        {/* Show all previous steps faded */}
        {currentStep > 0 && (
          <div className="teaching-example-history">
            {exampleSteps.slice(0, currentStep).map((s, i) => (
              <div key={i} className="teaching-example-history__item mono">
                {s.step}
              </div>
            ))}
          </div>
        )}

        <div className="teaching-nav">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Back
          </button>
          <span className="teaching-nav__counter">{currentStep + 1} / {exampleSteps.length}</span>
          <button
            type="button"
            className="btn-primary"
            onClick={handleNextExampleStep}
          >
            {currentStep < exampleSteps.length - 1 ? 'Next Step' : 'Quick Check'}
          </button>
        </div>
      </div>
    );
  }

  // CHECKPOINT PHASE
  if (phase === 'checkpoint') {
    return (
      <div className="teaching-card anim-fade-in">
        {videoLinks[concept] && (
          <div className="teaching-card__videos">
            <strong>If not confident — watch:</strong>
            <ul>
              {videoLinks[concept].map((v, i) => (
                <li key={i}><a href={v.url} target="_blank" rel="noopener noreferrer">{v.title}</a></li>
              ))}
            </ul>
          </div>
        )}

        <div className="teaching-card__header">
          <span className="teaching-card__badge teaching-card__badge--checkpoint">
            Quick Check
          </span>
        </div>

        <div className="teaching-checkpoint">
          <p className="teaching-checkpoint__question">{checkpoint}</p>
          <input
            type="text"
            className="teaching-checkpoint__input"
            value={checkpointAnswer}
            onChange={(e) => setCheckpointAnswer(e.target.value)}
            placeholder="Type your answer..."
          />
        </div>

        <div className="teaching-nav">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => { setPhase('example'); setCurrentStep(exampleSteps.length - 1); }}
          >
            Review Example
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onComplete}
          >
            Ready for Practice
          </button>
        </div>
      </div>
    );
  }

  return null;
}
