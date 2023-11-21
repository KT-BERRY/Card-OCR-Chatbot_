import React from 'react';
import emailjs from 'emailjs-com';
import EmailIcon from '@mui/icons-material/Email';

const SendEmailButton = ({ messages }) => {
  const extractEmailFromMessages = () => {
    // Assuming the email is included in the chat messages
    const emailMessage = messages.find(
      (msg) => msg.sender === 'chatbot' && typeof msg.message === 'string' && msg.message.includes('@')
    );
  
    if (emailMessage) {
      const extractedEmail = emailMessage.message.match(/\S+@\S+/);
      return extractedEmail ? extractedEmail[0] : null;
    }
  
    return null;
  };

  const handleSendEmail = () => {
    const toEmail = extractEmailFromMessages();
    console.log(toEmail);

    if (toEmail) {
      const templateParams = {
        to_email: toEmail,
        subject: 'Test mail',
        body: 'Body of the email',
      };

      try {
        // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_USER_ID' with your EmailJS credentials
        emailjs.send('service_ljvfoq8', 'template_ki2n7c4', templateParams, 'C1dBfgO1y40dtHLJI');

        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      }
    } else {
      console.error('No email address found in chat messages.');
    }
  };

  return (
    <button onClick={handleSendEmail}>
      <EmailIcon style={{ fontSize: '20px' }} />
    </button>
  );
};

export default SendEmailButton;
