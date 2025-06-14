import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBrain, FaLightbulb, FaCheck, FaRedo } from 'react-icons/fa';
import SudokuBoard from '../components/SudokuBoard';
import { generateEmptyGrid, checkConflicts } from '../lib/sudoku';
import { solveSudoku, provideHint } from '../lib/solver';
import type { Grid } from '../types';
import './PlayPage.css';

const SolverPage: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(generateEmptyGrid());
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleSolve = () => {
    const checkedGrid = checkConflicts(grid);
    const hasConflicts = checkedGrid.some(row => row.some(cell => cell.isConflict));

    if (hasConflicts) {
      alert("❌ Cannot solve. Please fix the conflicts first.");
      return;
    }

    const solved = solveSudoku(grid);
    if (solved) {
      setGrid(checkConflicts(solved));
    } else {
      alert("❌ This puzzle cannot be solved.");
    }
  };

  const handleHint = () => {
    const checkedGrid = checkConflicts(grid);
    const hasConflicts = checkedGrid.some(row => row.some(cell => cell.isConflict));

    if (hasConflicts) {
      alert("❌ Cannot provide hint. Please fix the conflicts first.");
      return;
    }

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const hintCell = provideHint(newGrid);
    if (hintCell) {
      setGrid(checkConflicts(newGrid));
    } else {
      alert("✅ All cells are filled. No hint needed.");
    }
  };

  const handleReset = () => {
    setGrid(generateEmptyGrid());
    setSelectedCell(null);
  };

  return (
    <div className="play-page">
      <header className="play-header">
        <div className="left-header">
          <div className="title">
            <FaBrain size={25} />
            <h1 className="site-title">Sudoku</h1>
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

      <h2 className="play-title">Sudoku Solver</h2>

      <div className="board-wrapper">
        <div className="board-section">
          <div className="controls-panel">
            <div className="controls">
              <div className="control-item">
                <button className="control-btn check" onClick={handleSolve}>
                  <FaCheck size={24} />
                </button>
                <span>Solve</span>
              </div>
              <div className="control-item">
                <button className="control-btn hint" onClick={handleHint}>
                  <FaLightbulb size={24} />
                </button>
                <span>Hint</span>
              </div>
              <div className="control-item">
                <button className="control-btn new-game" onClick={handleReset}>
                  <FaRedo size={24} />
                </button>
                <span>Reset</span>
              </div>
            </div>
          </div>

          <SudokuBoard
            grid={grid}
            setGrid={setGrid}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
          />
        </div>
      </div>
    </div>
  );
};

export default SolverPage;
