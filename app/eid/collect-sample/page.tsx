"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { IconTestPipe, IconArrowLeft, IconSearch, IconEdit } from '@tabler/icons-react'
import Link from 'next/link'

// Sample data for EID requests pending collection
const eidRequests = [
  {
    id: "EID-001234",
    infantName: "Baby Nakato",
    mothersName: "Sarah Nakato",
    facility: "Mulago Hospital",
    district: "Kampala",
    testType: "Initial Test",
    priority: "Routine",
    requestDate: "2024-01-15",
    status: "Pending Collection",
    age: "8 weeks"
  },
  {
    id: "EID-001235", 
    infantName: "Baby Okello",
    mothersName: "Grace Okello",
    facility: "Gulu Hospital",
    district: "Gulu",
    testType: "Follow-up",
    priority: "Urgent",
    requestDate: "2024-01-14",
    status: "Pending Collection",
    age: "16 weeks"
  },
  {
    id: "EID-001236",
    infantName: "Baby Nabirye",
    mothersName: "Ruth Nabirye", 
    facility: "Mbale Hospital",
    district: "Mbale",
    testType: "Confirmatory",
    priority: "Routine",
    requestDate: "2024-01-13",
    status: "Pending Collection",
    age: "15 months"
  },
  {
    id: "EID-001237",
    infantName: "Baby Musoke",
    mothersName: "Jane Musoke",
    facility: "Mbarara Hospital",
    district: "Mbarara", 
    testType: "Initial Test",
    priority: "STAT",
    requestDate: "2024-01-12",
    status: "Pending Collection",
    age: "6 weeks"
  },
  {
    id: "EID-001238",
    infantName: "Baby Lwanga",
    mothersName: "Mary Lwanga",
    facility: "Butabika Hospital",
    district: "Kampala",
    testType: "Follow-up",
    priority: "Routine",
    requestDate: "2024-01-11",
    status: "Ready for Collection",
    age: "12 weeks"
  }
]

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending Collection":
        return "bg-orange-100 text-orange-800"
      case "Ready for Collection":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Badge className={`${getStatusStyle(status)} text-xs`}>
      {status}
    </Badge>
  )
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "STAT":
        return "bg-red-500 text-white"
      case "Urgent":
        return "bg-orange-500 text-white"
      case "Routine":
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

export default function CollectSamplePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/eid">
            <Button variant="ghost" size="sm" className="p-2">
              <IconArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500">
              <IconTestPipe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Collect Samples</h1>
              <p className="text-gray-600">EID requests ready for sample collection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by ID, infant name, or facility..." 
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {eidRequests.length} requests pending
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Request ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Infant Details</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Mother's Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Facility</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Test Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eidRequests.map((request) => (
                <tr 
                  key={request.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => window.location.href = `/eid/${request.id}/edit`}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-blue-600">
                      {request.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{request.infantName}</div>
                      <div className="text-sm text-gray-500">Age: {request.age}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{request.mothersName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-gray-900">{request.facility}</div>
                      <div className="text-sm text-gray-500">{request.district}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{request.testType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={request.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{request.requestDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/eid/${request.id}/edit`} onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="p-2">
                        <IconEdit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Click on any row to edit the request details or collect samples
      </div>
    </div>
  )
} 