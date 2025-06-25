"use client";

import React from "react";
import { TestTube, ArrowLeft, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProtectedRoute } from "@/_components/auth/protected-route";
import { IoChevronBack } from "react-icons/io5";

export default function ViralLoadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen ">
        {/* Apple-Style Navigation Header */}
        <div className="bg-red-600 backdrop-blur-xl bg-opacity-95 border-b border-red-700/20 shadow-lg sticky top-0 z-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Navigation */}
              <div className="flex items-center space-x-6 flex-1 min-w-0">
                <Link href="/dashboard" className="flex items-center group transition-all duration-200">
                  <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 transition-all duration-200">
                    <IoChevronBack className="h-4 w-4 mr-2" />
                    <span className="font-medium">Home</span>
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="p-2.5 bg-white/15 backdrop-blur-sm rounded-xl flex-shrink-0 shadow-sm">
                    <TestTube className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-semibold text-white truncate tracking-tight">
                      <span className="sm:hidden">VLM</span>
                      <span className="hidden sm:inline">Viral Load Management</span>
                    </h1>
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Link href="/settings">
                  <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-2.5 transition-all duration-200">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Apple-Style Spacing */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 