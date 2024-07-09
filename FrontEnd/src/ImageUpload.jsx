import React, { useState } from 'react';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    // Implement your upload logic here
    console.log("Image uploaded:", selectedImage);
  };

  return (
    <div>
      <h1>Image Upload Component</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <img src={selectedImage} alt="Selected" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;