// MicrophonePopup.js

import React, { useState } from 'react';

const MicrophonePopup = ({ onClose, onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  let mediaRecorder;

  const handleRecordClick = () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (e) => {
            setAudioChunks([...audioChunks, e.data]);
          };
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            onSave(audioBlob);
            setAudioChunks([]);
          };
          mediaRecorder.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error('Error accessing the microphone:', error);
        });
    }
  }

  return (
    <div className="microphone-popup">
      <div className="popup-content">
        {isRecording ? <button onClick={handleRecordClick}>Stop Recording</button> : <button onClick={handleRecordClick}>Start Recording</button>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MicrophonePopup;
