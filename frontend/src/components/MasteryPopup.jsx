import { useEffect } from 'react';

export default function MasteryPopup({ conceptName, show, onClose }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="mastery-popup-overlay" onClick={onClose}>
      <div className="mastery-popup anim-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="mastery-popup__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h2 className="mastery-popup__title">Concept Mastered!</h2>
        <p className="mastery-popup__concept">{conceptName}</p>
        <p className="mastery-popup__subtitle">Strong mastery and practice achieved. The next concept is now unlocked.</p>
        <button type="button" className="mastery-popup__btn" onClick={onClose}>
          Continue Learning
        </button>
      </div>
    </div>
  );
}
