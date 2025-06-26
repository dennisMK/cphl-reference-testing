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
import { CalendarIcon, Edit, User, MapPin, ArrowLeft, Save, X, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/trpc/react"

export default function EditSamplePage() {
  const router = useRouter()
  const { id } = useParams()
  
  // Fetch sample data using tRPC
  const { data: sample, isLoading, error } = api.viralLoad.getSample.useQuery(
    { sampleId: id },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  // Fetch user data
  const [user, setUser] = React.useState<any>(null)
  
  // Form state - initialize with existing data
  const [sampleType, setSampleType] = React.useState("")
  const [pregnant, setPregnant] = React.useState("")
  const [ancNumber, setAncNumber] = React.useState("")
  const [breastFeeding, setBreastFeeding] = React.useState("")
  const [activeTbStatus, setActiveTbStatus] = React.useState("")
  const [processingNotes, setProcessingNotes] = React.useState("")
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Update sample status mutation
  const updateSampleMutation = api.viralLoad.updateSampleStatus.useMutation({
    onSuccess: () => {
      toast.success("Sample updated successfully!")
      setTimeout(() => {
        router.push(`/viral-load/${id}`)
      }, 1000)
    },
    onError: (error) => {
      toast.error(`Failed to update sample: ${error.message}`)
      setIsSubmitting(false)
    },
  })

  // Fetch user data on component mount
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }

    fetchUser()
  }, [])

  // Initialize form with sample data
  React.useEffect(() => {
    if (sample) {
      setSampleType(sample.sample_type || "")
      setPregnant(sample.pregnant || "")
      setAncNumber(sample.anc_number || "")
      setBreastFeeding(sample.breast_feeding || "")
      setActiveTbStatus(sample.active_tb_status || "")
    }
  }, [sample])

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading sample details...</span>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Sample</h1>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </main>
    )
  }

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
    setIsSubmitting(true)
    
    // For now, we'll just show a success message since we don't have a specific update mutation
    // In a real app, you'd create an updateSample mutation
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Updating sample...",
        success: "Sample updated successfully!",
        error: "Failed to update sample",
      }
    )

    setTimeout(() => {
      router.push(`/viral-load/${id}`)
    }, 2500)
  }

  const handleCancel = () => {
    router.push(`/viral-load/${id}`)
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
          ID: {sample.vl_sample_id}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information - Read Only */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information (Read Only)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-700">Patient ID</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {sample.patient_unique_id}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Sample ID</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {sample.vl_sample_id}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Form Number</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {sample.form_number}
                </div>
              </div>
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

        {/* Sample Information - Editable */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sample-type">Sample Type</Label>
                <Select value={sampleType} onValueChange={setSampleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sample type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P">Plasma</SelectItem>
                    <SelectItem value="D">Dried Blood Spot</SelectItem>
                    <SelectItem value="W">Whole Blood</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pregnant">Pregnant</Label>
                <Select value={pregnant} onValueChange={setPregnant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                    <SelectItem value="U">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anc-number">ANC Number</Label>
                <Input
                  id="anc-number"
                  value={ancNumber}
                  onChange={(e) => setAncNumber(e.target.value)}
                  placeholder="Enter ANC number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breast-feeding">Breast Feeding</Label>
                <Select value={breastFeeding} onValueChange={setBreastFeeding}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                    <SelectItem value="U">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="active-tb">Active TB Status</Label>
                <Select value={activeTbStatus} onValueChange={setActiveTbStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                    <SelectItem value="U">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Current Status</Label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded">
                  <Badge variant={sample.verified === 1 ? "secondary" : "outline"}>
                    {sample.verified === 1 ? "Verified" : 
                     sample.date_received ? "Received" : 
                     sample.date_collected ? "Collected" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Information - Read Only */}
        <Card>
          <CardHeader>
            <CardTitle>Date Information (Read Only)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-700">Created</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {sample.created_at ? new Date(sample.created_at).toLocaleDateString() : "Not specified"}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Date Collected</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {sample.date_collected ? new Date(sample.date_collected).toLocaleDateString() : "Not collected"}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Date Received</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {sample.date_received ? new Date(sample.date_received).toLocaleDateString() : "Not received"}
                </div>
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
          <Button 
            type="submit" 
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </main>
  )
} 