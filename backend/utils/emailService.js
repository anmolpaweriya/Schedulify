const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');

const sendEmail = async (options) => {
  try {
    let transporter;

    // Fetch SMTP details from global settings
    const settings = await Settings.findOne({ key: 'platform_settings' });

    if (settings && settings.smtpHost && settings.smtpUser && settings.smtpPass) {
      transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpPort === 465,
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPass,
        },
      });
    } else {
      // Fallback: Use ethereal mail or local log for development
      console.log('--- Development Email Logger ---');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Body: ${options.text || options.html}`);
      console.log('---------------------------------');
      return { success: true, logged: true };
    }

    const mailOptions = {
      from: settings?.smtpFrom || 'noreply@appointmentscheduler.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    // Return success: false, but don't crash backend execution
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
