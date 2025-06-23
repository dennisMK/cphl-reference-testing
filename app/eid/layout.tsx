"use client";

import React from "react";
import { Baby, Home, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProtectedRoute } from "@/_components/auth/protected-route";

export default function EIDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
      {/* Navigation Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Branding */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Baby className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Early Infant Diagnosis</h1>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
    </ProtectedRoute>
  );
} 