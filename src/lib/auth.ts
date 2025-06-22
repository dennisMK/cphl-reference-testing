import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import { env } from "@/env";
import { sendPasswordResetEmail } from "@/lib/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendPasswordResetEmail({
        email: user.email,
        userName: user.name,
        resetUrl: url,
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
