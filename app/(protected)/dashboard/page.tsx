"use client";

import { useSession } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube, Baby, Plus, List, Package } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { getColorsForType } = useTheme();
  
  const viralLoadColors = getColorsForType('viral-load');
  const eidColors = getColorsForType('eid');

  return (
    <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Uganda Viral Load Manager
        </h1>
        <p className="text-gray-600">
          Welcome, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Main Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Viral Load Card */}
        <Link href="/viral-load">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105">
            <CardHeader 
              className="text-center pb-4"
              style={{ backgroundColor: viralLoadColors.primaryLight }}
            >
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: viralLoadColors.primary }}
              >
                <TestTube className="h-8 w-8 text-white" />
              </div>
              <CardTitle 
                className="text-xl font-bold"
                style={{ color: viralLoadColors.primaryDark }}
              >
                Viral Load Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Plus className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">New Request</div>
                    <div className="text-sm text-gray-500">Create viral load test request</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <List className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Sample Collection</div>
                    <div className="text-sm text-gray-500">Manage pending samples</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Package className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Package Samples</div>
                    <div className="text-sm text-gray-500">Group and organize samples</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <span 
                  className="inline-block px-4 py-2 rounded-full text-white font-medium"
                  style={{ backgroundColor: viralLoadColors.primary }}
                >
                  Access Viral Load
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* EID Card */}
        <Link href="/eid">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105">
            <CardHeader 
              className="text-center pb-4"
              style={{ backgroundColor: eidColors.primaryLight }}
            >
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: eidColors.primary }}
              >
                <Baby className="h-8 w-8 text-white" />
              </div>
              <CardTitle 
                className="text-xl font-bold"
                style={{ color: eidColors.primaryDark }}
              >
                Early Infant Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Plus className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">New EID Request</div>
                    <div className="text-sm text-gray-500">Create infant testing request</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <List className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Track Infants</div>
                    <div className="text-sm text-gray-500">Monitor testing progress</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Package className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Results Management</div>
                    <div className="text-sm text-gray-500">Manage test results</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <span 
                  className="inline-block px-4 py-2 rounded-full text-white font-medium"
                  style={{ backgroundColor: eidColors.primary }}
                >
                  Access EID
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow">
            <div className="text-2xl font-bold text-gray-900">1,456</div>
            <div className="text-sm text-gray-500">Total Requests</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow">
            <div className="text-2xl font-bold text-green-600">1,203</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow">
            <div className="text-2xl font-bold text-yellow-600">147</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow">
            <div className="text-2xl font-bold text-blue-600">106</div>
            <div className="text-sm text-gray-500">This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
} 