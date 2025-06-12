// DifficultySelector.tsx
import React from 'react';
import './DifficultySelector.css';

type DifficultySelectorProps = {
  selected: string;
  onSelect: (level: string) => void;
};

const levels = ['easy', 'medium', 'hard'];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="difficulty-wrapper">
      <span className="label">Difficulty: </span>
      <div className="difficulty-selector">
        {levels.map((level) => (
          <button
            key={level}
            className={`difficulty-btn ${selected === level ? 'selected' : ''}`}
            onClick={() => onSelect(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
