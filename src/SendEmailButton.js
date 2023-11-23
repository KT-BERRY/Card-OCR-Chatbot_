import React from 'react';
import EmailIcon from '@mui/icons-material/Email';

const SendEmailButton = ({ getLatestEmail, onSendEmail, disabled }) => {
  const handleSendEmail = async () => {
    try {
      const toEmail = await getLatestEmail();

      if (toEmail) {
        // Add any additional logic related to sending emails here
        console.log('Email sent from SendEmailButton!');
        onSendEmail();
        
      } else {
        console.error('No email address found in chat messages.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <button onClick={handleSendEmail} disabled={disabled}>
      <EmailIcon style={{ fontSize: '20px' }} />
    </button>
  );
};

export default SendEmailButton;
