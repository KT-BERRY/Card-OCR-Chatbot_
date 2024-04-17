import React, { useState, useEffect } from 'react';
import './Chatbox.css';
import CameraPopup from './CameraPopup';
import MicrophonePopup from './MicrophonePopup';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SendIcon from '@mui/icons-material/Send';
import SendEmailButton from './SendEmailButton';
import { useDispatch, useSelector } from 'react-redux';
import { setLatestEmail, selectLatestEmail } from './store/emailSlice';
import axios from 'axios'; 

function ChatBox() {
    const dispatch = useDispatch();
    const latestEmail = useSelector(selectLatestEmail);
    const [emailSent, setEmailSent] = useState(false);

    const [messages, setMessages] = useState([{ sender: 'chatbot', message: 'Welcome, How may I help you?' }]);
    

    const getLatestEmail = () => {
        const emailMessage = messages.reverse().find(
            (msg) => msg.sender === 'chatbot' && typeof msg.message === 'string' && msg.message.includes('@')
        );
    
        return emailMessage ? emailMessage.message.match(/\S+@\S+/)[0] : null;
    };
    
    useEffect(() => {
        if (latestEmail) {
            setUserEmail(latestEmail);
        }
    }, [latestEmail]);

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

    const sendEmail = async (from, subject, body) => {
        const toEmail = getLatestEmail();
    
        if (!toEmail) {
            console.error('No recipient email address found.');
            return; // Don't attempt to send an email without a valid recipient
        }
    
        console.log('Recipient Email:', toEmail);
    
        const to = toEmail;
    
        try {
            // Log the email details for debugging
            console.log('Sending email to:', to);
            console.log('Email content:', { from, to, subject, body });
    
            // Use the send-email endpoint from the server
            await axios.post('http://localhost:3001/send-email', { from, to, subject, body });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const handleSendEmail = async () => {
        try {
            const toEmail = getLatestEmail();
            console.log('Recipient Email:', toEmail);
            
            if (toEmail) {
                const from = 'botaiml123@gmail.com'; // Replace with the actual sender's email
                const subject = 'Contact from BOT AI ML';
                const body = 'Hello Sir/Madam';
                // Call the sendEmail function with the latest email address
                await sendEmail(from, subject, body, toEmail);
                // Call the utility function to handle email sending
                handleEmailSent();
            } else {
                console.error('No email address found in chat messages.');
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const handleEmailSent = () => {
        // Add any logic you need when the email is successfully sent
        setEmailSent(true);
        // Optionally, you can append a message to indicate email sent
        appendMessage('chatbot', 'E-Mail sent successfully');
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
                        <SendEmailButton getLatestEmail={getLatestEmail} onSendEmail={handleSendEmail} enabled={emailSent} />
                        
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

            <footer className="footer">
                <p>&copy; BOT AI ML Pvt. Ltd. </p>
            </footer>
        </div>
    );
}

export default ChatBox;