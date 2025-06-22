"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, TestTube, UserIcon, MapPinIcon, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

const sampleCollectionSchema = z.object({
  sampleId: z.string().min(1, "Sample ID is required"),
  dateCollected: z.date({ required_error: "Collection date is required" }),
  timeCollected: z.string().min(1, "Collection time is required"),
  sampleType: z.enum(["plasma", "serum", "whole_blood", "other"], {
    required_error: "Sample type is required",
  }),
  otherSampleType: z.string().optional(),
  dateCentrifuged: z.date().optional(),
  timeCentrifuged: z.string().optional(),
  technicianName: z.string().min(1, "Technician name is required"),
  specimenStorageConsent: z.enum(["yes", "no"], {
    required_error: "Storage consent is required",
  }),
  notes: z.string().optional(),
});

type SampleCollectionData = z.infer<typeof sampleCollectionSchema>;

// Mock request data - in real app, this would come from an API
const mockRequestData = {
  id: "VL-001456",
  patientId: "P001234",
  patientName: "Jane Doe",
  age: "34 years",
  gender: "Female",
  facility: "Butabika Hospital",
  district: "Kampala",
  clinician: "Dr. Sarah Kato",
  clinicianPhone: "+256 700 123 456",
  requestDate: new Date(2024, 11, 15),
  indication: "Routine monitoring (6 months)",
  regimen: "TDF-3TC-DTG",
  status: "pending_collection",
  priority: "routine",
};

export default function CollectSamplePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState(mockRequestData);

  const form = useForm<SampleCollectionData>({
    resolver: zodResolver(sampleCollectionSchema),
    defaultValues: {
      dateCollected: new Date(),
      timeCollected: format(new Date(), "HH:mm"),
      sampleType: "plasma",
      specimenStorageConsent: "yes",
    },
  });

  useEffect(() => {
    if (!requestId) {
      router.push("/viral-load/pending-collection");
      return;
    }
    
    // In real app, fetch request data based on requestId
    // For now, we'll use mock data
    console.log("Loading request:", requestId);
  }, [requestId, router]);

  const onSubmit = async (data: SampleCollectionData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Sample Collection Data:", {
      requestId: requestId,
      ...data,
    });
    
    // Redirect to pending collection with success message
    router.push("/viral-load/pending-collection");
  };

  if (!requestId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid Request</h3>
            <p className="text-gray-600 mb-4">No request ID provided for sample collection.</p>
            <Link href="/viral-load/pending-collection">
              <Button className="bg-red-600 text-white hover:bg-red-700">
                Back to Pending Collection
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-500 rounded-lg">
              <TestTube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sample Collection</h1>
              <p className="text-gray-600 mt-1">Collect specimen for viral load testing</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                Step 3 of 3
              </Badge>
              <span className="text-sm text-gray-500">Sample Collection</span>
            </div>
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
              Request ID: {requestId}
            </Badge>
          </div>
        </div>

        {/* Request Information Summary */}
        <Card className="border-red-200 shadow-sm mb-8">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <UserIcon className="h-5 w-5" />
              <span>Request Information</span>
              <Badge variant="outline" className="ml-auto bg-orange-100 text-orange-800 border-orange-200">
                Pending Collection
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Patient</Label>
                  <p className="text-lg font-semibold text-gray-900">{requestData.patientName}</p>
                  <p className="text-sm text-gray-500">
                    {requestData.patientId} • {requestData.age} • {requestData.gender}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Facility</Label>
                  <p className="text-base text-gray-900">{requestData.facility}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPinIcon className="h-3 w-3 mr-1" />
                    {requestData.district}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Requesting Clinician</Label>
                  <p className="text-base text-gray-900">{requestData.clinician}</p>
                  <p className="text-sm text-gray-500">{requestData.clinicianPhone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Regimen</Label>
                  <p className="text-base text-gray-900">{requestData.regimen}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Request Date</Label>
                  <p className="text-base text-gray-900">
                    {format(requestData.requestDate, "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(requestData.requestDate, "h:mm a")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Indication</Label>
                  <p className="text-base text-gray-900">{requestData.indication}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Sample Collection Information */}
          <Card className="border-red-200 shadow-sm">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <TestTube className="h-5 w-5" />
                <span>Sample Collection Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-blue-800">
                  Please ensure all sample collection protocols are followed according to facility guidelines.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sampleId" className="text-sm font-medium text-gray-700">
                    Sample ID/Barcode *
                  </Label>
                  <Input
                    id="sampleId"
                    {...form.register("sampleId")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter sample barcode"
                  />
                  {form.formState.errors.sampleId && (
                    <p className="text-sm text-red-600">{form.formState.errors.sampleId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Sample Type *</Label>
                  <Select onValueChange={(value: "plasma" | "serum" | "whole_blood" | "other") => 
                    form.setValue("sampleType", value)
                  }>
                    <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select sample type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plasma">Plasma</SelectItem>
                      <SelectItem value="serum">Serum</SelectItem>
                      <SelectItem value="whole_blood">Whole Blood</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.sampleType && (
                    <p className="text-sm text-red-600">{form.formState.errors.sampleType.message}</p>
                  )}
                </div>

                {form.watch("sampleType") === "other" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="otherSampleType" className="text-sm font-medium text-gray-700">
                      Specify Other Sample Type
                    </Label>
                    <Input
                      id="otherSampleType"
                      {...form.register("otherSampleType")}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="Specify sample type"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Date Collected *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-300 hover:border-red-500",
                          !form.watch("dateCollected") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("dateCollected") ? (
                          format(form.watch("dateCollected"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("dateCollected")}
                        onSelect={(date) => form.setValue("dateCollected", date!)}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.dateCollected && (
                    <p className="text-sm text-red-600">{form.formState.errors.dateCollected.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeCollected" className="text-sm font-medium text-gray-700">
                    Time Collected *
                  </Label>
                  <Input
                    id="timeCollected"
                    type="time"
                    {...form.register("timeCollected")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  {form.formState.errors.timeCollected && (
                    <p className="text-sm text-red-600">{form.formState.errors.timeCollected.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Date Centrifuged (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-300 hover:border-red-500",
                          !form.watch("dateCentrifuged") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("dateCentrifuged") ? (
                          format(form.watch("dateCentrifuged"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("dateCentrifuged")}
                        onSelect={(date) => form.setValue("dateCentrifuged", date)}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeCentrifuged" className="text-sm font-medium text-gray-700">
                    Time Centrifuged (Optional)
                  </Label>
                  <Input
                    id="timeCentrifuged"
                    type="time"
                    {...form.register("timeCentrifuged")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="technicianName" className="text-sm font-medium text-gray-700">
                    Technician Name *
                  </Label>
                  <Input
                    id="technicianName"
                    {...form.register("technicianName")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter technician name"
                  />
                  {form.formState.errors.technicianName && (
                    <p className="text-sm text-red-600">{form.formState.errors.technicianName.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Specimen Storage Consent *
                  </Label>
                  <RadioGroup
                    value={form.watch("specimenStorageConsent")}
                    onValueChange={(value: "yes" | "no") => form.setValue("specimenStorageConsent", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="consent-yes" className="border-red-300 text-red-600" />
                      <Label htmlFor="consent-yes" className="text-sm font-normal">
                        Yes, patient consents to specimen storage
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="consent-no" className="border-red-300 text-red-600" />
                      <Label htmlFor="consent-no" className="text-sm font-normal">
                        No, patient does not consent
                      </Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.specimenStorageConsent && (
                    <p className="text-sm text-red-600">{form.formState.errors.specimenStorageConsent.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    Collection Notes (Optional)
                  </Label>
                  <Input
                    id="notes"
                    {...form.register("notes")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Any additional notes about sample collection..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pb-8">
            <Link href="/viral-load/pending-collection">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 px-8"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing Collection...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Collection
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 