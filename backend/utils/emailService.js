const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');

const sendEmail = async (options) => {
  try {
    let transporter;

    // Fetch SMTP details from global settings or process.env
    const settings = await Settings.findOne({ key: 'platform_settings' });

    const host = (settings && settings.smtpHost) || process.env.SMTP_HOST;
    const port = Number((settings && settings.smtpPort) || process.env.SMTP_PORT || 587);
    const user = (settings && settings.smtpUser) || process.env.SMTP_USER;
    const pass = (settings && settings.smtpPass) || process.env.SMTP_PASS;
    const from = (settings && settings.smtpFrom) || process.env.SMTP_FROM || 'noreply@appointmentscheduler.com';

    if (host && user && pass) {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      console.log('--- Development Email Logger ---');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Body: ${options.text || options.html}`);
      console.log('---------------------------------');
      return { success: true, logged: true };
    }

    const mailOptions = {
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Sent to ${options.to} (${options.subject}): ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

// Helper templates for appointment notifications

// 1. Appointment Booked Confirmation (To Customer & Provider)
const sendAppointmentBookedEmails = async ({ customer, provider, appointment }) => {
  const { date, timeSlot, reason } = appointment;

  // Email to Customer
  await sendEmail({
    to: customer.email,
    subject: `Appointment Request Submitted - ${date}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; borderRadius: 12px;">
        <h2 style="color: #ea580c;">Appointment Booking Submitted</h2>
        <p>Dear <strong>${customer.name}</strong>,</p>
        <p>Your appointment request has been successfully submitted and is currently pending approval.</p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Faculty/Provider:</strong> ${provider.title ? provider.title + ' ' : ''}${provider.name} (${provider.specialization || 'Specialist'})</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time Slot:</strong> ${timeSlot.start} - ${timeSlot.end}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        <p>You will receive a notification once the provider accepts or declines your booking.</p>
        <p style="color: #6b7280; font-size: 0.85rem; margin-top: 20px;">Thank you for using Schedulify!</p>
      </div>
    `,
  });

  // Email to Provider
  await sendEmail({
    to: provider.email,
    subject: `New Appointment Booking Request from ${customer.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; borderRadius: 12px;">
        <h2 style="color: #ea580c;">New Booking Request Received</h2>
        <p>Dear <strong>${provider.name}</strong>,</p>
        <p>You have a new appointment booking request from <strong>${customer.name}</strong>.</p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Booked By:</strong> ${customer.name} (${customer.email})</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time Slot:</strong> ${timeSlot.start} - ${timeSlot.end}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        <p>Please log in to your dashboard to <strong>Accept</strong> (with a Google Meet link) or <strong>Reject</strong> (with reason).</p>
      </div>
    `,
  });
};

// 2. Appointment Approved (To Customer)
const sendAppointmentApprovedEmail = async ({ customer, provider, appointment }) => {
  const { date, timeSlot, meetingLink } = appointment;

  await sendEmail({
    to: customer.email,
    subject: `Appointment Approved! Join Google Meet - ${date}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; borderRadius: 12px;">
        <h2 style="color: #16a34a;">Appointment Approved!</h2>
        <p>Dear <strong>${customer.name}</strong>,</p>
        <p>Your appointment with <strong>${provider.title ? provider.title + ' ' : ''}${provider.name}</strong> has been <strong>Approved</strong>.</p>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #bbf7d0;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time Slot:</strong> ${timeSlot.start} - ${timeSlot.end}</p>
          <p><strong>Google Meet Link:</strong> <a href="${meetingLink}" target="_blank" style="color: #0284c7; font-weight: bold;">${meetingLink}</a></p>
        </div>
        <p style="margin-top: 15px;">Please join the Google Meet at the scheduled appointment time.</p>
      </div>
    `,
  });
};

// 3. Appointment Rejected (To Customer)
const sendAppointmentRejectedEmail = async ({ customer, provider, appointment }) => {
  const { date, timeSlot, rejectionReason } = appointment;

  await sendEmail({
    to: customer.email,
    subject: `Appointment Request Update - ${date}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; borderRadius: 12px;">
        <h2 style="color: #dc2626;">Appointment Request Declined</h2>
        <p>Dear <strong>${customer.name}</strong>,</p>
        <p>Your appointment request with <strong>${provider.name}</strong> for <strong>${date} (${timeSlot.start} - ${timeSlot.end})</strong> could not be accepted.</p>
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #fecaca;">
          <p><strong>Rejection Reason:</strong> ${rejectionReason || 'Provider unavailable for this time slot'}</p>
        </div>
        <p>You can log in to your dashboard to <strong>Reschedule</strong> this meeting for a different available time slot.</p>
      </div>
    `,
  });
};

// 4. Appointment Starting Reminder (To Both Customer & Provider - Triggered by Cron)
const sendAppointmentReminderEmails = async ({ customer, provider, appointment }) => {
  const { date, timeSlot, meetingLink } = appointment;

  // Reminder to Customer
  await sendEmail({
    to: customer.email,
    subject: `Reminder: Appointment Starting Soon! - ${timeSlot.start}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; borderRadius: 12px;">
        <h2 style="color: #0284c7;">Meeting Starting Now / Soon!</h2>
        <p>Dear <strong>${customer.name}</strong>,</p>
        <p>Your appointment with <strong>${provider.name}</strong> is starting at <strong>${timeSlot.start}</strong>.</p>
        <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center;">
          <p style="font-size: 1.1rem; font-weight: bold; margin-bottom: 10px;">Google Meet Link:</p>
          <a href="${meetingLink}" target="_blank" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Join Google Meet Now</a>
        </div>
      </div>
    `,
  });

  // Reminder to Provider
  await sendEmail({
    to: provider.email,
    subject: `Reminder: Appointment Session Starting - ${timeSlot.start}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; borderRadius: 12px;">
        <h2 style="color: #0284c7;">Session Starting Now!</h2>
        <p>Dear <strong>${provider.name}</strong>,</p>
        <p>Your session with <strong>${customer.name}</strong> is scheduled for <strong>${timeSlot.start} - ${timeSlot.end}</strong>.</p>
        <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center;">
          <a href="${meetingLink}" target="_blank" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Join Google Meet</a>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendAppointmentBookedEmails,
  sendAppointmentApprovedEmail,
  sendAppointmentRejectedEmail,
  sendAppointmentReminderEmails,
};
