import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

type Props = {
  onRecognize: (text: string) => void;
};

const ImageUpload: React.FC<Props> = ({ onRecognize }) => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setLoading(true);

      Tesseract.recognize(file, 'eng', { logger: m => console.log(m) })
        .then(({ data: { text } }) => {
          setLoading(false);
          onRecognize(text);
        })
        .catch((err) => {
          setLoading(false);
          alert('❌ OCR failed. Try a clearer image.');
        });
    }
  };

  return (
    <div className="image-upload">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {loading && <p>Processing image...</p>}
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded" width="300" />}
    </div>
  );
};

export default ImageUpload;
