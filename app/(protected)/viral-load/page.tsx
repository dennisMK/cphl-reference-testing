"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, List, Package, ArrowLeft, Users, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ViralLoadPage() {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('viral-load');

  // Mock data for statistics
  const stats = {
    totalRequests: 1456,
    pendingCollection: 147,
    packaged: 89,
    thisWeek: 34
  };

  return (
    <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Viral Load Operations</h1>
            <p className="text-gray-600">Manage viral load testing workflow</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-xl font-bold text-gray-900">{stats.totalRequests}</div>
          <div className="text-sm text-gray-500">Total Requests</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-xl font-bold text-yellow-600">{stats.pendingCollection}</div>
          <div className="text-sm text-gray-500">Pending Collection</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-xl font-bold text-green-600">{stats.packaged}</div>
          <div className="text-sm text-gray-500">Packaged</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-xl font-bold" style={{ color: colors.primary }}>{stats.thisWeek}</div>
          <div className="text-sm text-gray-500">This Week</div>
        </div>
      </div>

      {/* Main Operations */}
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* 1. New Request */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle style={{ color: colors.primaryDark }}>New Request</CardTitle>
                  <p className="text-sm text-gray-600">Create a new viral load test request</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: colors.primary, color: 'white' }}>
                Step 1
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Enter clinician details, patient information, and treatment data to create a new viral load test request.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Clinician & Patient Info</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Treatment Details</span>
                </div>
              </div>
              <Link href="/viral-load/new-request">
                <button 
                  className="w-full md:w-auto px-6 py-3 rounded-lg text-white font-medium transition-colors"
                  style={{ backgroundColor: colors.primary }}
                >
                  Create New Request
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 2. Pending Sample Collection */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <List className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle style={{ color: colors.primaryDark }}>Pending Sample Collection</CardTitle>
                  <p className="text-sm text-gray-600">Manage and collect samples for existing requests</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: colors.primary, color: 'white' }}>
                Step 2
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                View all pending requests, collect samples, and add sample details (collection time, sample ID, storage consent).
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-500">{stats.pendingCollection} Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Sample Details</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href="/viral-load/pending-collection" className="flex-1">
                  <button 
                    className="w-full px-6 py-3 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: colors.primary }}
                  >
                    View Pending ({stats.pendingCollection})
                  </button>
                </Link>
                <Link href="/viral-load/collect-sample">
                  <button 
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Collect Sample
                  </button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Package Samples */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle style={{ color: colors.primaryDark }}>Package Samples</CardTitle>
                  <p className="text-sm text-gray-600">Group collected samples for processing</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: colors.primary, color: 'white' }}>
                Step 3
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Create package identifiers and group multiple samples together for batch processing and transportation.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">{stats.packaged} Packaged</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Ready for Lab</span>
                </div>
              </div>
              <Link href="/viral-load/package-samples">
                <button 
                  className="w-full md:w-auto px-6 py-3 rounded-lg text-white font-medium transition-colors"
                  style={{ backgroundColor: colors.primary }}
                >
                  Package Samples
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Flow Indicator */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Viral Load Workflow</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: colors.primary }}
              >
                1
              </div>
              <span className="text-sm font-medium text-gray-900">New Request</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: colors.primary }}
              >
                2
              </div>
              <span className="text-sm font-medium text-gray-900">Sample Collection</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: colors.primary }}
              >
                3
              </div>
              <span className="text-sm font-medium text-gray-900">Package Samples</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 