import type { Grid, Cell } from "../types";

// Checks if a value is safe to place
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

// Solves the board via backtracking
export const solveSudoku = (grid: Grid): Grid | null => {
  const copy = grid.map(row => row.map(cell => ({ ...cell })));

  const solve = (): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (copy[row][col].value === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafeToPlace(copy, row, col, num)) {
              copy[row][col].value = num;
              if (solve()) return true;
              copy[row][col].value = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  return solve() ? copy : null;
};

// Provide a single correct hint using the solver result
export const provideHint = (grid: Grid): Cell | null => {
  const solved = solveSudoku(grid);
  if (!solved) return null;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value === 0) {
        grid[row][col].value = solved[row][col].value;
        return grid[row][col];
      }
    }
  }
  return null;
};
