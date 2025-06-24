"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconTestPipe, IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// EID Request type
type EIDRequest = {
  id: string
  infantName: string
  mothersName: string
  facility: string
  district: string
  testType: "Initial Test" | "Follow-up" | "Confirmatory"
  priority: "STAT" | "Urgent" | "Routine"
  requestDate: string
  status: "Pending Collection" | "Ready for Collection" | "Collected" | "Processing"
  age: string
  expNo?: string
  sex?: "MALE" | "FEMALE"
}

// Mock data - in real app this would come from API
const mockRequest: EIDRequest = {
  id: "EID-001234",
  infantName: "Baby Nakato",
  mothersName: "Sarah Nakato",
  facility: "Mulago Hospital",
  district: "Kampala",
  testType: "Initial Test",
  priority: "Routine",
  requestDate: "2024-01-15",
  status: "Pending Collection",
  age: "8 weeks",
  expNo: "085",
  sex: "MALE"
}

export default function CollectSamplePage() {
  const params = useParams()
  const requestId = params.id as string

  const [formData, setFormData] = React.useState({
    barcodeNumber: '',
    collectionDate: '',
    dispatchDate: '',
    requestedBy: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Collecting sample for:', requestId, formData)
    // In real app, this would make an API call to save the collection data
    // Then redirect back to the collect-sample list
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/eid/collect-sample">
          <Button variant="ghost" size="sm" className="p-2">
            <IconArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500">
            <IconTestPipe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collect Sample</h1>
            <p className="text-gray-600">Sample collection for {requestId}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Infant Details Section */}
        <Card>
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle>Infant Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="infantName" className="text-sm font-medium text-gray-700">
                  Infant Name:
                </Label>
                <Input
                  id="infantName"
                  value={mockRequest.infantName}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="expNo" className="text-sm font-medium text-gray-700">
                  EXP No:
                </Label>
                <Input
                  id="expNo"
                  value={mockRequest.expNo || "085"}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="sex" className="text-sm font-medium text-gray-700">
                  Sex:
                </Label>
                <Input
                  id="sex"
                  value={mockRequest.sex || "MALE"}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Information Section */}
        <Card>
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="barcodeNumber" className="text-sm font-medium text-gray-700">
                  Barcode Number: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="barcodeNumber"
                  value={formData.barcodeNumber}
                  onChange={(e) => handleInputChange('barcodeNumber', e.target.value)}
                  className="mt-1"
                  placeholder="Enter barcode number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="collectionDate" className="text-sm font-medium text-gray-700">
                  Collection date: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={formData.collectionDate}
                  onChange={(e) => handleInputChange('collectionDate', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dispatchDate" className="text-sm font-medium text-gray-700">
                  Dispatch date:
                </Label>
                <Input
                  id="dispatchDate"
                  type="date"
                  value={formData.dispatchDate}
                  onChange={(e) => handleInputChange('dispatchDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestedBy" className="text-sm font-medium text-gray-700">
                  Requested by: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="requestedBy"
                  value={formData.requestedBy}
                  onChange={(e) => handleInputChange('requestedBy', e.target.value)}
                  className="mt-1"
                  placeholder="Enter requester name"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Link href="/eid/collect-sample">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
} 