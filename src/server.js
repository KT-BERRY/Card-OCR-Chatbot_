import express from 'express';
import { createTransport } from 'nodemailer';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  console.log('Received email request:', req.body);

  const { from, to, subject, body } = req.body;

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'botaiml123@gmail.com',
      pass: 'bot_KT@123',
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
    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(port, () => {
  console.log('Server is running on http://localhost:3001');
});
