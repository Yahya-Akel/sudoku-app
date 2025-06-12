import React, { useState } from 'react';
import './SudokuBoard.css';

type Cell = {
  row: number;
  col: number;
  value: string;
};

const createEmptyGrid = (): Cell[][] => {
  return Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => ({
      row,
      col,
      value: '',
    }))
  );
};

const SudokuBoard: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());

  const handleCellChange = (row: number, col: number, newValue: string) => {
    if (/^[1-9]?$/.test(newValue)) {
      const newGrid = grid.map((r) =>
        r.map((cell) =>
          cell.row === row && cell.col === col
            ? { ...cell, value: newValue }
            : cell
        )
      );
      setGrid(newGrid);
    }
  };

  return (
    <div className="sudoku-board">
      {grid.map((row, rowIndex) => (
        <div className="sudoku-row" key={rowIndex}>
          {row.map((cell) => (
            <input
              key={`${cell.row}-${cell.col}`}
              className={`sudoku-cell ${cell.row % 3 === 2 && cell.row !== 8 ? 'border-bottom-bold' : ''}
                ${cell.col % 3 === 2 && cell.col !== 8 ? 'border-right-bold' : ''}`}
              type="text"
              maxLength={1}
              value={cell.value}
              onChange={(e) =>
                handleCellChange(cell.row, cell.col, e.target.value)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
