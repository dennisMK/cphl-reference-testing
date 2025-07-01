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
import { CalendarIcon, Package, MapPin, Loader2 } from "lucide-react"
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
import { api } from "@/trpc/react"
import { useParams } from "next/navigation"

export default function CollectSamplePage() {
  const params = useParams()
  const router = useRouter()
  
  // Fetch sample data using tRPC
  const { data: sample, isLoading, error } = api.viralLoad.getSample.useQuery(
    { sampleId: params.id as string },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  // Form state
  const [collectionDateTime, setCollectionDateTime] = React.useState<Date>()
  const [centrifugationDateTime, setCentrifugationDateTime] = React.useState<Date>()
  const [sampleIdBarcode, setSampleIdBarcode] = React.useState("")
  const [sampleType, setSampleType] = React.useState("")
  const [specimenName, setSpecimenName] = React.useState("")
  const [storageConsent, setStorageConsent] = React.useState("")

  // Update sample status mutation
  const updateSampleMutation = api.viralLoad.updateSampleStatus.useMutation({
    onSuccess: () => {
      toast.success("Sample collection submitted successfully!")
      setTimeout(() => {
        
        router.push("/viral-load/pending-collection")
      }, 1000)
    },
    onError: (error) => {
      toast.error(`Failed to submit collection: ${error.message}`)
    },
  })

  // Initialize form with sample data
  React.useEffect(() => {
    if (sample) {
      // Don't initialize sample ID barcode - user will enter manually
      setSampleType(sample.sampleType || "")
    }
  }, [sample])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading sample details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Sample</h1>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

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
    
    // Update sample status to collected
    updateSampleMutation.mutate({
      sampleId: params.id as string,
      status: "collected",
      notes: `Sample collected on ${collectionDateTime ? format(collectionDateTime, "PPP") : "today"}. Sample type: ${sampleType}. Specimen: ${specimenName}. Storage consent: ${storageConsent}.`
    })
  }

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "MM/dd/yyyy HH:mm")
  }

  return (
    <div className="md:container mx-auto md:px-0 px-4 py-6">
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

      {/* Sample Information Banner */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-800">
          <Package className="h-4 w-4" />
          <span className="font-medium">
            ART Number: {sample.patientUniqueId} | Request Date: {sample.createdAt ? new Date(sample.createdAt).toLocaleDateString() : 'N/A'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="art-number" className="text-sm font-medium text-gray-700">
                  ART Number
                </Label>
                <Input
                  id="art-number"
                  value={sample.patientUniqueId || ""}
                  readOnly
                  className="mt-2 h-10 bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="request-date" className="text-sm font-medium text-gray-700">
                  Request Date
                </Label>
                <Input
                  id="request-date"
                  value={sample.createdAt ? new Date(sample.createdAt).toLocaleDateString() : ""}
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
                Sample Collection Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <SelectItem value="P">Plasma</SelectItem>
                    <SelectItem value="D">DBS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sampleType === "P" && (
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
              )}

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
                <Button variant="outline" className="h-10 px-6" disabled={updateSampleMutation.isPending}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 h-10 px-8"
                disabled={updateSampleMutation.isPending}
              >
                {updateSampleMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Collection"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 