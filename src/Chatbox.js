import React, { useState, } from 'react';
import './Chatbox.js';
import CameraPopup from './CameraPopup';
import MicrophonePopup from './MicrophonePopup';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SendIcon from '@mui/icons-material/Send';
import SendEmailButton from './SendEmailButton';
import EmailIcon from '@mui/icons-material/Email';

function ChatBox() {
    const [messages, setMessages] = useState([{ sender: 'chatbot', message: 'Welcome, How may I help you?' }]);

    const getLatestEmail = () => {
        const emailMessage = messages.reverse().find(
          (msg) => msg.sender === 'chatbot' && typeof msg.message === 'string' && msg.message.includes('@')
        );
    
        return emailMessage ? emailMessage.message.match(/\S+@\S+/)[0] : null;
    };

    const [inputText, setInputText] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const appendMessage = (sender, message, userEmail) => {
        setMessages(prevMessages => [...prevMessages, { sender, message }]);
        if (userEmail) {
          setUserEmail(userEmail);
        }
    };
      
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

    const handleUserEmailChange = (event) => {
        setUserEmail(event.target.value);
    };

    const [showCameraPopup, setShowCameraPopup] = useState(false);

    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);

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
        return userMessage;
    }

    const handleSendEmail = () => {
        // Add any logic you need when the email is sent
        console.log('Email sent from ChatBox!');
    };

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
                        {/* <button id="send-email-button" onClick={sendMessage}><EmailIcon style={{ fontSize: '20px' }} /></button> */}
                        {/* <SendEmailButton userEmail={userEmail} onSendEmail={handleSendEmail} /> */}
                        {/* <SendEmailButton userEmail={userEmail} /> */}
                        {/* <SendEmailButton messages={messages} /> */}
                        <SendEmailButton getLatestEmail={getLatestEmail} />
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