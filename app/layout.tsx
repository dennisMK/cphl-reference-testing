import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { poppins } from "@/lib/fonts";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: "Uganda Lab e-Test Requests",
  description: "Comprehensive viral load management system for Uganda",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
        <ThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
