// components/SolverControls.tsx
import React from 'react';
import './Controls.css';
import { FaLightbulb, FaCheck, FaRedo } from 'react-icons/fa';

type Props = {
  onSolve: () => void;
  onHint: () => void;
  onReset: () => void;
};

const SolverControls: React.FC<Props> = ({ onSolve, onHint, onReset }) => (
  <div className="controls">
    <div className="control-item">
      <button className="control-btn check" onClick={onSolve}>
        <FaCheck size={24} />
      </button>
      <span>Solve</span>
    </div>
    <div className="control-item">
      <button className="control-btn hint" onClick={onHint}>
        <FaLightbulb size={24} />
      </button>
      <span>Hint</span>
    </div>
    <div className="control-item">
      <button className="control-btn new-game" onClick={onReset}>
        <FaRedo size={24} />
      </button>
      <span>Reset</span>
    </div>
  </div>
);

export default SolverControls;
