const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text, html };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error('📧 Email sending failed:', err.message);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;