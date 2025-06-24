"use client";

import React from "react";
import { Baby, ArrowLeft, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProtectedRoute } from "@/_components/auth/protected-route";
import { IoChevronBack } from "react-icons/io5";

export default function EIDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        {/* Mobile-Optimized Navigation Header */}
        <div className="bg-blue-500 border-b border-blue-600 shadow-sm sticky top-0 z-50">
          <div className="mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Left side - Navigation */}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
                  <Button variant="ghost" size="sm" className="text-white hover:text-blue-200 p-2 sm:px-3">
                    <IoChevronBack className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                
                <div className="h-5 w-px bg-blue-300 hidden sm:block"></div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                    <Baby className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-sm sm:text-lg font-semibold text-white truncate">
                      <span className="sm:hidden">EID</span>
                      <span className="hidden sm:inline">Early Infant Diagnosis</span>
                    </h1>
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
                <Link href="/settings">
                  <Button variant="ghost" size="sm" className="text-white hover:text-blue-200 p-2">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Mobile Optimization */}
        <div className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 