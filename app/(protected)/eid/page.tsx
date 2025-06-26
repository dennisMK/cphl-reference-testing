"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TestTube, Clock, CheckCircle, FileText, Package } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EIDPage() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = api.eid.getDashboardStats.useQuery();

  const actions = [
    { 
      title: "New Test Request", 
      icon: Plus, 
      href: "/eid/new-request", 
      action: "create",
      description: "Create a new EID test request for infant HIV diagnosis"
    },
    { 
      title: "Collect Sample", 
      icon: TestTube, 
      href: "/eid/collect-sample", 
      action: "view",
      description: "Collect and register biological samples for testing"
    }
  ];

  return (
    <main className="md:container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Early Infant Diagnosis (EID)</h1>
        <p className="text-muted-foreground">Request for EID testing and access results electronically for infant HIV diagnosis.</p>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Pending Collection</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-orange-600">{stats?.pendingSamples || 0}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Collected</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-blue-600">{stats?.collectedSamples || 0}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-green-600">{stats?.completedSamples || 0}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Samples</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-purple-600">{stats?.totalSamples || 0}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <Link href={action.href}>
                  <Button
                  size={"lg"}
                    variant={action.action === "create" ? "default" : "outline"}
                    className={`cursor-pointer rounded-xl w-full ${action.action === "create" ? "bg-blue-600 hover:bg-blue-700" : ""}`}>
                    {action.action === "create" ? "Create" : "View"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/eid/collect-sample">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <TestTube className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium">Pending Collections</p>
                  <p className="text-sm text-gray-600">
                    {statsLoading ? "Loading..." : `${stats?.pendingSamples || 0} samples awaiting collection`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/eid/results">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium">View Results</p>
                  <p className="text-sm text-gray-600">
                    {statsLoading ? "Loading..." : `${stats?.completedSamples || 0} results available`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/eid">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium">All Requests</p>
                  <p className="text-sm text-gray-600">
                    {statsLoading ? "Loading..." : `${stats?.totalSamples || 0} total EID requests`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
