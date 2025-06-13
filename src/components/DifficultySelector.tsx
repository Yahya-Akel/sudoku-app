import React from 'react';
import './DifficultySelector.css';
import type { Difficulty } from '../types';

type DifficultySelectorProps = {
  selected: Difficulty;
  onSelect: (level: Difficulty) => void;
};

const levels: Difficulty[] = ['easy', 'medium', 'hard'];

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
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
