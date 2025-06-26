"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, TestTube, Baby, Save } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams } from "next/navigation"
import { api } from "@/trpc/react"
import { toast } from "sonner"

// Form validation schema
const collectionFormSchema = z.object({
  barcodeNumber: z.string().min(1, "Barcode number is required"),
  collectionDate: z.date({ required_error: "Collection date is required" }),
  dispatchDate: z.date().optional(),
  requestedBy: z.string().min(1, "Requested by is required"),
})

type CollectionFormData = z.infer<typeof collectionFormSchema>

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
  const router = useRouter()
  const params = useParams()
  const requestId = parseInt(params.id as string)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch the EID request details
  const { data: request, isLoading: requestLoading, error: requestError } = api.eid.getRequest.useQuery(
    { id: requestId },
    { enabled: !!requestId }
  )

  // Collect sample mutation
  const collectSampleMutation = api.eid.collectSample.useMutation({
    onSuccess: () => {
      toast.success("Sample collected successfully!")
      router.push("/eid/collect-sample")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to collect sample")
      setIsSubmitting(false)
    },
  })

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      barcodeNumber: '',
      requestedBy: '',
    },
  })

  const onSubmit = async (data: CollectionFormData): Promise<void> => {
    setIsSubmitting(true);

    const collectionData = {
      id: requestId,
      date_dbs_taken: format(data.collectionDate, "yyyy-MM-dd"),
      barcode_number: data.barcodeNumber,
      requested_by: data.requestedBy,
      ...(data.dispatchDate && { dispatch_date: format(data.dispatchDate, "yyyy-MM-dd") }),
    };

    try {
      await collectSampleMutation.mutateAsync(collectionData);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (requestLoading) {
    return (
      <div className="mx-auto space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (requestError || !request) {
    return (
      <div className="mx-auto space-y-6 p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading EID request</p>
          <Link href="/eid/collect-sample">
            <Button variant="outline">Back to Collection List</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="md:container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3">
              <Link href="/eid/collect-sample">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500">
                  <TestTube className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Collect Sample
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Sample collection for EID-{String(requestId).padStart(6, "0")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Infant Details Section */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
              <Baby className="h-5 w-5 mr-2" />
              Infant Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Infant Name:</Label>
                <Input
                  value={request.infant_name}
                  disabled
                  className="mt-1 bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">EXP No:</Label>
                <Input
                  value={request.infant_exp_id || "Not specified"}
                  disabled
                  className="mt-1 bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Sex:</Label>
                <Input
                  value={request.infant_gender}
                  disabled
                  className="mt-1 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Information Section */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
              <TestTube className="h-5 w-5 mr-2" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Barcode Number */}
              <div>
                <Label htmlFor="barcodeNumber" className="text-sm font-medium text-gray-700">
                  Barcode Number:
                </Label>
                <Input
                  id="barcodeNumber"
                  {...form.register("barcodeNumber")}
                  placeholder="Enter barcode number"
                  className="mt-1"
                />
                {form.formState.errors.barcodeNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.barcodeNumber.message}
                  </p>
                )}
              </div>

              {/* Collection Date */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Collection date:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !form.watch("collectionDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("collectionDate") ? (
                        format(form.watch("collectionDate"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("collectionDate")}
                      onSelect={(date) => form.setValue("collectionDate", date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.collectionDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.collectionDate.message}
                  </p>
                )}
              </div>

              {/* Dispatch Date */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Dispatch date:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !form.watch("dispatchDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("dispatchDate") ? (
                        format(form.watch("dispatchDate"), "PPP")
                      ) : (
                        <span>Pick a date (optional)</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("dispatchDate")}
                      onSelect={(date) => form.setValue("dispatchDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Requested By */}
              <div>
                <Label htmlFor="requestedBy" className="text-sm font-medium text-gray-700">
                  Requested by:
                </Label>
                <Input
                  id="requestedBy"
                  {...form.register("requestedBy")}
                  placeholder="Enter requester name"
                  className="mt-1"
                />
                {form.formState.errors.requestedBy && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.requestedBy.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link href="/eid/collect-sample">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  )
} 