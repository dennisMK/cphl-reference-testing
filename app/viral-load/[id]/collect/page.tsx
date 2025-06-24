"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Package, MapPin } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

// Mock data - in real app this would come from API
const sampleData = {
  VL001: {
    id: "VL001",
    artNumber: "ART-2024-001",
    sampleId: "VL-001-2024",
    sampleType: "Plasma",
    dateCollected: "2024-01-15",
    dateReceived: null,
    status: "pending",
    patientName: "John Doe",
    facility: "Mulago Hospital",
    district: "Kampala",
    hub: "Kampala Hub",
    patientClinicId: "95/24",
    gender: "Male",
    requestedOn: "17 Jun 2025"
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
    requestedOn: "16 Jun 2025"
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
    requestedOn: "15 Jun 2025"
  },
}

export default function CollectSamplePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [collectionDateTime, setCollectionDateTime] = React.useState<Date>()
  const [centrifugationDateTime, setCentrifugationDateTime] = React.useState<Date>()
  const [sampleIdBarcode, setSampleIdBarcode] = React.useState("")
  const [sampleType, setSampleType] = React.useState("")
  const [specimenName, setSpecimenName] = React.useState("")
  const [storageConsent, setStorageConsent] = React.useState("")

  // Get sample data
  const sample = sampleData[params.id as keyof typeof sampleData]

  if (!sample) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sample Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested sample could not be found.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically make an API call to update the sample
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Submitting request...",
        success: "Sample collection request submitted successfully!",
        error: "Failed to submit request",
      }
    )

    // After successful collection, navigate back to pending collection
    setTimeout(() => {
      router.push("/viral-load/pending-collection")
    }, 2500)
  }

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "MM/dd/yyyy HH:mm")
  }

  return (
    <div className="">
      {/* Header with title and actions */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Sample Collection
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Complete the viral load sample collection form
            </p>
          </div>
        
        </div>
      </div>

      {/* Facility Information Banner */}
      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center gap-2 text-red-800">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">
            Facility: {sample.facility} | District: {sample.district} | Hub: {sample.hub}
          </span>
        </div>
      </div>

      <div className="">
        <form id="collection-form" onSubmit={handleSubmit} className="space-y-8">

          {/* Request Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Request Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="patient-clinic-id" className="text-sm font-medium text-gray-700">
                  Patient Clinic ID/ART #
                </Label>
                <Input
                  id="patient-clinic-id"
                  value={sample.patientClinicId}
                  readOnly
                  className="mt-2 h-10 bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select value={sample.gender} disabled>
                  <SelectTrigger className="mt-2 h-10 bg-gray-50 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="requested-on" className="text-sm font-medium text-gray-700">
                  Requested on
                </Label>
                <Input
                  id="requested-on"
                  value={sample.requestedOn}
                  readOnly
                  className="mt-2 h-10 bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Sample Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Sample Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="collection-datetime" className="text-sm font-medium text-gray-700">
                  Date and time of collection
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 h-10",
                        !collectionDateTime && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {collectionDateTime ? formatDateTime(collectionDateTime) : "mm/dd/yyyy H:M"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={collectionDateTime}
                      onSelect={setCollectionDateTime}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="sample-barcode" className="text-sm font-medium text-gray-700">
                  Sample ID/Barcode
                </Label>
                <Input
                  id="sample-barcode"
                  value={sampleIdBarcode}
                  onChange={(e) => setSampleIdBarcode(e.target.value)}
                  placeholder="Enter sample barcode"
                  className="mt-2 h-10"
                  required
                />
              </div>

              <div>
                <Label htmlFor="sample-type" className="text-sm font-medium text-gray-700">
                  Sample Type
                </Label>
                <Select value={sampleType} onValueChange={setSampleType}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plasma">Plasma</SelectItem>
                    <SelectItem value="dried-blood-spot">Dried Blood Spot</SelectItem>
                    <SelectItem value="whole-blood">Whole Blood</SelectItem>
                    <SelectItem value="serum">Serum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="centrifugation-datetime" className="text-sm font-medium text-gray-700">
                  Date and time of centrifugation
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 h-10",
                        !centrifugationDateTime && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {centrifugationDateTime ? formatDateTime(centrifugationDateTime) : "mm/dd/yyyy H:M"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={centrifugationDateTime}
                      onSelect={setCentrifugationDateTime}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="specimen-name" className="text-sm font-medium text-gray-700">
                  Specimen Name
                </Label>
                <Input
                  id="specimen-name"
                  value={specimenName}
                  onChange={(e) => setSpecimenName(e.target.value)}
                  placeholder="Enter specimen name"
                  className="mt-2 h-10"
                />
              </div>

              <div>
                <Label htmlFor="storage-consent" className="text-sm font-medium text-gray-700">
                  Specimen Storage Consent
                </Label>
                <Select value={storageConsent} onValueChange={setStorageConsent}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bottom Submit Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-end space-x-4">
              <Link href="/viral-load/pending-collection">
                <Button variant="outline" className="h-10 px-6">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 h-10 px-8"
              >
                Submit Collection
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 