"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TestTube, User, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

const sampleCollectionSchema = z.object({
  collectionDateTime: z.string().min(1, "Collection date and time is required"),
  sampleId: z.string().min(1, "Sample ID/Barcode is required"),
  sampleType: z.enum(["plasma", "serum", "whole-blood", "other"], {
    required_error: "Please select a sample type",
  }),
  centrifugationDateTime: z.string().min(1, "Centrifugation date and time is required"),
  technicianName: z.string().min(1, "Technician name is required"),
  storageConsent: z.enum(["yes", "no", "unknown"], {
    required_error: "Please select storage consent status",
  }),
});

type SampleCollectionFormData = z.infer<typeof sampleCollectionSchema>;

// Mock request data - in real app, this would come from API
const mockRequestData = {
  "VL-001456": {
    id: "VL-001456",
    patientId: "95/24",
    clinicianName: "Dr. Rita Zemeyi",
    facility: "Butabika Hospital",
    district: "Kampala",
    hub: "Kampala Hub",
    requestDate: "2025-06-17",
    gender: "Male",
    age: 36,
    indication: "Routine monitoring"
  },
  "VL-001457": {
    id: "VL-001457",
    patientId: "96/24", 
    clinicianName: "Dr. John Mugisha",
    facility: "Mulago Hospital",
    district: "Kampala",
    hub: "Kampala Hub",
    requestDate: "2025-06-16",
    gender: "Female",
    age: 28,
    indication: "Post treatment initiation"
  }
};

export default function CollectSamplePage() {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('viral-load');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get('id');
  
  const [requestData, setRequestData] = useState<any>(null);
  
  useEffect(() => {
    if (requestId && mockRequestData[requestId as keyof typeof mockRequestData]) {
      setRequestData(mockRequestData[requestId as keyof typeof mockRequestData]);
    }
  }, [requestId]);
  
  const form = useForm<SampleCollectionFormData>({
    resolver: zodResolver(sampleCollectionSchema),
    defaultValues: {
      collectionDateTime: new Date().toISOString().slice(0, 16),
      centrifugationDateTime: new Date().toISOString().slice(0, 16),
    },
  });

  const handleSubmit = async (data: SampleCollectionFormData) => {
    setIsLoading(true);
    try {
      console.log("Sample Collection Data:", { requestId, ...data });
      // Here you would send to your API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Redirect back to pending collection or viral load operations
      router.push('/viral-load/pending-collection');
    } catch (error) {
      console.error("Error submitting sample collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!requestId) {
    return (
      <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Request</h3>
              <p className="text-gray-600 mb-4">No request ID provided.</p>
              <Link href="/viral-load/pending-collection">
                <Button style={{ backgroundColor: colors.primary }} className="text-white">
                  Back to Pending Collection
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Request Not Found</h3>
              <p className="text-gray-600 mb-4">Request ID {requestId} not found.</p>
              <Link href="/viral-load/pending-collection">
                <Button style={{ backgroundColor: colors.primary }} className="text-white">
                  Back to Pending Collection
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/viral-load/pending-collection">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Collect Sample</h1>
            <p className="text-gray-600">Add sample details for request {requestId}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Request Details (Read-Only) */}
        <Card>
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
              <TestTube className="h-5 w-5" />
              <span>Request Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Patient Clinic ID/ART #</label>
                <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{requestData.patientId}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{requestData.gender}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Requested on</label>
                <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{requestData.requestDate}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Clinician: {requestData.clinicianName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{requestData.facility} | {requestData.district} | {requestData.hub}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TestTube className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Indication: {requestData.indication}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Details Form */}
        <Card>
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
              <TestTube className="h-5 w-5" />
              <span>Sample Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="collectionDateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date and Time of Collection</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="datetime-local" 
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sampleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sample ID/Barcode</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter sample barcode"
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sampleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sample Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select sample type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="plasma">Plasma</SelectItem>
                            <SelectItem value="serum">Serum</SelectItem>
                            <SelectItem value="whole-blood">Whole Blood</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="centrifugationDateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date and Time of Centrifugation</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="datetime-local" 
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technicianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technician Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Name of person collecting sample"
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storageConsent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specimen Storage Consent</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Select consent status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes - Consent Given</SelectItem>
                          <SelectItem value="no">No - Consent Not Given</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="sticky bottom-0 bg-white p-4 border-t -mx-6 -mb-6">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 text-white font-semibold text-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {isLoading ? "Submitting Sample..." : "Submit Sample Collection"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 