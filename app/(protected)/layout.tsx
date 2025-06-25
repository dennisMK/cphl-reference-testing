"use client";

import React from "react";
import { TopNav } from "@/components/top-nav";
import { ProtectedRoute } from "../_components/auth/protected-route";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <TopNav />
        <main className="pt-4">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
