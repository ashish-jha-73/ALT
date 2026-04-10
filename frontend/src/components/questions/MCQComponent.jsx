export default function MCQComponent({ options = [], selectedAnswer, onSelect, disabled }) {
  return (
    <div className="mcq-options">
      {options.map((option, idx) => {
        const isSelected = selectedAnswer === option;
        const letter = String.fromCharCode(65 + idx);

        return (
          <button
            key={option}
            type="button"
            className={`mcq-option ${isSelected ? 'mcq-option--selected' : ''}`}
            onClick={() => onSelect(option)}
            disabled={disabled}
          >
            <span className="mcq-option__letter">{letter}</span>
            <span className="mcq-option__text">{option}</span>
            {isSelected && (
              <svg className="mcq-option__check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
