// components/ImageUpload.tsx
import React, { useEffect, useState } from 'react';
import { extractSudokuGridFromImage } from '../lib/ocr';
import type { Cell } from '../types';
import './ImageUpload.css';

type Props = {
  onExtractGrid: (grid: Cell[][]) => void;
  resetTrigger: number;
};

const ImageUpload: React.FC<Props> = ({ onExtractGrid, resetTrigger }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setImage(null);
    setLoading(false);
    setFeedback(null);
  }, [resetTrigger]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setFeedback(null);

    try {
      const { grid, feedback } = await extractSudokuGridFromImage(file);
      setFeedback(feedback);
      onExtractGrid(grid);
    } catch (err) {
      alert('❌ Failed to extract grid.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <label className="custom-file-upload">
        📂 Choose Image
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {!image && (
        <div className="warning">
          <p>Please choose a good quality</p>
          <p>image with non bold font!</p>
        </div>
      )}

      {image && <img src={image} alt="Preview" className="image-preview" />}
      {loading && <p className="loading">🔍 Processing image...</p>}

      {!loading && feedback && (
        <div className="feedback">
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
