import React from 'react';
import emailjs from 'emailjs-com';
import EmailIcon from '@mui/icons-material/Email';

const SendEmailButton = ({ getLatestEmail }) => {
  const handleSendEmail = async () => {
    try {
      const toEmail = await getLatestEmail();

      if (toEmail) {
        const templateParams = {
          to_email: toEmail,
          subject: 'Test mail',
          body: 'Body of the email',
        };

        await emailjs.send('service_ljvfoq8', 'template_ki2n7c4', templateParams, 'C1dBfgO1y40dtHLJI');

        console.log('Email sent successfully');
      } else {
        console.error('No email address found in chat messages.');
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
