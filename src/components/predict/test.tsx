import React, { useState } from 'react';
import './index.css';

const Predict = () => {
  const [imageSrc, setImageSrc] = useState('');

  const handleImageUpload = (e: any) => {
    const file = e.target.files ? e.target.files[0] : null;
    const reader = new FileReader();

    reader.onloadend = () => {
      // Chỉ cập nhật state nếu kết quả là một chuỗi
      if (typeof reader.result === 'string') {
        setImageSrc(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Uploaded"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      )}
      <input type="file" onChange={handleImageUpload} />
    </div>
  );
};
export default Predict;
