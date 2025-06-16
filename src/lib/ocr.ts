import Tesseract from 'tesseract.js';
import type { Cell } from '../types'; // ✅ Use your shared Cell type

// Detect bounding box of the Sudoku grid
const detectGridBoundingBox = (canvas: HTMLCanvasElement): { x: number, y: number, width: number, height: number } => {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let top = height, bottom = 0, left = width, right = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness < 200) {
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
};

// Preprocess image: crop to grid, resize, binarize
const preprocessImage = async (file: File): Promise<HTMLCanvasElement> => {
  const img = new Image();
  const url = URL.createObjectURL(file);

  return new Promise((resolve) => {
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;

      tempCtx.drawImage(img, 0, 0);

      const box = detectGridBoundingBox(tempCanvas);

      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d')!;
      croppedCanvas.width = 450;
      croppedCanvas.height = 450;
      croppedCtx.drawImage(
        tempCanvas,
        box.x, box.y, box.width, box.height,
        0, 0, 450, 450
      );

      const imageData = croppedCtx.getImageData(0, 0, 450, 450);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        const bin = avg > 160 ? 255 : 0;
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = bin;
      }

      croppedCtx.putImageData(imageData, 0, 0);
      resolve(croppedCanvas);
    };
    img.src = url;
  });
};

// Extract 9x9 Sudoku grid from image
export const extractSudokuGridFromImage = async (
  file: File
): Promise<{ grid: Cell[][]; feedback: string | null }> => {
  const canvas = await preprocessImage(file);
  const cellWidth = canvas.width / 9;
  const cellHeight = canvas.height / 9;

  const tasks: Promise<number>[][] = [];
  let unclearCount = 0;

  const recognizeCell = async (cellCanvas: HTMLCanvasElement): Promise<number> => {
    const tryOCR = async (padding: number, filter: string) => {
      const size = 50;
      const paddedCanvas = document.createElement('canvas');
      const paddedCtx = paddedCanvas.getContext('2d')!;
      paddedCanvas.width = size;
      paddedCanvas.height = size;

      paddedCtx.fillStyle = 'white';
      paddedCtx.fillRect(0, 0, size, size);
      paddedCtx.filter = filter;
      paddedCtx.drawImage(cellCanvas, padding, padding, size - 2 * padding, size - 2 * padding);

      const result = await Tesseract.recognize(paddedCanvas, 'eng', {
        // @ts-ignore
        config: {
          tessedit_char_whitelist: '123456789',
          tessedit_pageseg_mode: '10',
        }
      });

      const raw = result.data.text.trim().replace(/[^1-9]/g, '');
      const confidence = result.data.confidence ?? 0;
      const value = (confidence >= 10 && raw.length === 1) ? parseInt(raw, 10) : 0;

      return { value, confidence, raw };
    };

    let attempt = await tryOCR(8, 'contrast(200%) brightness(130%)');
    if (attempt.value === 0 && attempt.raw.length > 0) unclearCount++;

    if (attempt.value === 0) {
      attempt = await tryOCR(6, 'grayscale(100%) contrast(200%) brightness(120%)');
      if (attempt.value === 0 && attempt.raw.length > 0) unclearCount++;
    }

    return attempt.value;
  };

  for (let row = 0; row < 9; row++) {
    const rowTasks: Promise<number>[] = [];

    for (let col = 0; col < 9; col++) {
      const cellCanvas = document.createElement('canvas');
      const cellCtx = cellCanvas.getContext('2d')!;
      cellCanvas.width = cellWidth;
      cellCanvas.height = cellHeight;

      cellCtx.fillStyle = 'white';
      cellCtx.fillRect(0, 0, cellWidth, cellHeight);
      cellCtx.filter = 'contrast(200%) brightness(130%)';

      const margin = 2;

      cellCtx.drawImage(
        canvas,
        col * cellWidth + margin,
        row * cellHeight + margin,
        cellWidth - 2 * margin,
        cellHeight - 2 * margin,
        0,
        0,
        cellWidth,
        cellHeight
      );

      rowTasks.push(recognizeCell(cellCanvas));
    }

    tasks.push(rowTasks);
  }

  const resultValues = await Promise.all(tasks.map(row => Promise.all(row)));

  const grid: Cell[][] = resultValues.map((row, rowIndex) =>
    row.map((value, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value,
      fixed: value !== 0,
      notes: [],
      isConflict: false
    }))
  );

  const feedback = unclearCount >= 3
    ? '⚠️ Some digits were unreadable. Try a sharper image or avoid bold fonts.'
    : null;

  return { grid, feedback };
};
