// PlayPage.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SudokuBoard from '../components/SudokuBoard';
import DifficultySelector from '../components/DifficultySelector';
import Controls from '../components/Controls';
import './PlayPage.css';
import { FaBrain } from 'react-icons/fa';

const PlayPage: React.FC = () => {
  const [difficulty, setDifficulty] = useState('Easy');

  return (
    <div className="play-page">
      <header className="play-header">
        <div className="left-header">
          <div className="title">
            <FaBrain size={25}/>
            <h1 className='site-title'>Sudoku</h1>
          </div>
          <nav className="page-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Play
            </NavLink>
            <NavLink to="/solver" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Solver
            </NavLink>
          </nav>
        </div>
      </header>

      <h2 className="play-title">Play Sudoku</h2>

      <div className="board-wrapper">
        <div className="difficulty-container">
          <DifficultySelector selected={difficulty} onSelect={setDifficulty} />
        </div>

        <div className="board-section">
          <div className="controls-panel">
            <Controls />
          </div>
          <SudokuBoard difficulty={difficulty} />
        </div>
      </div>
    </div>
  );
};

export default PlayPage;
