import React from 'react';
import './Controls.css';
import { FaCheckCircle, FaEraser, FaRedo } from 'react-icons/fa';

type ControlsProps = {
  onNewGame: () => void;
  onCheck: () => void;
  onErase: () => void;
};

const Controls: React.FC<ControlsProps> = ({ onNewGame, onCheck, onErase }) => {
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
        <button className="control-btn new-game" onClick={onNewGame}>
          <FaRedo size={28} />
        </button>
        <span>New Game</span>
      </div>
    </div>
  );
};

export default Controls;
