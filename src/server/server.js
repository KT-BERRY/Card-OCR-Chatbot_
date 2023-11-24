// import express from 'express';
const express = require('express');
// import { createTransport } from 'nodemailer';
// import cors from 'cors';
const { createTransport } = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3001;

// Configuration (Replace with your actual values or use environment variables)
// const emailConfig = {
//   user: 'botaiml123@gmail.com',
//   pass: 'ssdc rrsa kcxv wzsh',
// };

app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'botaiml123@gmail.com',
    pass: 'zcns odsn murn nohv',
  },
});

// Function to send email
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return 'Email sent successfully';
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Error sending email');
  }
};

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  const { from, to, subject, body } = req.body;

  const mailOptions = {
    from,
    to,
    subject,
    text: body,
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log('Email sent successfully:', result);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
