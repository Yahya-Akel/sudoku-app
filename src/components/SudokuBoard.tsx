import React, { useEffect, useRef } from 'react';
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
  const cellRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        newRow = (row + 8) % 9;
        break;
      case 'ArrowDown':
        newRow = (row + 1) % 9;
        break;
      case 'ArrowLeft':
        newCol = (col + 8) % 9;
        break;
      case 'ArrowRight':
        newCol = (col + 1) % 9;
        break;
      default:
        return;
    }

    setSelectedCell({ row: newRow, col: newCol });

    // Delay focus until state updates
    setTimeout(() => {
      const input = cellRefs.current[newRow][newCol];
      if (input && !input.readOnly) input.focus();
    }, 0);

    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="sudoku-board">
      {grid.map((row, rowIndex) => (
        <div className="sudoku-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <input
              key={`${cell.row}-${cell.col}`}
              ref={(el) => {
                cellRefs.current[rowIndex][colIndex] = el;
              }}
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
              onClick={() => {
                setSelectedCell({ row: cell.row, col: cell.col });
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
