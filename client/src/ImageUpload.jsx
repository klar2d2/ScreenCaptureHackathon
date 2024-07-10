import React, { useState } from "react";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;
    setError(null);
    setAnalysis(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || "An error occurred while uploading the image."
        );
      }
      setResponse(result.text)
      setAnalysis(result.text);
      console.log(result);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setError(error.message);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    // Split the analysis text into lines
    const lines = analysis.split(/\d+\./).filter((line) => line.trim() !== "");

    return (
      <div style={{ fontSize: "0.7em", textAlign: "left" }}>
        {lines.map((line, index) => (
          <p key={index} style={{ margin: "5px 0" }}>
            <strong>{index + 1}.</strong> {line.trim()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Image Upload Component</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: "300px", height: "300px", objectFit: "cover" }}
          />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
      {analysis && (
        <div>
          <h2>Analysis:</h2>
          {renderAnalysis()}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
