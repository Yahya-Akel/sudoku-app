// src/utils/utils.ts
export const generateRandomNumber = (min: number = 1, max: number = 9) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
