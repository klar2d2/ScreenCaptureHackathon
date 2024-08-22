import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import PendingOrders from "../PendingOrders/PendingOrders";
import backgroundImage from "./dummyBackground.jpg";

const UploadContainer = styled.div`
  width: 93%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 16px;
  background: var(--textWhite, #fff);
  box-shadow: 0px 3px 0px 0px #69aeff;
  background-color: #f9f9f9;
`;

const UploadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const UploadButton = styled.button`
  padding: 8px 16px;
  width: 220px;
  height: 40px;
  border: 1px solid #555;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
`;

const StyledDropzone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  border: 2px dashed #007bff;
  border-radius: 8px;
  background-color: #fff;
  text-align: center;
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DropzoneIcon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
  color: #ccc;
`;

const DropzoneText = styled.p`
  color: #777;
  font-size: 16px;
`;

const AppHeader = styled.header`
  background-image: url(${backgroundImage});
  background-size: cover;
  min-height: 25vh;
  max-height: 25vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  font-size: calc(10px + 2vmin);
  color: #2f3641;
`;

const ThumbsContainer = styled.aside`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const Thumb = styled.div`
  display: inline-flex;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 100px;
  height: 100px;
  padding: 4px;
  box-sizing: border-box;
`;

const ThumbInner = styled.div`
  display: flex;
  min-width: 0;
  overflow: hidden;
`;

const ThumbImg = styled.img`
  display: block;
  width: auto;
  height: 100%;
`;

const ErrorContainer = styled.div`
  color: red;
  text-align: center;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("Drag and drop files here");
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles([...acceptedFiles]);
      };
      reader.readAsDataURL(file);
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

  const thumbs = files.map((file) => (
    <Thumb key={file.name}>
      <ThumbInner>
        <ThumbImg
          src={URL.createObjectURL(file)}
          alt={file.name}
          onLoad={() => URL.revokeObjectURL(file)}
        />
      </ThumbInner>
    </Thumb>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  if (formData) {
    return <PendingOrders patientData={formData} />;
  }

  return (
    <>
      <AppHeader></AppHeader>
      <UploadContainer>
        <UploadHeader>
          <h2>Patient order upload</h2>
          <HiddenInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <UploadButton onClick={handleUpload}>UPLOAD</UploadButton>
        </UploadHeader>
        <StyledDropzone {...getRootProps()}>
          <input {...getInputProps()} />
          <DropzoneContent>
            <DropzoneIcon>
              <i className="fas fa-file-upload"></i>
            </DropzoneIcon>
            {isDragActive ? (
              <DropzoneText>Drop the files here...</DropzoneText>
            ) : (
              <DropzoneText>{prompt}</DropzoneText>
            )}
          </DropzoneContent>
          <ThumbsContainer>{thumbs}</ThumbsContainer>
          {loading && <div>Loading...</div>}
          {error && (
            <ErrorContainer>
              <h2>Error:</h2>
              <p>{error}</p>
            </ErrorContainer>
          )}
        </StyledDropzone>
      </UploadContainer>
    </>
  );
};

export default FileUpload;
