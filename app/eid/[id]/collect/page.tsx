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
import { CalendarIcon, ArrowLeft, TestTube } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams } from "next/navigation"

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
  const requestId = params.id as string
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      barcodeNumber: '',
      requestedBy: '',
    },
  })

  const onSubmit = async (data: CollectionFormData): Promise<void> => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Collecting sample for:', requestId, data)
    
    // In real app, this would make an API call to save the collection data
    // Then redirect back to the collect-sample list
    router.push("/eid/collect-sample")
  }

  return (
    <div className="mx-auto space-y-6 p-6">
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
                    Sample collection for {requestId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form id="collection-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Infant Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TestTube className="h-5 w-5 mr-2 text-blue-600" />
                Infant Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="infantName" className="text-sm font-medium text-gray-700">
                  Infant Name
                </Label>
                <Input
                  id="infantName"
                  value={mockRequest.infantName}
                  disabled
                  className="mt-2 h-10 bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="expNo" className="text-sm font-medium text-gray-700">
                  EXP No
                </Label>
                <Input
                  id="expNo"
                  value={mockRequest.expNo || "085"}
                  disabled
                  className="mt-2 h-10 bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="sex" className="text-sm font-medium text-gray-700">
                  Sex
                </Label>
                <Input
                  id="sex"
                  value={mockRequest.sex || "MALE"}
                  disabled
                  className="mt-2 h-10 bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Sample Collection Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Sample Collection Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="barcodeNumber" className="text-sm font-medium text-gray-700">
                  Barcode Number *
                </Label>
                <Input
                  id="barcodeNumber"
                  {...form.register("barcodeNumber")}
                  placeholder="Enter barcode number"
                  className="mt-2 h-10"
                />
                {form.formState.errors.barcodeNumber && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.barcodeNumber.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Collection Date *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 h-10",
                        !form.watch("collectionDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("collectionDate") ? (
                        format(form.watch("collectionDate"), "PPP")
                      ) : (
                        <span>Pick collection date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("collectionDate")}
                      onSelect={(date) => form.setValue("collectionDate", date!)}
                      disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.collectionDate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.collectionDate.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Dispatch Date (Optional)
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 h-10",
                        !form.watch("dispatchDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                                             {form.watch("dispatchDate") ? (
                         format(form.watch("dispatchDate")!, "PPP")
                       ) : (
                         <span>Pick dispatch date</span>
                       )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("dispatchDate")}
                      onSelect={(date) => form.setValue("dispatchDate", date)}
                      disabled={(date) => {
                        const collectionDate = form.watch("collectionDate")
                        return date > new Date() || (collectionDate && date < collectionDate)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="requestedBy" className="text-sm font-medium text-gray-700">
                  Requested By *
                </Label>
                <Input
                  id="requestedBy"
                  {...form.register("requestedBy")}
                  placeholder="Enter requester name"
                  className="mt-2 h-10"
                />
                {form.formState.errors.requestedBy && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.requestedBy.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Submit Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-end space-x-4">
              <Link href="/eid/collect-sample">
                <Button variant="outline" className="h-10 px-6">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 h-10 px-8"
              >
                {isSubmitting ? "Collecting Sample..." : "Collect Sample"}
              </Button>
            </div>
          </div>
      </form>
    </div>
  )
} 