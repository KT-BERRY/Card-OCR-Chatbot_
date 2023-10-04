import React, { useState, } from 'react';
import './draft-1.css';
import CameraPopup from './CameraPopup';
import MicrophonePopup from './MicrophonePopup';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SendIcon from '@mui/icons-material/Send';

function ChatBox() {
    const [messages, setMessages] = useState([{ sender: 'chatbot', message: 'Welcome, How may I help you?' }]);
    const [inputText, setInputText] = useState('');

    const appendMessage = (sender, message, delay) => {
        setMessages(prevMessages => [...prevMessages, { sender, message }]);
    }

    const sendMessage = () => {
        const message = inputText.trim();

        if (message !== '') {
            appendMessage('user', message);

            setTimeout(() => {
                const response = generateChatbotResponse(message);
                appendMessage('chatbot', response);
            }, 100);

            setInputText('');
        }
    }

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    }

    const handleCameraClick = () => {
        setShowCameraPopup(true);
    }

    const handleCloseCamera = () => {
        setShowCameraPopup(false);
    }

    const [showCameraPopup, setShowCameraPopup] = useState(false);

    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);

    const handleMicClick = () => {
        if (!mediaRecorder) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const recorder = new MediaRecorder(stream);
                    recorder.ondataavailable = (e) => {
                        setAudioChunks([...audioChunks, e.data]);
                    };
                    recorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        appendMessage('user', `<audio controls src="${audioUrl}"/>`);
                        setAudioChunks([]);
                    };
                    setMediaRecorder(recorder);
                })
                .catch((error) => {
                    console.error('Error accessing the microphone:', error);
                });
        }

        if (mediaRecorder && !isRecording) {
            mediaRecorder.start();
            setIsRecording(true);
        } else if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    }

    const [showMicrophonePopup, setShowMicrophonePopup] = useState(false);

    const handleMicrophoneClick = () => {
        setShowMicrophonePopup(true);
    }

    const handleCloseMicrophone = () => {
        setShowMicrophonePopup(false);
    }

    const handleSaveAudio = (audioBlob) => {
        // Handle saving the audio Blob locally here
        // You can use FileSaver.js or similar library for this
        console.log('Audio Blob:', audioBlob);
    }
        
    const generateChatbotResponse = (userMessage) => {
        if (isQuestion(userMessage)) {
            return askQuestion();
        } else {
            return giveResponse(userMessage);
        }
    }

    const isQuestion = (userMessage) => {
        return userMessage.includes('Thank you');
    }

    const askQuestion = () => {
        return 'What else can I help you with?';
    }

    const giveResponse = (userMessage) => {
        return 'Hi';
    }


    return (
        <div>
            <header>
                <div className="header-content">
                    <img src={require("./Bot AI ML logo.jpeg")} alt="Your Logo" width="60" height="60" />
                </div>
            </header>

            <div className="chatbox">
                <div className="chatbox-header">
                    <div className="header-content">
                        <img src={require("./Bot_AI_ML_logo-removebg-preview.png")} alt="Your Logo" width="10%" height="5%" />
                        <div className="chatbox-header-text">Chat Box</div>
                    </div>
                </div>

                <div className="messages" id="chat-messages">
                    {messages.map((msg, index) => (
                        <div className="message-container" key={index}>
                            <div className={`${msg.sender}-message`}>{msg.message}</div>
                        </div>
                    ))}
                </div>

                <div className="input-box">
                    <input
                        type="text"
                        id="text-input"
                        placeholder="Enter your message"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleEnterPress}
                    />
                    <div className="input-buttons">
                        <button id="mic-button" onClick={handleMicrophoneClick}>
                        {isRecording ? <span>Stop Recording</span> : <MicNoneOutlinedIcon style={{ fontSize: '20px' }} />}</button>
                        <button id="camera-button" onClick={handleCameraClick}><CameraAltIcon style={{ fontSize: '20px' }} /></button>
                        <button id="send-button" enabled="true" onClick={sendMessage}><SendIcon style={{ fontSize: '20px' }} /></button>
                    </div>
                    {showMicrophonePopup && (
                    <MicrophonePopup onClose={handleCloseMicrophone} onSave={handleSaveAudio} />
                    )}
                    {showCameraPopup && (
                    <CameraPopup
                    onClose={() => setShowCameraPopup(false)}
                    generateChatbotResponse={generateChatbotResponse}
                    appendMessage={appendMessage}
                />
                )}
                </div>

                <div className="dialect-box" id="dialect-box">
                    {/* Content for dialect box */}
                </div>
            </div>

            <footer>
                <p>&copy; BOT AI ML Pvt. Ltd. </p>
            </footer>
        </div>
    );
}

export default ChatBox;
