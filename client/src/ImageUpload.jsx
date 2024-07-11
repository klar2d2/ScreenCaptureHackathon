import React, { useRef, useState, useEffect } from "react";
import FormDisplay from "./FormDisplay"; // Make sure to create this file in the same directory

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('REACT_APP_API_URL_LOCAL:', process.env.REACT_APP_API_URL_LOCAL);
    console.log('REACT_APP_API_URL_PRODUCTION:', process.env.REACT_APP_API_URL_PRODUCTION);
    console.log('vercel', process.env.VERCEL_URL)
  }, []);

  const getApiBaseUrl = () => {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    else if (process.env.NODE_ENV === 'production') {
      return process.env.REACT_APP_API_URL_PRODUCTION
    }
    return process.env.REACT_APP_API_URL_LOCAL;
  };

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
    setFormData(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      setLoading(true);
      const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL_PRODUCTION
      : process.env.REACT_APP_API_URL_LOCAL;
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || "An error occurred while uploading the image."
        );
      }
      console.log(result.text);
      setAnalysis(result.text);

      // Parse the analysis text to extract form data
      const parsedData = parseAnalysisToFormData(result.text);
      setFormData(parsedData);

      console.log(parsedData);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const parseAnalysisToFormData = (analysisText) => {
    try {
      // Parse the JSON string into an object
      const data = JSON.parse(analysisText);

      console.log(data, "data");

      // Create a flattened object structure for the form
      const formData = {
        name: data.name,
        address: data.address,
        underlyingConditionRight: data.right.underlyingCondition,
        underlyingConditionLeft: data.left.underlyingCondition,
        supplierRight: data.right.supplier,
        supplierLeft: data.left.supplier,
        manufacturerRight: data.right.manufacturer,
        manufacturerLeft: data.left.manufacturer,
        styleRight: data.right.style,
        styleLeft: data.left.style,
        sphereRight: data.right.sphere,
        sphereLeft: data.left.sphere,
        cylinderRight: data.right.cylinder,
        cylinderLeft: data.left.cylinder,
        axisRight: data.right.axis,
        axisLeft: data.left.axis,
        addRight: data.right.add,
        addLeft: data.left.add,
        baseCurveRight: data.right.baseCurve,
        baseCurveLeft: data.left.baseCurve,
        diameterRight: data.right.diameter,
        diameterLeft: data.left.diameter,
        colorRight: data.right.color,
        colorLeft: data.left.color,
        quantityRight: data.right.quantity,
        quantityLeft: data.left.quantity,
      };

      // Replace empty strings with 'N/A'
      Object.keys(formData).forEach((key) => {
        if (formData[key] === "") {
          formData[key] = "N/A";
        }
      });

      return formData;
    } catch (error) {
      console.error("Error parsing analysis data:", error);
      return null;
    }
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
      {formData && <FormDisplay data={formData} />}
    </div>
  );
};

export default ImageUpload;
