"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconBabyCarriage, IconTestPipe, IconCalendar, IconUsers } from "@tabler/icons-react";

export default function EIDPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50/30 py-4 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <IconBabyCarriage className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Early Infant Diagnosis</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">HIV testing for infants and young children</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <IconTestPipe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-sm text-gray-600">Pending Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <IconCalendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <IconUsers className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1,245</p>
                  <p className="text-sm text-gray-600">Total Infants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <IconBabyCarriage className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">89.2%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent EID Requests */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-blue-500 border-b border-blue-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-white text-lg sm:text-xl font-semibold">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white">
                  <IconTestPipe className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                <span>Recent EID Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">Infant #{item.toString().padStart(3, '0')}</p>
                      <p className="text-sm text-gray-600">Mother: Jane Doe</p>
                      <p className="text-xs text-gray-500">DOB: {new Date().toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  View All EID Requests
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-blue-500 border-b border-blue-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-white text-lg sm:text-xl font-semibold">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white">
                  <IconBabyCarriage className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                  New EID Request
                </Button>
                <Button variant="outline" className="w-full h-12">
                  Track Infant
                </Button>
                <Button variant="outline" className="w-full h-12">
                  View Results
                </Button>
                <Button variant="outline" className="w-full h-12">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8">
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <IconBabyCarriage className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">EID Module Coming Soon</h3>
              <p className="text-gray-600 mb-4">
                The Early Infant Diagnosis module is currently under development. Full functionality will be available in the next release.
              </p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                In Development
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 