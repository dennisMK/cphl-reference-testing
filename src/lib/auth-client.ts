import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" ? "https://your-domain.com" : "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

// Password reset methods from Better Auth - using direct client methods
export const requestPasswordReset = authClient.forgetPassword || authClient.requestPasswordReset;
export const resetUserPassword = authClient.resetPassword; 