import Tesseract from 'tesseract.js';
import type { Cell } from '../types';

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

  return { x: left, y: top, width: right - left, height: bottom - top };
};

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

      croppedCtx.filter = 'blur(0.6px) contrast(250%) brightness(160%)';
      croppedCtx.drawImage(tempCanvas, box.x, box.y, box.width, box.height, 0, 0, 450, 450);

      resolve(croppedCanvas);
    };
    img.src = url;
  });
};

export const extractSudokuGridFromImage = async (
  file: File
): Promise<{ grid: Cell[][]; feedback: string | null }> => {
  const canvas = await preprocessImage(file);
  const cellWidth = canvas.width / 9;
  const cellHeight = canvas.height / 9;

  const tasks: Promise<number>[][] = [];
  let unclearCount = 0;

  const recognizeCell = async (
    _row: number,
    _col: number,
    fullCellCanvas: HTMLCanvasElement
  ): Promise<number> => {
    const extractCenterCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
      const size = canvas.width;
      const cropRatio = 0.8;
      const offset = (1 - cropRatio) / 2 * size;

      const cropped = document.createElement('canvas');
      cropped.width = size;
      cropped.height = size;
      const ctx = cropped.getContext('2d')!;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(
        canvas,
        offset, offset, size * cropRatio, size * cropRatio,
        0, 0, size, size
      );
      return cropped;
    };

    const tryOCR = async (
      canvas: HTMLCanvasElement,
      padding: number,
      filter: string,
      minConf: number
    ) => {
      const size = 50;
      const paddedCanvas = document.createElement('canvas');
      const paddedCtx = paddedCanvas.getContext('2d')!;
      paddedCanvas.width = size;
      paddedCanvas.height = size;

      paddedCtx.fillStyle = 'white';
      paddedCtx.fillRect(0, 0, size, size);
      paddedCtx.filter = filter;
      paddedCtx.drawImage(canvas, padding, padding, size - 2 * padding, size - 2 * padding);

      const result = await Tesseract.recognize(paddedCanvas, 'eng', {
        //@ts-ignore
        config: {
          tessedit_char_whitelist: '123456789',
          tessedit_pageseg_mode: '10',
        },
      });

      const raw = result.data.text.trim().replace(/[^1-9]/g, '');
      const confidence = result.data.confidence ?? 0;
      const value = (raw.length === 1 && confidence >= minConf) ? parseInt(raw, 10) : 0;

      return { value, raw, confidence };
    };

    const centeredCanvas = extractCenterCanvas(fullCellCanvas);

    let result = await tryOCR(centeredCanvas, 7, 'contrast(220%) brightness(150%) saturate(120%)', 35);
    if (result.value !== 0) return result.value;
    if (result.raw.length > 0) unclearCount++;

    result = await tryOCR(centeredCanvas, 7, 'contrast(230%) brightness(160%) saturate(120%) drop-shadow(0 0 1px black)', 30);
    if (result.value !== 0) return result.value;
    if (result.raw.length > 0) unclearCount++;

    result = await tryOCR(centeredCanvas, 6, 'grayscale(100%) contrast(220%) brightness(130%)', 20);
    if (result.value !== 0) return result.value;
    if (result.raw.length > 0) unclearCount++;

    result = await tryOCR(centeredCanvas, 5, 'contrast(200%) brightness(180%)', 1);
    if (result.raw.length === 1 && /^[1-9]$/.test(result.raw)) {
      return parseInt(result.raw);
    }

    const thickenedCanvas = document.createElement('canvas');
    thickenedCanvas.width = centeredCanvas.width;
    thickenedCanvas.height = centeredCanvas.height;
    const thickCtx = thickenedCanvas.getContext('2d')!;
    thickCtx.filter = 'contrast(300%) brightness(170%)';
    thickCtx.drawImage(centeredCanvas, 0, 0);
    thickCtx.drawImage(centeredCanvas, -1, 0);
    thickCtx.drawImage(centeredCanvas, 1, 0);
    thickCtx.drawImage(centeredCanvas, 0, -1);
    thickCtx.drawImage(centeredCanvas, 0, 1);

    result = await tryOCR(thickenedCanvas, 5, 'none', 1);
    if (result.raw.length === 1 && /^[1-9]$/.test(result.raw)) {
      return parseInt(result.raw);
    }

    return 0;
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
      cellCtx.filter = 'contrast(220%) brightness(130%)';

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

      rowTasks.push(recognizeCell(row, col, cellCanvas));
    }

    tasks.push(rowTasks);
  }

  const resultValues = await Promise.all(tasks.map((row) => Promise.all(row)));

  const grid: Cell[][] = resultValues.map((row, rowIndex) =>
    row.map((value, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value,
      isFixed: false,
      isConflict: false,
    }))
  );

  const feedback =
    unclearCount > 0
      ? 'Some digits could not be recognized. Please upload a clearer image with clean colors and non-bold fonts, or enter the puzzle manually.'
      : null;

  return { grid, feedback };
};
