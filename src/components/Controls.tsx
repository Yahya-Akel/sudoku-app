import React from 'react';
import './Controls.css';
import { FaCheckCircle, FaEraser, FaRedo, FaLightbulb } from 'react-icons/fa';

type ControlsProps = {
  onNewGame: () => void;
  onCheck: () => void;
  onErase: () => void;
  onHint: () => void;
};

const Controls: React.FC<ControlsProps> = ({ onNewGame, onCheck, onErase, onHint }) => {
  return (
    <div className="controls">
      <div className="control-item">
        <button className="control-btn check" onClick={onCheck}>
          <FaCheckCircle size={28} />
        </button>
        <span>Check</span>
      </div>
      <div className="control-item">
        <button className="control-btn erase" onClick={onErase}>
          <FaEraser size={28} />
        </button>
        <span>Erase</span>
      </div>
      <div className="control-item">
        <button className="control-btn hint" onClick={onHint}>
          <FaLightbulb size={28} />
        </button>
        <span>Hint</span>
      </div>
      <div className="control-item">
        <button className="control-btn new-game" onClick={onNewGame}>
          <FaRedo size={28} />
        </button>
        <span>New Game</span>
      </div>
    </div>
  );
};

export default Controls;
