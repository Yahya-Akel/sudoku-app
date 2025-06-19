// Random number between min and max (inclusive)
export const generateRandomNumber = (min: number = 1, max: number = 9): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Fisher-Yates Shuffle for any array
export const shuffleArray = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = generateRandomNumber(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Deep clone a 9x9 Sudoku grid
import type { Grid } from '../types';
export const deepCloneGrid = (grid: Grid): Grid =>
  grid.map(row => row.map(cell => ({ ...cell })));
