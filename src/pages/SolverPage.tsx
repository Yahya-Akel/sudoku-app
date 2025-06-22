import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa';
import SudokuBoard from '../components/SudokuBoard';
import ImageUpload from '../components/ImageUpload';
import SolverControls from '../components/SolverControls';
import { generateEmptyGrid, checkConflicts } from '../lib/sudoku';
import { solveSudoku, provideHint } from '../lib/solver';
import { deepCloneGrid } from '../utils/utils';
import type { Grid } from '../types';
import './page.css';

const SolverPage: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(generateEmptyGrid());
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [solution, setSolution] = useState<Grid | null>(null);
  const [resetCounter, setResetCounter] = useState(0);

  const handleSolve = () => {
    const checkedGrid = checkConflicts(grid);
    const hasConflicts = checkedGrid.some(row => row.some(cell => cell.isConflict));

    if (hasConflicts) {
      alert("❌ Cannot solve. Please fix the conflicts first.");
      return;
    }

    const solved = solveSudoku(grid);
    if (solved) {
      setGrid(solved);
      setSolution(solved);
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

    let currentSolution = solution;

    if (!currentSolution) {
      currentSolution = solveSudoku(grid);
      if (!currentSolution) {
        alert("❌ No solution available. Cannot provide hint.");
        return;
      }
      setSolution(currentSolution);
    }

    const cloned = deepCloneGrid(grid);
    const hintCell = provideHint(cloned, currentSolution);
    if (hintCell) {
      setGrid(checkConflicts(cloned));
    } else {
      alert("✅ All cells are filled.");
    }
  };

  const handleReset = () => {
    setGrid(generateEmptyGrid());
    setSelectedCell(null);
    setSolution(null);
    setResetCounter(prev => prev + 1);
  };

  const handleImageGrid = (extracted: Grid) => {
    setGrid(extracted);
    setSelectedCell(null);
    setSolution(null);
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
      <h3 className="sub-title">Upload an image or enter game manually</h3>

      <ImageUpload onExtractGrid={handleImageGrid} resetTrigger={resetCounter} />

      <div className="board-wrapper">
        <div className="board-section">
          <div className="controls-panel">
            <SolverControls
              onSolve={handleSolve}
              onHint={handleHint}
              onReset={handleReset}
            />
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
