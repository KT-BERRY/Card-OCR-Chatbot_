// MicrophonePopup.js

import React, { useState, useEffect } from 'react';

const MicrophonePopup = ({ onClose, onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            setAudioChunks([...audioChunks, e.data]);
          };
          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            onSave(audioBlob);
            setAudioChunks([]);
          };
          setMediaRecorder(recorder);
          recorder.start();
        })
        .catch((error) => {
          console.error('Error accessing the microphone:', error);
        });
    }
  }, [isRecording, audioChunks, onSave]);

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
    if (mediaRecorder) {
      if (isRecording) {
        mediaRecorder.stop();
      } else {
        mediaRecorder.start();
      }
    }
  };

  const handleSaveClick = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded_audio.wav';
    a.click();
  };

  return (
    <div className="microphone-popup">
      <div className="popup-card">
        <div className="popup-content">
          {isRecording ? <button onClick={handleRecordClick}>Stop Recording</button> : <button onClick={handleRecordClick}>Start Recording</button>}
          <button onClick={handleSaveClick} disabled={!audioChunks.length}>Save Audio</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MicrophonePopup;
