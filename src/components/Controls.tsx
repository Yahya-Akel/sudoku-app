import React from 'react';
import './Controls.css';
import { FaCheckCircle, FaEraser, FaLightbulb } from 'react-icons/fa';

const Controls: React.FC = () => {
  return (
    <div className="controls">
      <div className="control-item">
        <button className="control-btn check">
          <FaCheckCircle size={28} />
        </button>
        <span>Check</span>
      </div>
      <div className="control-item">
        <button className="control-btn erase">
          <FaEraser size={28} />
        </button>
        <span>Erase</span>
      </div>
      <div className="control-item">
        <button className="control-btn hint">
          <FaLightbulb size={28} />
        </button>
        <span>Hint</span>
      </div>
    </div>
  );
};

export default Controls;
