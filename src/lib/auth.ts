import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import { env } from "@/env";

// Simple email sending function for development
async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  // In development, we'll just log the email
  // In production, you would integrate with a service like Resend, SendGrid, etc.
  console.log(`
=== EMAIL DEBUG ===
To: ${to}
Subject: ${subject}
Body: ${text}
==================
  `);
  
  // For now, we'll just resolve successfully
  // In production, replace this with actual email sending
  return Promise.resolve();
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password - Uganda Viral Load Manager",
        text: `Hi ${user.name || 'there'},\n\nYou requested to reset your password for Uganda Viral Load Manager.\n\nClick the link below to reset your password:\n${url}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nUganda Viral Load Manager Team`,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  baseURL: env.NODE_ENV === "production" 
    ? env.BETTER_AUTH_URL
    : "http://localhost:3000",
  trustedOrigins: [env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"],
  secret: env.BETTER_AUTH_SECRET || "default-secret-for-development",
});
