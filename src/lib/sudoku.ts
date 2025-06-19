import type { Difficulty, Grid, Cell } from "../types";
import { shuffleArray, deepCloneGrid } from "../utils/utils";

// Create an empty 9x9 grid
export const generateEmptyGrid = (): Grid =>
  Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => ({
      row,
      col,
      value: 0,
      isFixed: false,
      isConflict: false,
    }))
  );

// Shared logic: Check if value is safe to place
export const isSafeToPlace = (grid: Grid, row: number, col: number, value: number): boolean => {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i].value === value || grid[i][col].value === value) return false;
  }

  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxStartRow + i][boxStartCol + j].value === value) return false;
    }
  }

  return true;
};

// Fill grid using backtracking
const fillGrid = (grid: Grid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value === 0) {
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isSafeToPlace(grid, row, col, num)) {
            grid[row][col].value = num;
            if (fillGrid(grid)) return true;
            grid[row][col].value = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Generate a full valid board
export const generateSudoku = (): Grid => {
  const grid = generateEmptyGrid();
  fillGrid(grid);
  return grid;
};

// Remove cells from a filled grid to create a puzzle
const removeNumbers = (grid: Grid, count: number): Grid => {
  const puzzle = deepCloneGrid(grid).map(row =>
    row.map(cell => ({ ...cell, isFixed: true }))
  );

  const positions = shuffleArray([...Array(81).keys()]);

  for (let i = 0; i < count && i < positions.length; i++) {
    const pos = positions[i];
    const row = Math.floor(pos / 9);
    const col = pos % 9;
    puzzle[row][col].value = 0;
    puzzle[row][col].isFixed = false;
  }

  return puzzle;
};

// Generate puzzle and its solution
export const generateSudokuPuzzle = (difficulty: Difficulty) => {
  const solution = generateSudoku(); // full valid board
  const numToRemove = difficulty === "hard" ? 50 : difficulty === "medium" ? 40 : 30;
  const puzzle = removeNumbers(deepCloneGrid(solution), numToRemove); // clone before mutate

  return { grid: puzzle, solution };
};

// Check conflicts in the current grid
export const checkConflicts = (grid: Grid): Grid => {
  // Clear all previous conflicts
  grid.forEach(row => row.forEach(cell => (cell.isConflict = false)));

  const addConflict = (a: Cell, b: Cell) => {
    a.isConflict = true;
    b.isConflict = true;
  };

  // Check rows and columns
  for (let i = 0; i < 9; i++) {
    const rowSeen = new Map<number, Cell>();
    const colSeen = new Map<number, Cell>();

    for (let j = 0; j < 9; j++) {
      const rowVal = grid[i][j].value;
      if (rowVal !== 0) {
        if (rowSeen.has(rowVal)) addConflict(rowSeen.get(rowVal)!, grid[i][j]);
        else rowSeen.set(rowVal, grid[i][j]);
      }

      const colVal = grid[j][i].value;
      if (colVal !== 0) {
        if (colSeen.has(colVal)) addConflict(colSeen.get(colVal)!, grid[j][i]);
        else colSeen.set(colVal, grid[j][i]);
      }
    }
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const boxSeen = new Map<number, Cell>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = boxRow * 3 + i;
          const c = boxCol * 3 + j;
          const val = grid[r][c].value;
          if (val !== 0) {
            if (boxSeen.has(val)) addConflict(boxSeen.get(val)!, grid[r][c]);
            else boxSeen.set(val, grid[r][c]);
          }
        }
      }
    }
  }

  return grid;
};

// Validate a complete board
export const isValidSudoku = (grid: Grid): boolean => {
  for (let i = 0; i < 9; i++) {
    const rowSet = new Set<number>();
    const colSet = new Set<number>();
    const boxSet = new Set<number>();

    for (let j = 0; j < 9; j++) {
      const rowVal = grid[i][j].value;
      const colVal = grid[j][i].value;
      const boxRow = 3 * Math.floor(i / 3) + Math.floor(j / 3);
      const boxCol = 3 * (i % 3) + (j % 3);
      const boxVal = grid[boxRow][boxCol].value;

      if (!rowVal || !colVal || !boxVal) return false;
      if (rowSet.has(rowVal) || colSet.has(colVal) || boxSet.has(boxVal)) return false;

      rowSet.add(rowVal);
      colSet.add(colVal);
      boxSet.add(boxVal);
    }
  }
  return true;
};
