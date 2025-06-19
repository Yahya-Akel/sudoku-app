import type { Grid, Cell } from "../types";
import { isSafeToPlace } from "./sudoku";

// Solves the board and returns the solution grid (null if unsolvable)
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

// Uses a precomputed solution to provide a hint
export const provideHint = (
  current: Grid,
  solution: Grid
): Cell | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (current[row][col].value === 0) {
        current[row][col].value = solution[row][col].value;
        return current[row][col];
      }
    }
  }
  return null;
};
