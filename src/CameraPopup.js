import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const CameraPopup = ({ onClose, generateChatbotResponse, appendMessage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById('file-input').click();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();

    if (imageSrc) {
        image.onload = () => {
          const aspectRatio = image.width / image.height;
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.width / aspectRatio;
  
          canvas.height = canvasHeight;
          context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        };
  
        image.src = imageSrc;
    }

    let stream;

    const openCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    };

    openCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCaptureImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        const imageSrcData = canvas.toDataURL('image/png');
        setImageSrc(imageSrcData);
    }

    if (canvas) {
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
        const imageSrcData = canvas.toDataURL('image/png');
        
        // Send the captured image to the API for text recognition
        try {
          const response = await axios.post('https://demo.botaiml.com/card-ocr/image-ocr-extraction', {
            image: imageSrcData,
          });
  
          // Extract text from the API response
          const recognizedText = response.data.text;
  
          // Pass the recognized text to your chatbot logic
          const responseMessage = generateChatbotResponse(recognizedText);
  
          // Update messages state
          appendMessage('chatbot', responseMessage);
  
          setImageSrc(imageSrcData); // Show captured image
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing the camera:', err);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  const handleRetakeImage = () => {
    setImageSrc(null);
    startCamera();
  };

  const handleSaveImage = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'captured_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="camera-popup">
      <div className="popup-content">
        {imageSrc ? (
          <>
            <img src={imageSrc} alt="Captured" style={{ maxWidth: '100%', height: 'auto' }}/>
            <button onClick={handleSaveImage}>Save Image</button>
            <button onClick={handleRetakeImage}>Retake Image</button>
          </>
        ) : (
          <video ref={videoRef} autoPlay playsInline />
        )}
        {/* {imageSrc && <img src={imageSrc} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />} */}
        {!imageSrc && 
        <button onClick={handleCaptureImage}>Capture Image</button>}
        <button onClick={handleUploadButtonClick}>Upload Image</button>
        {/* <input type="file" accept="image/*" onChange={handleFileUpload} /> */}
        <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
        />

        <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
        <button onClick={onClose}>Close Camera</button>
      </div>
    </div>
  );
};

export default CameraPopup;
