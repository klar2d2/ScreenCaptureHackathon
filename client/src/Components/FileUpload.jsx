// src/FileUpload.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const FileUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState('Drag and drop files here');
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const getApiBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    } else if (process.env.NODE_ENV === 'production') {
      return process.env.REACT_APP_API_URL_PRODUCTION;
    }
    return process.env.REACT_APP_API_URL_LOCAL;
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFiles([...acceptedFiles]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*'
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFiles([file]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!files.length) return;
    setError(null);
    setAnalysis(null);
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
        throw new Error(result.error || "An error occurred while uploading the image.");
      }
      setAnalysis(result.text);
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

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
    console.log("Updated form data:", newFormData);
  };

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={URL.createObjectURL(file)} style={img} alt={file.name} onLoad={() => URL.revokeObjectURL(file)} />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
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
        <button className="upload-button" onClick={handleUpload}>Upload</button>
      </div>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <div className="dropzone-icon">
            <i className="fas fa-file-upload"></i>
          </div>
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>{prompt}</p>
          )}
        </div>
        <aside style={thumbsContainer}>
          {thumbs}
        </aside>
        {error && (
          <div style={{ color: "red", textAlign: "center" }}>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
