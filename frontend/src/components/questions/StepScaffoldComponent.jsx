import { useState } from 'react';

export default function StepScaffoldComponent({ steps = [], onComplete, disabled }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const allDone = currentStep >= steps.length;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentStep]: value });
  };

  const handleReveal = () => {
    setRevealed({ ...revealed, [currentStep]: true });
  };

  const handleNext = () => {
    if (isLast) {
      if (onComplete) onComplete(answers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  if (allDone || !step) {
    return (
      <div className="step-scaffold">
        <div className="step-scaffold__complete">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p>All steps completed!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="step-scaffold">
      <div className="step-scaffold__progress">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`step-scaffold__dot ${idx < currentStep ? 'step-scaffold__dot--done' : ''} ${idx === currentStep ? 'step-scaffold__dot--active' : ''}`}
          />
        ))}
      </div>

      <div className="step-scaffold__card anim-fade-in" key={currentStep}>
        <span className="step-scaffold__step-label">Step {currentStep + 1} of {steps.length}</span>
        <p className="step-scaffold__instruction">{step.instruction || step}</p>

        {step.input && (
          <input
            type="text"
            className="step-scaffold__input"
            placeholder="Your answer..."
            value={answers[currentStep] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            disabled={disabled}
          />
        )}

        {step.hint && !revealed[currentStep] && (
          <button type="button" className="step-scaffold__hint-btn" onClick={handleReveal}>
            Show hint
          </button>
        )}

        {step.hint && revealed[currentStep] && (
          <div className="step-scaffold__hint anim-fade-in">
            {step.hint}
          </div>
        )}
      </div>

      <button
        type="button"
        className="step-scaffold__next-btn"
        onClick={handleNext}
        disabled={disabled}
      >
        {isLast ? 'Complete' : 'Next Step'}
      </button>
    </div>
  );
}
