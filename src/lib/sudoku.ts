import type { Difficulty, Grid } from "../types";
import { generateRandomNumber } from "../utils/utils";

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

// Check if a value is safe to place in a given cell
const isSafeToPlace = (grid: Grid, row: number, col: number, value: number): boolean => {
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

export { isSafeToPlace }; // shared logic

// Fill grid using backtracking
const fillGrid = (grid: Grid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value === 0) {
        const numbers = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        for (const num of numbers) {
          if (isSafeToPlace(grid, row, col, num)) {
            grid[row][col].value = num;
            grid[row][col].isFixed = true;

            if (fillGrid(grid)) return true;

            grid[row][col].value = 0;
            grid[row][col].isFixed = false;
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
  const puzzle = grid.map(row => row.map(cell => ({ ...cell })));

  while (count > 0) {
    const row = generateRandomNumber(0, 8);
    const col = generateRandomNumber(0, 8);

    if (puzzle[row][col].value !== 0) {
      puzzle[row][col].value = 0;
      puzzle[row][col].isFixed = false;
      count--;
    }
  }

  return puzzle;
};

// Generate puzzle based on difficulty
export const generateSudokuPuzzle = (difficulty: Difficulty) => {
  const fullGrid = generateSudoku();
  const solution = fullGrid.map(row => row.map(cell => ({ ...cell })));

  const numToRemove = difficulty === "hard" ? 50 : difficulty === "medium" ? 40 : 30;
  const puzzle = removeNumbers(fullGrid, numToRemove);

  return { grid: puzzle, solution };
};

// Mark conflict cells based on invalid entries
export const checkConflicts = (grid: Grid): Grid => {
  grid.forEach(row => row.forEach(cell => (cell.isConflict = false)));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col].value;
      if (!value) continue;

      for (let i = 0; i < 9; i++) {
        if (i !== col && grid[row][i].value === value) {
          grid[row][col].isConflict = true;
          grid[row][i].isConflict = true;
        }
        if (i !== row && grid[i][col].value === value) {
          grid[row][col].isConflict = true;
          grid[i][col].isConflict = true;
        }
      }

      const boxStartRow = Math.floor(row / 3) * 3;
      const boxStartCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = boxStartRow + i, c = boxStartCol + j;
          if ((r !== row || c !== col) && grid[r][c].value === value) {
            grid[row][col].isConflict = true;
            grid[r][c].isConflict = true;
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
