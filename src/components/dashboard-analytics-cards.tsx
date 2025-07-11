"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  IconTestPipe, 
  IconBabyCarriage, 
  IconArrowUpRight,
  IconClock
} from "@tabler/icons-react"

interface AnalyticsCardProps {
  onShowMore?: (type: 'viral-load' | 'eid') => void
}

const recentViralLoadRequests = [
  {
    id: "VL-001789",
    patient: "Patient #4789",
    status: "Completed",
    tat: "48hrs",
    priority: "Routine",
    facility: "Mulago Hospital"
  },
  {
    id: "VL-001788", 
    patient: "Patient #4788",
    status: "Processing",
    tat: "24hrs",
    priority: "Urgent",
    facility: "Butabika Hospital"
  },
  {
    id: "VL-001787",
    patient: "Patient #4787", 
    status: "Collected",
    tat: "72hrs",
    priority: "Routine",
    facility: "Mulago Hospital"
  }
]

const recentEIDRequests = [
  {
    id: "EID-000234",
    patient: "Infant #2234",
    status: "Review", 
    tat: "5 days",
    priority: "Standard",
    facility: "Mbale Hospital"
  },
  {
    id: "EID-000233",
    patient: "Infant #2233",
    status: "Completed",
    tat: "3 days", 
    priority: "Urgent",
    facility: "Gulu Hospital"
  },
  {
    id: "EID-000232",
    patient: "Infant #2232",
    status: "Processing",
    tat: "4 days",
    priority: "Standard", 
    facility: "Mbale Hospital"
  }
]

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Processing": 
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Collected":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "Pending":
        return "bg-red-100 text-red-800 border-red-200"
      case "Review":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Badge className={`${getStatusStyle(status)} font-medium text-xs`}>
      {status}
    </Badge>
  )
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500 text-white"
      case "High":
        return "bg-orange-500 text-white" 
      case "Routine":
      case "Standard":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Badge className={`${getPriorityStyle(priority)} text-xs`}>
      {priority}
    </Badge>
  )
}

export function DashboardAnalyticsCards({ onShowMore }: AnalyticsCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Viral Load Analytics Card */}
      <Card 
        className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 cursor-pointer hover:shadow-lg transition-all duration-200 group"
        onClick={() => onShowMore?.('viral-load')}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-red-800 flex items-center">
              <div className="p-2 bg-red-200 rounded-lg mr-3">
                <IconTestPipe className="h-5 w-5 text-red-700" />
              </div>
              Viral Load Testing
            </CardTitle>
            <IconArrowUpRight className="h-5 w-5 text-red-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <p className="text-sm text-red-700">HIV viral load monitoring system</p>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-red-200/50 rounded-lg border border-red-300">
              <div className="text-xl font-bold text-red-800">1,456</div>
              <div className="text-xs text-red-700 font-medium">Total</div>
            </div>
            <div className="text-center p-3 bg-green-200/50 rounded-lg border border-green-300">
              <div className="text-xl font-bold text-green-800">1,389</div>
              <div className="text-xs text-green-700 font-medium">Complete</div>
            </div>
            <div className="text-center p-3 bg-orange-200/50 rounded-lg border border-orange-300">
              <div className="text-xl font-bold text-orange-800">67</div>
              <div className="text-xs text-orange-700 font-medium">Pending</div>
            </div>
            <div className="text-center p-3 bg-blue-200/50 rounded-lg border border-blue-300">
              <div className="text-xl font-bold text-blue-800">3.2</div>
              <div className="text-xs text-blue-700 font-medium">Avg TAT</div>
            </div>
          </div>
          
          {/* Recent Requests */}
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-red-800 text-sm flex items-center">
              <IconClock className="h-4 w-4 mr-1" />
              Recent Requests
            </h4>
            {recentViralLoadRequests.map((request) => (
              <div
                key={request.id}
                className="p-3 bg-white/70 rounded-lg border border-red-200 hover:bg-white/90 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-red-700">
                      {request.id}
                    </span>
                    <PriorityBadge priority={request.priority} />
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{request.patient}</span>
                  <span>TAT: {request.tat}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {request.facility}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* EID Analytics Card */}
      <Card 
        className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-200 group"
        onClick={() => onShowMore?.('eid')}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-blue-800 flex items-center">
              <div className="p-2 bg-blue-200 rounded-lg mr-3">
                <IconBabyCarriage className="h-5 w-5 text-blue-700" />
              </div>
              Early Infant Diagnosis
            </CardTitle>
            <IconArrowUpRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <p className="text-sm text-blue-700">EID testing for HIV-exposed infants</p>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-blue-200/50 rounded-lg border border-blue-300">
              <div className="text-xl font-bold text-blue-800">691</div>
              <div className="text-xs text-blue-700 font-medium">Total</div>
            </div>
            <div className="text-center p-3 bg-green-200/50 rounded-lg border border-green-300">
              <div className="text-xl font-bold text-green-800">671</div>
              <div className="text-xs text-green-700 font-medium">Complete</div>
            </div>
            <div className="text-center p-3 bg-orange-200/50 rounded-lg border border-orange-300">
              <div className="text-xl font-bold text-orange-800">20</div>
              <div className="text-xs text-orange-700 font-medium">Pending</div>
            </div>
            <div className="text-center p-3 bg-purple-200/50 rounded-lg border border-purple-300">
              <div className="text-xl font-bold text-purple-800">4.1</div>
              <div className="text-xs text-purple-700 font-medium">Avg TAT</div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-blue-800 text-sm flex items-center">
              <IconClock className="h-4 w-4 mr-1" />
              Recent Requests
            </h4>
            {recentEIDRequests.map((request) => (
              <div
                key={request.id}
                className="p-3 bg-white/70 rounded-lg border border-blue-200 hover:bg-white/90 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-blue-700">
                      {request.id}
                    </span>
                    <PriorityBadge priority={request.priority} />
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{request.patient}</span>
                  <span>TAT: {request.tat}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {request.facility}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 