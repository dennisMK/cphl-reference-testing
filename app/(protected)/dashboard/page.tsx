"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TestTube, 
  Baby, 
  CheckCircle, 
  ChevronRight, 
  Clock
} from "lucide-react";
import Link from "next/link";

// Professional medical data for VLM system
const vlmRequests = [
  {
    id: 1,
    sampleId: "VL-001789",
    patient: "Patient #4789",
    status: "Completed",
    tat: "48hrs",
    assignedTo: "Dr. Sarah Nakato",
    priority: "Routine"
  },
  {
    id: 2,
    sampleId: "VL-001788",
    patient: "Patient #4788",
    status: "Processing",
    tat: "24hrs",
    assignedTo: "Dr. Moses Okello",
    priority: "Urgent"
  },
  {
    id: 3,
    sampleId: "VL-001787",
    patient: "Patient #4787",
    status: "Collected",
    tat: "72hrs",
    assignedTo: "Lab Tech",
    priority: "Routine"
  },
  {
    id: 4,
    sampleId: "VL-001786",
    patient: "Patient #4786",
    status: "Pending",
    tat: "24hrs",
    assignedTo: "Unassigned",
    priority: "High"
  }
];

// Professional medical data for EID system  
const eidRequests = [
  {
    id: 1,
    sampleId: "EID-000234",
    patient: "Infant #2234",
    status: "Review",
    tat: "5 days",
    assignedTo: "Dr. Grace Nalwoga",
    priority: "Standard"
  },
  {
    id: 2,
    sampleId: "EID-000233",
    patient: "Infant #2233", 
    status: "Completed",
    tat: "3 days",
    assignedTo: "Dr. James Okwi",
    priority: "Urgent"
  },
  {
    id: 3,
    sampleId: "EID-000232",
    patient: "Infant #2232",
    status: "Processing",
    tat: "4 days", 
    assignedTo: "Dr. Ruth Nabirye",
    priority: "Standard"
  },
  {
    id: 4,
    sampleId: "EID-000230",
    patient: "Infant #2230",
    status: "Collected",
    tat: "24hrs",
    assignedTo: "Lab Tech",
    priority: "High"
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Collected":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Pending":
        return "bg-red-100 text-red-800 border-red-200";
      case "Review":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge className={`${getStatusStyle(status)} font-medium`}>
      {status}
    </Badge>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Routine":
      case "Standard":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Badge className={`${getPriorityStyle(priority)} text-xs`}>
      {priority}
    </Badge>
  );
};

export default function DashboardPage(): React.JSX.Element {
  return (
    <div className="@container/main">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Laboratory Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Uganda Viral Load & EID Management System
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last sync: {new Date().toLocaleTimeString()}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Service Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Viral Load Management */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-red-800 flex items-center">
                <div className="p-2 bg-red-200 rounded-lg mr-3">
                  <TestTube className="h-5 w-5 text-red-700" />
                </div>
                Viral Load Management
              </CardTitle>
              <p className="text-sm text-red-700">HIV viral load monitoring system</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-red-200/50 rounded-lg border border-red-300">
                  <div className="text-2xl font-bold text-red-800">1,456</div>
                  <div className="text-xs text-red-700 font-medium">Total</div>
                </div>
                <div className="text-center p-3 bg-orange-200/50 rounded-lg border border-orange-300">
                  <div className="text-2xl font-bold text-orange-800">67</div>
                  <div className="text-xs text-orange-700 font-medium">Pending</div>
                </div>
                <div className="text-center p-3 bg-green-200/50 rounded-lg border border-green-300">
                  <div className="text-2xl font-bold text-green-800">1,389</div>
                  <div className="text-xs text-green-700 font-medium">Complete</div>
                </div>
              </div>
              
              {/* Recent VLM Requests */}
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-red-800 text-sm">Recent Requests</h4>
                {vlmRequests.slice(0, 3).map((request, index) => (
                  <div
                    key={request.id}
                    className="p-3 bg-white/70 rounded-lg border border-red-200 hover:bg-white/90 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-red-700">
                          {request.sampleId}
                        </span>
                        <PriorityBadge priority={request.priority} />
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{request.patient}</span>
                      <span>TAT: {request.tat}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/viral-load">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <TestTube className="h-4 w-4 mr-2" />
                  Manage Viral Load Tests
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Early Infant Diagnosis */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-blue-800 flex items-center">
                <div className="p-2 bg-blue-200 rounded-lg mr-3">
                  <Baby className="h-5 w-5 text-blue-700" />
                </div>
                Early Infant Diagnosis
              </CardTitle>
              <p className="text-sm text-blue-700">EID testing for HIV-exposed infants</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-200/50 rounded-lg border border-blue-300">
                  <div className="text-2xl font-bold text-blue-800">691</div>
                  <div className="text-xs text-blue-700 font-medium">Total</div>
                </div>
                <div className="text-center p-3 bg-orange-200/50 rounded-lg border border-orange-300">
                  <div className="text-2xl font-bold text-orange-800">20</div>
                  <div className="text-xs text-orange-700 font-medium">Pending</div>
                </div>
                <div className="text-center p-3 bg-green-200/50 rounded-lg border border-green-300">
                  <div className="text-2xl font-bold text-green-800">671</div>
                  <div className="text-xs text-green-700 font-medium">Complete</div>
                </div>
              </div>

              {/* Recent EID Requests */}
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-blue-800 text-sm">Recent Requests</h4>
                {eidRequests.slice(0, 3).map((request, index) => (
                  <div
                    key={request.id}
                    className="p-3 bg-white/70 rounded-lg border border-blue-200 hover:bg-white/90 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-blue-700">
                          {request.sampleId}
                        </span>
                        <PriorityBadge priority={request.priority} />
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{request.patient}</span>
                      <span>TAT: {request.tat}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/eid">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Baby className="h-4 w-4 mr-2" />
                  Manage EID Tests
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
