import React, { useRef, useState } from "react";
const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
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
      setLoading(true);
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setLoading(false);
        throw new Error(
          result.error || "An error occurred while uploading the image."
        );
      }
      setLoading(false);
      setAnalysis(result.text);
      console.log(result);
    } catch (error) {
      setLoading(false);
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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Image Scanner</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        style={{
          margin: "10px 0",
          padding: "10px 20px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Browse Image
      </button>
      {selectedImage && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={selectedImage}
            alt="Selected"
            style={{
              width: "300px",
              height: "300px",
              objectFit: "cover",
              margin: "10px 0",
            }}
          />
          {!loading ? (
            <button
              onClick={handleUpload}
              style={{
                margin: "10px 0",
                padding: "10px 20px",
                background: "#008CBA",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Upload
            </button>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
      {error && (
        <div style={{ color: "red", textAlign: "center" }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
      {analysis && (
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <h2>Analysis:</h2>
          {renderAnalysis()}
        </div>
      )}
    </div>
  );
};
export default ImageUpload;
