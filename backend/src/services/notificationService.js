const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

// Configure optional nodemailer transporter
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Creates an in-app notification and optionally dispatches an email
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.title
 * @param {string} params.message
 * @param {string} params.type
 * @param {string} [params.relatedBookingId]
 * @param {string} [params.recipientEmail]
 */
const sendNotification = async ({
  userId,
  title,
  message,
  type = 'SYSTEM',
  relatedBookingId = null,
  recipientEmail = null,
}) => {
  try {
    // 1. Create In-App Notification
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      relatedBookingId,
    });

    // 2. Dispatch Email (if SMTP configured and email provided)
    if (transporter && recipientEmail) {
      transporter.sendMail({
        from: `"${process.env.APP_NAME || 'Vedic Jyotish Consultation'}" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: title,
        text: message,
        html: `
          <div style="font-family: serif; color: #2D2D34; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #6B1010; color: #FAF7F2; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">${process.env.APP_NAME || 'Astrology Consultation'}</h2>
              <p style="margin: 4px 0 0; font-size: 13px; color: #C5A059;">Authentic Vedic Wisdom & Guidance</p>
            </div>
            <div style="padding: 24px;">
              <h3 style="color: #6B1010; margin-top: 0;">${title}</h3>
              <p style="font-size: 15px; line-height: 1.6;">${message}</p>
            </div>
            <div style="background-color: #FAF7F2; padding: 12px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB;">
              This is an automated notification regarding your astrology consultation booking.
            </div>
          </div>
        `,
      }).catch((err) => {
        console.warn('[Email Warning]: Failed to send notification email:', err.message);
      });
    }

    return notification;
  } catch (error) {
    console.error('[Notification Service Error]:', error);
  }
};

module.exports = {
  sendNotification,
};
