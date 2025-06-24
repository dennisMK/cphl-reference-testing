"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Package, 
  Clock, 
  ArrowLeft,
  Edit,
  Download,
  Printer
} from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data - in real app this would come from API
const sampleData = {
  VL001: {
    id: "VL001",
    artNumber: "ART-2024-001",
    sampleId: "VL-001-2024",
    sampleType: "Plasma",
    dateCollected: "2024-01-15",
    dateReceived: "2024-01-16",
    status: "pending",
    patientName: "John Doe",
    facility: "Mulago Hospital",
    district: "Kampala",
    hub: "Kampala Hub",
    patientClinicId: "95/24",
    gender: "Male",
    requestedOn: "17 Jun 2025",
    age: 34,
    contactNumber: "+256-700-123456",
    collectedBy: "Dr. Sarah Wilson",
    processingNotes: "Sample awaiting processing",
    storageLocation: "Freezer A, Shelf 2",
    barcode: "VL001234567890",
    testType: "Viral Load",
    priority: "Routine",
    clinician: "Dr. Michael Johnson",
    centrifugationTime: "2024-01-15 14:30",
    storageConsent: "Yes"
  },
  VL002: {
    id: "VL002", 
    artNumber: "ART-2024-002",
    sampleId: "VL-002-2024",
    sampleType: "Dried Blood Spot",
    dateCollected: "2024-01-14",
    dateReceived: "2024-01-15",
    status: "collected",
    patientName: "Jane Smith",
    facility: "Butabika Hospital",
    district: "Kampala",
    hub: "Kampala Hub",
    patientClinicId: "102/24",
    gender: "Female",
    requestedOn: "16 Jun 2025",
    age: 28,
    contactNumber: "+256-700-234567",
    collectedBy: "Nurse Mary Nakato",
    processingNotes: "Sample collected and ready for testing",
    storageLocation: "Freezer B, Shelf 1",
    barcode: "VL002345678901",
    testType: "Viral Load",
    priority: "Urgent",
    clinician: "Dr. Peter Mukasa",
    centrifugationTime: "2024-01-14 16:45",
    storageConsent: "Yes"
  },
  VL003: {
    id: "VL003",
    artNumber: "ART-2024-003", 
    sampleId: "VL-003-2024",
    sampleType: "Plasma",
    dateCollected: "2024-01-13",
    dateReceived: null,
    status: "pending",
    patientName: "Bob Johnson",
    facility: "Kiruddu Hospital",
    district: "Wakiso",
    hub: "Wakiso Hub",
    patientClinicId: "78/24",
    gender: "Male",
    requestedOn: "15 Jun 2025",
    age: 42,
    contactNumber: "+256-700-345678",
    collectedBy: null,
    processingNotes: "Pending collection",
    storageLocation: null,
    barcode: "VL003456789012",
    testType: "Viral Load",
    priority: "Routine",
    clinician: "Dr. Grace Nalongo",
    centrifugationTime: null,
    storageConsent: "Pending"
  },
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="text-orange-600 bg-orange-50">Pending Collection</Badge>
    case "collected":
      return <Badge variant="secondary" className="text-blue-600 bg-blue-50">Collected</Badge>
    case "processing":
      return <Badge variant="secondary" className="text-purple-600 bg-purple-50">Processing</Badge>
    case "completed":
      return <Badge variant="secondary" className="text-green-600 bg-green-50">Completed</Badge>
    case "rejected":
      return <Badge variant="secondary" className="text-red-600 bg-red-50">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return <Badge variant="destructive">Urgent</Badge>
    case "High":
      return <Badge variant="secondary" className="text-orange-600 bg-orange-50">High</Badge>
    case "Routine":
      return <Badge variant="outline">Routine</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

export default function SampleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  // Get sample data
  const sample = sampleData[params.id as keyof typeof sampleData]

  if (!sample) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sample Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested sample could not be found.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{sample.sampleId}</h1>
            <p className="text-muted-foreground">Viral Load Sample Details</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge(sample.status)}
          {getPriorityBadge(sample.priority)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/viral-load/${sample.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Sample
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print Label
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
                <p className="font-medium">{sample.patientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ART Number</p>
                <p className="font-medium">{sample.artNumber}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                <p className="font-medium">{sample.patientClinicId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="font-medium">{sample.gender}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p className="font-medium">{sample.age} years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact</p>
                <p className="font-medium">{sample.contactNumber}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Clinician</p>
              <p className="font-medium">{sample.clinician}</p>
            </div>
          </CardContent>
        </Card>

        {/* Facility Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Facility Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Health Facility</p>
              <p className="font-medium">{sample.facility}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">District</p>
                <p className="font-medium">{sample.district}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hub</p>
                <p className="font-medium">{sample.hub}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Test Type</p>
                <p className="font-medium">{sample.testType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                {getPriorityBadge(sample.priority)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Sample Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sample ID</p>
                <p className="font-mono text-sm font-medium">{sample.sampleId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Barcode</p>
                <p className="font-mono text-sm">{sample.barcode}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sample Type</p>
                <Badge variant="outline">{sample.sampleType}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Consent</p>
                <Badge variant={sample.storageConsent === "Yes" ? "secondary" : "outline"}>
                  {sample.storageConsent}
                </Badge>
              </div>
            </div>

            {sample.storageLocation && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Location</p>
                <p className="font-medium">{sample.storageLocation}</p>
              </div>
            )}

            {sample.collectedBy && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collected By</p>
                <p className="font-medium">{sample.collectedBy}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline & Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline & Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Requested</span>
                </div>
                <span className="text-sm">{sample.requestedOn}</span>
              </div>

              {sample.dateCollected && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Collected</span>
                  </div>
                  <span className="text-sm">{new Date(sample.dateCollected).toLocaleDateString()}</span>
                </div>
              )}

              {sample.centrifugationTime && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Centrifuged</span>
                  </div>
                  <span className="text-sm">{sample.centrifugationTime}</span>
                </div>
              )}

              {sample.dateReceived && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Received</span>
                  </div>
                  <span className="text-sm">{new Date(sample.dateReceived).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Notes */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Processing Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{sample.processingNotes}</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {sample.status === "pending" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={() => router.push(`/viral-load/${sample.id}/collect`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Package className="h-4 w-4 mr-2" />
                Collect Sample
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push(`/viral-load/${sample.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
} 