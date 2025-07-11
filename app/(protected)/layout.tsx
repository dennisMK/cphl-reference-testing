"use client";

import React from "react";
import { AppNavigation } from "@/components/app-navigation";
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";
import { QuickActions } from "@/components/quick-actions";
import { ProtectedRoute } from "../_components/auth/protected-route";
import { TokenExpirationWarning } from "@/components/token-expiration-warning";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <AppNavigation />
        <main className="pt-4">
          <div className="container mx-auto ">
            <TokenExpirationWarning />
            <BreadcrumbNavigation />
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
