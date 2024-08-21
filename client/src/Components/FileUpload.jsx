import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUpload.css";
import PendingOrders from "../Pages/PendingOrders/PendingOrders";
import ScreenCaptureComponent from "./ScreenCapture";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("Drag and drop files here");
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [captureUrl, setCaptureUrl] = useState(null);
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
    
    canvas.toBlob((blob) => {
      const file = new File([blob], "screenshot.png", { type: "image/png" });
      setFiles([file]);
      setCaptureUrl(URL.createObjectURL(file));
    }, 'image/png');
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


  const getApiBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    } else if (process.env.NODE_ENV === "production") {
      return process.env.REACT_APP_API_URL_PRODUCTION;
    }
    return process.env.REACT_APP_API_URL_LOCAL;
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFiles([file]);
      setCaptureUrl(null);
      setPrompt("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles([file]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!files.length) return;
    setError(null);
    const formData = new FormData();
    formData.append("image", files[0]);
    try {
      setLoading(true);
      const apiUrl = getApiBaseUrl();
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
      const parsedData = parseAnalysisToFormData(result.text);
      setFormData(parsedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const parseAnalysisToFormData = (analysisText) => {
    try {
      const data = JSON.parse(analysisText);
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

      Object.keys(formData).forEach((key) => {
        if (formData[key] === "") {
          formData[key] = "N/A";
        }
      });

      return formData;
    } catch (error) {
      return null;
    }
  };

  const thumbs = files.length > 0 ? files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={URL.createObjectURL(file)}
          style={img}
          alt={file.name}
          onLoad={() => URL.revokeObjectURL(file)}
        />
      </div>
    </div>
  )) : captureUrl ? (
    <div style={thumb}>
      <div style={thumbInner}>
        <img
          src={captureUrl}
          style={img}
          alt="Captured screenshot"
        />
      </div>
    </div>
  ) : null;

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  if (formData) {
    return <PendingOrders patientData={formData} />;
  }

  return (
    <>
      <header className="App-header"></header>
      <div className="upload-container">
        <div className="upload-header">
          <h2>Patient order upload</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button className="upload-button" onClick={handleCapture}>
            TAKE SCREENSHOT
          </button>
          <button className="upload-button" onClick={handleUpload}>
            UPLOAD
          </button>
        </div>
        <div {...getRootProps({ className: "dropzone" })}>
  <input {...getInputProps()} />
  <div className="dropzone-content">
    {files.length > 0 || captureUrl ? (
      <aside style={thumbsContainer}>{thumbs}</aside>
    ) : (
      <>
        <div className="dropzone-icon">
          <i className="fas fa-file-upload"></i>
        </div>
        {isDragActive ? <p>Drop the files here...</p> : <p>{prompt}</p>}
      </>
    )}
  </div>
  {loading && <div>Loading...</div>}
  {error && (
    <div style={{ color: "red", textAlign: "center" }}>
      <h2>Error:</h2>
      <p>{error}</p>
    </div>
  )}
</div>
      </div>
    </>
  );
};

export default FileUpload;
