import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const CameraPopup = ({ onClose, generateChatbotResponse, appendMessage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('Selected File:', file);
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
  
        const img_path = canvas.toDataURL('image/jpg');
        setImageSrc(img_path);
    }
  };

  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const [userProvidedEmail, setUserProvidedEmail] = useState('');

  const handleSendToAPI = async () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const imgBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpg'));
      const formData = new FormData();
      formData.append('img_path', new File([imgBlob], 'captured_image.jpg', { type: 'image/jpeg' }));

      try {
        const response = await axios.post('https://demo.botaiml.com/card-ocr/image-ocr-extraction', formData, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          },
        });

        const extractedDataArray = response.data;

        let email;

        for (let item of extractedDataArray) {
          if (item.includes('@')) {
            email = item;
            break;
          }
        }

        if (email) {
          const recognizedTextMessage = (
            <div>
              <div>{email}</div>
            </div>
          );

          appendMessage('chatbot', recognizedTextMessage);
        } else {
          appendMessage('chatbot', 'Email not found in the API response');
        }

        onClose();
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  }

  const handleSendEmail = async () => {
    const from = 'botaiml123@gmail.com'; // Set a default value or fetch from elsewhere
    const subject = 'Test mail'; // Set a default value or fetch from elsewhere
    const body = 'Body of the email'; // Set a default value or fetch from elsewhere
  
    // Check if the email is valid (add your own validation logic here)
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
      await sendEmail(from, subject, body);
    } else {
      console.error('Invalid email address');
    }
  };
  
  const sendEmail = async (from, subject, body) => {
    const to = 'abhishek080403@gmail.com'; // Set a default value or fetch from elsewhere
    
    try {
      await axios.post('http://localhost:3001/send-email', { from, to, subject, body });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
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
            <button onClick={handleSaveImage}>Save</button>
            <button onClick={handleRetakeImage}>Retake</button>
            <button onClick={handleSendToAPI}>Send</button>
            {/* <button onClick={handleSendEmail}>Send Email</button> */}
          </>
        ) : (
          <video ref={videoRef} autoPlay playsInline />
        )}
        {/* {imageSrc && <img src={imageSrc} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />} */}
        {!imageSrc && 
        <button onClick={handleCaptureImage}>Capture</button>}
        <button onClick={handleUploadButtonClick}>Upload</button>
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