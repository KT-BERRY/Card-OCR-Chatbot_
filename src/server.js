const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

app.post('/send-email', (req, res) => {
  const { to, subject, body } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email@gmail.com',
      pass: 'password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text: body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
