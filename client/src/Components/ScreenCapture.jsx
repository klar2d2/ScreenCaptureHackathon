import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopIcon from '@mui/icons-material/Stop';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ScreenCaptureAndShareComponent = () => {
  const [captureUrl, setCaptureUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const captureScreenshot = (video = null) => {
    const displayMediaOptions = {
        video: {
          displaySurface: "window",
          cursor: "never",
          logicalSurface: true
        },
        preferCurrentTab: true,
        selfBrowserSurface: "include",
        systemAudio: "exclude"
      };


    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    const track = stream.getVideoTracks()[0];
    
    const imageCapture = new ImageCapture(track);
    const bitmap = await imageCapture.grabFrame();
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

  return (
    <Box sx={{ p: 2, maxWidth: 'md', mx: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleCapture} 
          startIcon={<CameraAltIcon />}
        >
          Take Screenshot
        </Button>
        {!isSharing ? (
          <Button 
            variant="contained" 
            onClick={handleShare} 
            startIcon={<ScreenShareIcon />}
          >
            Share Screen
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleStopSharing} 
            startIcon={<StopIcon />}
            color="secondary"
          >
            Stop Sharing
          </Button>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      {isSharing && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Screen Share:</Typography>
          <video ref={videoRef} autoPlay style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} />
        </Box>
      )}

      {captureUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Captured Screenshot:</Typography>
          <img src={captureUrl} alt="Screen Capture" style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} />
        </Box>
      )}
    </Box>
  );
};

export default ScreenCaptureAndShareComponent;