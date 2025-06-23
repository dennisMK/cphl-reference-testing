"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Plus, Clock, CheckCircle, AlertTriangle, TrendingUp, Users, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

const statsData = [
  {
    title: "Total Requests",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: TestTube,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    title: "Pending Collection",
    value: "23",
    change: "+5%",
    trend: "up", 
    icon: Clock,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600"
  },
  {
    title: "Completed Tests",
    value: "1,189",
    change: "+8%",
    trend: "up",
    icon: CheckCircle,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600"
  },
  {
    title: "Average TAT",
    value: "3.2 days",
    change: "-15%",
    trend: "down",
    icon: TrendingUp,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600"
  }
];

const quickActions = [
  {
    title: "New Request",
    description: "Create a new viral load test request",
    href: "/viral-load/new-request",
    icon: Plus,
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600"
  },
  {
    title: "Pending Collection",
    description: "View requests awaiting sample collection",
    href: "/viral-load/pending-collection",
    icon: Clock,
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600"
  },
  {
    title: "View All Requests",
    description: "Browse all viral load requests",
    href: "/viral-load/all-requests",
    icon: TestTube,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600"
  }
];

const recentActivity = [
  {
    id: "VL-001789",
    patient: "Patient #P001234",
    action: "Sample collected",
    time: "2 hours ago",
    status: "collected",
    facility: "Butabika Hospital"
  },
  {
    id: "VL-001788",
    patient: "Patient #P001235",
    action: "Request created",
    time: "4 hours ago",
    status: "pending",
    facility: "Mulago Hospital"
  },
  {
    id: "VL-001787",
    patient: "Patient #P001236",
    action: "Results available",
    time: "6 hours ago",
    status: "completed",
    facility: "Butabika Hospital"
  }
];

export default function ViralLoadPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
              <TestTube className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Viral Load Management</h1>
              <p className="text-lg text-gray-600 mt-1">Monitor and manage HIV viral load testing workflow</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 px-3 py-1">
              <Calendar className="h-3 w-3 mr-1" />
              Active System
            </Badge>
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <div className="flex items-baseline space-x-2">
                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                      <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <Plus className="h-5 w-5 text-red-600" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Link key={index} href={action.href}>
                        <div className="group p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/50 transition-all duration-200 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                                  {action.title}
                                </h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'completed' ? 'bg-green-500' :
                        activity.status === 'collected' ? 'bg-blue-500' : 'bg-orange-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.id}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">{activity.facility}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link href="/viral-load/activity">
                    <Button variant="outline" className="w-full border-gray-300 hover:border-red-300 hover:bg-red-50">
                      View All Activity
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Workflow Status */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                Workflow Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 1: Request</h3>
                  <p className="text-sm text-gray-600">Create new viral load test requests with complete patient information</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TestTube className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 2: Collection</h3>
                  <p className="text-sm text-gray-600">Collect and process specimens following standard protocols</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 3: Results</h3>
                  <p className="text-sm text-gray-600">Review and report test results to requesting clinicians</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 