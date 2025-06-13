import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import SudokuBoard from '../components/SudokuBoard';
import DifficultySelector from '../components/DifficultySelector';
import Controls from '../components/Controls';
import './PlayPage.css';
import { FaBrain } from 'react-icons/fa';
import type { Grid, Difficulty } from '../types';
import {
  generateSudokuPuzzle,
  checkConflicts,
  isValidSudoku
} from '../lib/sudoku';

const PlayPage: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [grid, setGrid] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const createNewPuzzle = () => {
    const { grid: newGrid } = generateSudokuPuzzle(difficulty);
    setGrid(newGrid);
    setSelectedCell(null);
  };

  useEffect(() => {
    createNewPuzzle();
  }, [difficulty]);

  const handleCheck = () => {
    const checkedGrid = checkConflicts(grid);
    setGrid(checkedGrid);

    const isValid = isValidSudoku(checkedGrid);
    alert(isValid
      ? '✅ Congratulations! Sudoku board is correctly solved.'
      : '❌ The board has conflicts or is incomplete.');
  };

  const handleErase = () => {
    const erasedGrid = grid.map(row =>
      row.map(cell =>
        cell.isFixed ? { ...cell, isConflict: false } : { ...cell, value: 0, isConflict: false }
      )
    );
    setGrid(erasedGrid);
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

      <h2 className="play-title">Play Sudoku</h2>

      <div className="board-wrapper">
        <div className="difficulty-container">
          <DifficultySelector selected={difficulty} onSelect={setDifficulty} />
        </div>

        <div className="board-section">
          <div className="controls-panel">
            <Controls
              onNewGame={createNewPuzzle}
              onCheck={handleCheck}
              onErase={handleErase}
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

export default PlayPage;
