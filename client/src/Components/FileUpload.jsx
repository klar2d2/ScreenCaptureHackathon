// src/UploadComponent.js
import React, { useState, useEffect } from 'react';
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
    const [files, setFiles] = useState([]);
    const [prompt, setPrompt] = useState('Drag and drop files here')
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        console.log('formData', formData)
    }, [formData])

    const getApiBaseUrl = () => {
        if (process.env.NEXT_PUBLIC_VERCEL_URL) {
          return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
        }
        else if (process.env.NODE_ENV === 'production') {
          return process.env.REACT_APP_API_URL_PRODUCTION
        }
        return process.env.REACT_APP_API_URL_LOCAL;
      };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!files) return;
        setError(null);
        setAnalysis(null);
        setFormData(null);
        const formData = new FormData();
        formData.append("image", files);
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


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
          'image/*': []
        },
        onDrop: acceptedFiles => {
          setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
          })));
          setPrompt('');
        }
      });
      
      const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
          <div style={thumbInner}>
            <img
              src={file.preview}
              style={img}
              // Revoke data uri after image is loaded
              onLoad={() => { URL.revokeObjectURL(file.preview) }}
            />
          </div>
        </div>
      ));
      useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
      }, []);

    return (
        <div className="upload-container">
            <div className="upload-header">
                <h2>Patient order upload</h2>
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
