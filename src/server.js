const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { from, to, subject, body } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohantyabhishek101203@gmail.com',
      pass: 'GmailKT@8apr',
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
