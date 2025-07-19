import { logger } from './logger';
import nodemailer  from 'nodemailer';


/**
 * Create email transporter
 * @returns {Object} - Nodemailer transporter
*/

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Replace with correct SMTP host
    port: 465,
    secure: true,  // Use true for 465, false for other ports
    auth: {
      user: 'devteam@formvive.com',
      pass: 'ilszjcmzxyklspue'  // Use app-specific password if using Gmail
    }
  });
};


/**
 * Generic email sender using the configured transporter
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: '"Ajarra Team" <devteam@formvive.com>',  // adjust 'from' as needed
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error: any) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (user: any, otp: string, verifyUrl: string) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to Ajarra Marketplace!',
    text: `Hi ${user.firstName || user.name},

Welcome to Ajarra Marketplace! We're excited to have you join our platform for discovering, booking, and managing top vendors and services for your events and business needs.

Your OTP is: ${otp}

Verify your email: ${verifyUrl}

Your user ID is: ${user.userId || user.id}

Best regards,
The Ajarra Team
`,
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; background: #f9f6f2; border-radius: 8px; padding: 32px 24px;">
    <h2 style="color: #C97A40; margin-bottom: 8px;">Welcome to Ajarra Marketplace!</h2>
    <p style="color: #3A2E25;">Hi ${user.firstName || user.name},</p>
    <p style="color: #3A2E25;">
      We're excited to have you join <strong>Ajarra</strong> – your one-stop platform for discovering, booking, and managing top vendors and services for your events and business needs.
    </p>
    <p style="color: #3A2E25;"><strong>Your OTP:</strong> <span style="font-size: 1.2em; color: #C97A40;">${otp}</span></p>
    <p>
      <a href="${verifyUrl}" style="background-color: #C97A40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
    </p>
    <p style="color: #3A2E25;"><strong>Your User ID:</strong> ${user.userId || user.id}</p>
    <div style="background: #fff7ed; padding: 18px; margin: 24px 0; border-radius: 6px;">
      <p style="color: #3A2E25; margin-bottom: 8px;"><strong>Getting Started with Ajarra:</strong></p>
      <ul style="color: #3A2E25; padding-left: 20px;">
        <li>Browse and book trusted vendors for your events</li>
        <li>Manage your bookings and payments in one place</li>
        <li>Invite friends and earn rewards</li>
        <li>Track your event progress in your dashboard</li>
      </ul>
    </div>
    <p style="color: #3A2E25;">Best regards,<br />The Ajarra Team</p>
    <div style="margin-top: 24px; font-size: 0.9em; color: #a58b6f;">
      <em>Ajarra Marketplace – Making event and vendor management seamless and reliable.</em>
    </div>
  </div>
`
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user: any, resetToken: any, resetUrl: any) => {
  return sendEmail({
    to: user.email,
    subject: 'Ajarra Password Reset Request',
    text: `Hi ${user.firstName || user.name},

You requested a password reset for your Ajarra account. Click the link below to reset your password:
${resetUrl}

This link is valid for 10 minutes. If you didn’t request this, you can ignore the email.

Best regards,
The Ajarra Team
`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; background: #f9f6f2; border-radius: 8px; padding: 32px 24px;">
        <h2 style="color: #C97A40;">Password Reset Request</h2>
        <p style="color: #3A2E25;">Hi ${user.firstName || user.name},</p>
        <p style="color: #3A2E25;">
          You requested a password reset for your <strong>Ajarra</strong> account. Click below to reset your password:
        </p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #C97A40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #3A2E25;">This link is valid for 10 minutes. If you didn’t request this, you can ignore the email.</p>
        <p style="color: #3A2E25;">Best regards,<br />The Ajarra Team</p>
        <div style="margin-top: 24px; font-size: 0.9em; color: #a58b6f;">
          <em>Ajarra Marketplace – Making event and vendor management seamless and reliable.</em>
        </div>
      </div>
    `
  });
};

