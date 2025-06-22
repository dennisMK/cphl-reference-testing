import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ResetPasswordEmail } from '@/emails/reset-password';
import { env } from '@/env';

// Initialize Resend
const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail({
  email,
  userName,
  resetUrl,
}: {
  email: string;
  userName?: string;
  resetUrl: string;
}) {
  try {
    // If no API key is provided, fall back to console logging for development
    if (!env.RESEND_API_KEY) {
      console.log(`
=== EMAIL DEBUG (No RESEND_API_KEY provided) ===

      `);
      return { success: true };
    }

    // Render the email template
    const emailHtml = await render(
      ResetPasswordEmail({
        userName: userName || 'there',
        resetUrl,
      })
    );

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Uganda Viral Load Manager <noreply@ugandaviralload.com>',
      to: [email],
      subject: 'Reset your password - Uganda Viral Load Manager',
      html: emailHtml,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail({
  email,
  userName,
}: {
  email: string;
  userName: string;
}) {
  try {
    if (!env.RESEND_API_KEY) {
      console.log(`
=== EMAIL DEBUG (No RESEND_API_KEY provided) ===
To: ${email}
Subject: Welcome to Uganda Viral Load Manager
User: ${userName}
==========================================
      `);
      return { success: true };
    }

    const { data, error } = await resend.emails.send({
      from: 'Uganda Viral Load Manager <noreply@ugandaviralload.com>',
      to: [email],
      subject: 'Welcome to Uganda Viral Load Manager',
      html: `
        <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937; text-align: center;">Welcome to Uganda Viral Load Manager</h1>
          <p style="color: #4b5563; font-size: 16px;">Hi ${userName},</p>
          <p style="color: #4b5563; font-size: 16px;">Welcome to Uganda Viral Load Manager! Your account has been created successfully.</p>
          <p style="color: #4b5563; font-size: 16px;">You can now access the system and start managing viral load data.</p>
          <p style="color: #4b5563; font-size: 16px;">Best regards,<br>Uganda Viral Load Manager Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Welcome email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Welcome email service error:', error);
    return { success: false, error };
  }
} 