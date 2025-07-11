"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  IconTestPipe, 
  IconBabyCarriage, 
  IconVirus, 
  IconMedicalCross,
  IconFlask,
  IconDna,
  IconStethoscope
} from "@tabler/icons-react"

const testingStats = [
  {
    id: "viral-load",
    title: "Viral Load",
    icon: IconTestPipe,
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-blue-800",
    tests: 1456,
    pending: 67,
    regions: ["Kampala", "Wakiso", "Mukono"]
  },
  {
    id: "eid",
    title: "Early Infant Diagnosis", 
    icon: IconBabyCarriage,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200", 
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    titleColor: "text-green-800",
    tests: 691,
    pending: 20,
    regions: ["Central", "Eastern"]
  },
  {
    id: "cd4",
    title: "CD4 Count",
    icon: IconFlask,
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconBg: "bg-purple-100", 
    iconColor: "text-purple-600",
    titleColor: "text-purple-800",
    tests: 892,
    pending: 45,
    regions: ["Northern", "Western"]
  },
  {
    id: "tb-test",
    title: "TB Testing",
    icon: IconStethoscope,
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600", 
    titleColor: "text-orange-800",
    tests: 234,
    pending: 12,
    regions: ["Central", "Northern"]
  },
  {
    id: "resistance",
    title: "Drug Resistance",
    icon: IconDna,
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleColor: "text-red-800", 
    tests: 156,
    pending: 8,
    regions: ["Kampala", "Gulu"]
  },
  {
    id: "hepatitis",
    title: "Hepatitis B/C",
    icon: IconVirus,
    color: "yellow",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-800",
    tests: 445,
    pending: 23,
    regions: ["Eastern", "Western"]
  }
]

export function DashboardStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testingStats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <Card key={stat.id} className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-md transition-shadow`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <IconComponent className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              </div>
              <CardTitle className={`text-lg font-semibold ${stat.titleColor}`}>
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.tests.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Total Tests
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {stat.pending}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Pending
                    </div>
                  </div>
                </div>

                {/* Affected Regions */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Active Regions
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {stat.regions.map((region) => (
                      <Badge 
                        key={region}
                        variant="outline" 
                        className="text-xs px-2 py-1"
                      >
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 