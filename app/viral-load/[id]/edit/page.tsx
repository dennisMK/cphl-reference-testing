"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Edit, User, MapPin, ArrowLeft, Save, X } from "lucide-react"
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

interface User {
  id: number;
  username: string;
  name: string;
  email: string | null;
  facility_id: number | null;
  facility_name: string | null;
  hub_id: number | null;
  hub_name: string | null;
}

export default function EditSamplePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = React.useState<User | null>(null);
  
  // Get sample data
  const sample = sampleData[params.id as keyof typeof sampleData]

  // Form state - initialize with existing data
  const [patientName, setPatientName] = React.useState(sample?.patientName || "")
  const [artNumber, setArtNumber] = React.useState(sample?.artNumber || "")
  const [patientClinicId, setPatientClinicId] = React.useState(sample?.patientClinicId || "")
  const [gender, setGender] = React.useState(sample?.gender || "")
  const [age, setAge] = React.useState(sample?.age?.toString() || "")
  const [contactNumber, setContactNumber] = React.useState(sample?.contactNumber || "")
  const [clinician, setClinician] = React.useState(sample?.clinician || "")
  const [sampleId, setSampleId] = React.useState(sample?.sampleId || "")
  const [barcode, setBarcode] = React.useState(sample?.barcode || "")
  const [sampleType, setSampleType] = React.useState(sample?.sampleType || "")
  const [dateCollected, setDateCollected] = React.useState("")
  const [timeCollected, setTimeCollected] = React.useState("")
  const [collectedBy, setCollectedBy] = React.useState("")
  const [centrifugationTime, setCentrifugationTime] = React.useState("")
  const [storageConsent, setStorageConsent] = React.useState("")
  const [processingNotes, setProcessingNotes] = React.useState("")
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Fetch user data on component mount
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically make an API call to update the sample
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Updating sample...",
        success: "Sample updated successfully!",
        error: "Failed to update sample",
      }
    )

    // After successful update, navigate back to sample details
    setTimeout(() => {
      router.push(`/viral-load/${sample.id}`)
    }, 2500)
  }

  const handleCancel = () => {
    router.push(`/viral-load/${sample.id}`)
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
            <div className="flex items-center gap-2">
              <Edit className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold">Edit Sample</h1>
            </div>
            <p className="text-muted-foreground">Modify sample information and details</p>
          </div>
        </div>
        
        <Badge variant="outline" className="text-sm">
          ID: {sample.sampleId}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input
                  id="patient-name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="art-number">ART Number</Label>
                <Input
                  id="art-number"
                  value={artNumber}
                  onChange={(e) => setArtNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-clinic-id">Patient Clinic ID</Label>
                <Input
                  id="patient-clinic-id"
                  value={patientClinicId}
                  onChange={(e) => setPatientClinicId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="0"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+256-xxx-xxxxxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinician">Clinician</Label>
              <Input
                id="clinician"
                value={clinician}
                onChange={(e) => setClinician(e.target.value)}
                placeholder="Dr. Name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Facility Information - Display Only */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Facility Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-700">Health Facility</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {user?.facility_name || "Not specified"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">District</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {user?.hub_name ? user.hub_name.split(' ')[0] : "Not specified"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Hub</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {user?.hub_name || "Not specified"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sample-id">Sample ID</Label>
                <Input
                  id="sample-id"
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample-type">Sample Type</Label>
                <Select value={sampleType} onValueChange={setSampleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sample type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plasma">Plasma</SelectItem>
                    <SelectItem value="Dried Blood Spot">Dried Blood Spot</SelectItem>
                    <SelectItem value="Whole Blood">Whole Blood</SelectItem>
                    <SelectItem value="Serum">Serum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={sample?.priority || ""} onValueChange={(value) => {
                  // Handle priority change
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine">Routine</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={sample?.status || ""} onValueChange={(value) => {
                  // Handle status change
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="collected">Collected</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage-consent">Storage Consent</Label>
                <Select value={storageConsent} onValueChange={setStorageConsent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select consent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storage-location">Storage Location</Label>
                <Input
                  id="storage-location"
                  value={sample?.storageLocation || ""}
                  onChange={(e) => {
                    // Handle storage location change
                  }}
                  placeholder="e.g., Freezer A, Shelf 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collected-by">Collected By</Label>
                <Input
                  id="collected-by"
                  value={collectedBy}
                  onChange={(e) => setCollectedBy(e.target.value)}
                  placeholder="Name of collector"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Information */}
        <Card>
          <CardHeader>
            <CardTitle>Date Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date Collected</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateCollected && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateCollected ? format(new Date(dateCollected), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateCollected ? new Date(dateCollected) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setDateCollected(date.toISOString().split('T')[0]);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Date Received</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateReceived && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateReceived ? format(new Date(dateReceived), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateReceived ? new Date(dateReceived) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setDateReceived(date.toISOString().split('T')[0]);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Centrifugation Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !centrifugationTime && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {centrifugationTime ? format(new Date(centrifugationTime), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={centrifugationTime ? new Date(centrifugationTime) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setCentrifugationTime(date.toISOString().split('T')[0]);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Processing Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="processing-notes">Notes</Label>
              <Textarea
                id="processing-notes"
                value={processingNotes}
                onChange={(e) => setProcessingNotes(e.target.value)}
                placeholder="Enter any processing notes or comments..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </main>
  )
} 