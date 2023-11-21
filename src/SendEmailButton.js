import React from 'react';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';

const SendEmailButton = ({ userEmail, onSendEmail }) => {
  const handleSendEmail = async () => {
    const from = 'botaiml123@gmail.com'; // Set a default value or fetch from elsewhere
    const to = userEmail; // Use the provided user email
    const subject = 'Test mail'; // Set a default value or fetch from elsewhere
    const body = 'Body of the email'; // Set a default value or fetch from elsewhere

    try {
      await axios.post('http://localhost:3001/send-email', { from, to, subject, body });
      console.log('Email sent successfully');
      if (onSendEmail) {
        onSendEmail();
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <button onClick={handleSendEmail}>
      <EmailIcon style={{ fontSize: '20px' }} />
    </button>
  );
};

export default SendEmailButton;
