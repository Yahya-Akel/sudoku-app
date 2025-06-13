import React from 'react';
import './SudokuBoard.css';
import type { Cell, Grid } from '../types';
import { checkConflicts } from '../lib/sudoku';

type SudokuBoardProps = {
  grid: Grid;
  setGrid: React.Dispatch<React.SetStateAction<Grid>>;
  selectedCell: { row: number; col: number } | null;
  setSelectedCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
};

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  grid,
  setGrid,
  selectedCell,
  setSelectedCell,
}) => {
  const handleCellChange = (row: number, col: number, newValue: string) => {
    if (/^[1-9]?$/.test(newValue)) {
      const numericValue = newValue === '' ? 0 : parseInt(newValue, 10);
      const updatedGrid = grid.map((r) =>
        r.map((cell) =>
          cell.row === row && cell.col === col && !cell.isFixed
            ? { ...cell, value: numericValue }
            : cell
        )
      );
      const checked = checkConflicts(updatedGrid);
      setGrid(checked);
    }
  };

  const isRelated = (cell: Cell): boolean => {
    if (!selectedCell) return false;
    const inSameRow = cell.row === selectedCell.row;
    const inSameCol = cell.col === selectedCell.col;
    const inSameBox =
      Math.floor(cell.row / 3) === Math.floor(selectedCell.row / 3) &&
      Math.floor(cell.col / 3) === Math.floor(selectedCell.col / 3);
    return inSameRow || inSameCol || inSameBox;
  };

  return (
    <div className="sudoku-board">
      {grid.map((row) => (
        <div className="sudoku-row" key={row[0].row}>
          {row.map((cell) => (
            <input
              key={`${cell.row}-${cell.col}`}
              className={`sudoku-cell 
                ${cell.isFixed ? 'fixed' : ''}
                ${selectedCell?.row === cell.row && selectedCell?.col === cell.col ? 'selected' : ''}
                ${isRelated(cell) && !(selectedCell?.row === cell.row && selectedCell?.col === cell.col) ? 'related' : ''}
                ${cell.isConflict ? 'conflict' : ''}`}
              type="text"
              maxLength={1}
              value={cell.value === 0 ? '' : cell.value.toString()}
              readOnly={cell.isFixed}
              onChange={(e) => handleCellChange(cell.row, cell.col, e.target.value)}
              onClick={() => setSelectedCell({ row: cell.row, col: cell.col })}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
