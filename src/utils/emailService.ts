import { Resend } from 'resend';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 */
export const sendEmail = async ({ to, subject, html, text }: { to: string, subject: string, html?: string, text?: string }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [to],
            subject,
            // Use either react or html/text, not both. If you want to use html/text, cast as any to bypass type error:
            ...(html || text ? { html, text } : {}),
            // react: <YourReactComponent /> // Uncomment and use this if you want to use react-based emails
        } as any);

        if (error) {
            logger.error('Resend email error:', error);
            throw error;
        }

        if (data) {
            logger.info(`Email sent: ${data.id}`);
        } else {
            logger.warn('Email sent but no data returned.');
        }
        return data;
    } catch (err) {
        logger.error('Email send failed:', err);
        throw err;
    }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (user:any) => {
    return sendEmail({
        to: user.email,
        subject: 'Welcome to Xeenux Platform',
        text: `Hi ${user.name},\n\nWelcome to Xeenux! We're excited to have you on board.\n\nYour user ID is: ${user.userId}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #6d28d9;">Welcome to Xeenux!</h2>
        <p>Hi ${user.name},</p>
        <p>We're excited to have you on board. You're now part of our growing community!</p>
        <p><strong>Your User ID:</strong> ${user.userId}</p>
        <div style="background: #f8f8f8; padding: 15px; margin: 20px 0;">
          <p><strong>Getting Started:</strong></p>
          <ul>
            <li>Explore available packages</li>
            <li>Invite friends using your referral link</li>
            <li>Track progress in your dashboard</li>
          </ul>
        </div>
        <p>Best regards,<br />The Xeenux Team</p>
      </div>
    `
    });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user:any, resetToken:any, resetUrl:any) => {
    return sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `Hi ${user.name},\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link expires in 10 minutes.`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #6d28d9;">Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click below to reset your password:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #6d28d9; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p>This link is valid for 10 minutes. If you didn’t request this, you can ignore the email.</p>
        <p>Best regards,<br />The Xeenux Team</p>
      </div>
    `
    });
};


