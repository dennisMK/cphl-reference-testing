"use client";

import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, List, Package, ArrowLeft, Users, Clock, CheckCircle, Baby } from "lucide-react";
import Link from "next/link";

export default function EIDPage() {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('eid');

  // Mock data for statistics
  const stats = {
    totalRequests: 892,
    pendingCollection: 89,
    packaged: 67,
    thisWeek: 23
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
            <h1 className="text-2xl font-bold text-gray-900">Early Infant Diagnosis (EID)</h1>
            <p className="text-gray-600">Manage infant HIV testing workflow</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-xl font-bold text-gray-900">{stats.totalRequests}</div>
          <div className="text-sm text-gray-500">Total Tests</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-xl font-bold text-yellow-600">{stats.pendingCollection}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-xl font-bold text-green-600">{stats.packaged}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-xl font-bold" style={{ color: colors.primary }}>{stats.thisWeek}</div>
          <div className="text-sm text-gray-500">This Week</div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card className="border-2 border-dashed" style={{ borderColor: colors.primary }}>
          <CardContent className="p-8 text-center">
            <Baby className="h-16 w-16 mx-auto mb-4" style={{ color: colors.primary }} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">EID Module Coming Soon</h3>
            <p className="text-gray-600 mb-4">
              Early Infant Diagnosis functionality is currently under development. 
              This module will provide comprehensive HIV testing for infants born to HIV-positive mothers.
            </p>
            <Badge style={{ backgroundColor: colors.primaryLight, color: colors.primary, borderColor: colors.primary }}>
              In Development
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Planned Features */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900">Planned EID Features</h3>
        
        {/* 1. New EID Request */}
        <Card className="opacity-75">
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
                  <CardTitle style={{ color: colors.primaryDark }}>New EID Request</CardTitle>
                  <p className="text-sm text-gray-600">Create infant HIV test request</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: colors.primary, color: 'white' }}>
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Register mother and infant details, birth information, feeding status, and testing schedule.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Mother & Infant Info</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Baby className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Age-Based Testing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Infant Tracking */}
        <Card className="opacity-75">
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
                  <CardTitle style={{ color: colors.primaryDark }}>Infant Tracking</CardTitle>
                  <p className="text-sm text-gray-600">Monitor testing schedule and follow-ups</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: colors.primary, color: 'white' }}>
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Track testing milestones at 6 weeks, 14 weeks, 6 months, 12 months, and 18 months.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-500">Scheduled Tests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Follow-up Care</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Results Management */}
        <Card className="opacity-75">
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
                  <CardTitle style={{ color: colors.primaryDark }}>Results Management</CardTitle>
                  <p className="text-sm text-gray-600">Manage test results and next steps</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: colors.primary, color: 'white' }}>
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Process results, determine next testing schedule, and coordinate care for positive cases.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">Result Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Care Coordination</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <div className="mt-12 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need EID Functionality?</h3>
            <p className="text-gray-600 mb-4">
              Contact the development team to request priority access to EID features or provide feedback on requirements.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline">Expected: Q2 2025</Badge>
              <Badge variant="outline">Priority: High</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 