import React, { useRef, useState } from "react";
import FormDisplay from "./FormDisplay";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [captureUrl, setCaptureUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const captureScreenshot = (video = null) => {
    const canvas = document.createElement('canvas');
    const source = video || videoRef.current;
    
    if (!source) {
      setError('No video source available for screenshot.');
      return;
    }

    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
    canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL();
    setCaptureUrl(url);
  };

  const handleCapture = async () => {
    if (isSharing) {
      captureScreenshot();
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const video = document.createElement('video');
        
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          captureScreenshot(video);
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (err) {
        setError('Failed to capture screen. Please make sure you have granted the necessary permissions.');
        console.error('Error capturing screen:', err);
      }
    }
  };

  const handleShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsSharing(true);
    } catch (err) {
      setError('Failed to start screen sharing. Please make sure you have granted the necessary permissions.');
      console.error('Error starting screen share:', err);
    }
  };

  const handleStopSharing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsSharing(false);
      setCaptureUrl(null);
    }
  };

  const getApiBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
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
    console.log(file)
    if (!file) return;
    setError(null);
    setAnalysis(null);
    setFormData(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      setLoading(true);
      const apiUrl = getApiBaseUrl()
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

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
    // You can perform additional actions here, like saving to a database
    console.log("Updated form data:", newFormData);
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
          <button 
          variant="contained" 
          onClick={handleCapture} 
          startIcon={<CameraAltIcon />}
        >
          Take Screenshot
        </button>
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
      {formData && (
        <FormDisplay data={formData} onDataChange={handleFormDataChange} />
      )}
    </div>
  );
};

export default ImageUpload;
