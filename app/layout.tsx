import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { poppins } from "@/lib/fonts";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Uganda Lab e-Test Requests",
  description: "Comprehensive viral load management system for Uganda",
  icons: [{ rel: "icon", url: "/uganda-flag.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${poppins.className}`}>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
