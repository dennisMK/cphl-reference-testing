"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, User, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const newRequestSchema = z.object({
  // Facility Information
  facility: z.string().min(1, "Facility name is required"),
  district: z.string().min(1, "District is required"),
  hub: z.string().min(1, "Hub is required"),
  
  // Requesting Clinician
  clinicianName: z.string().min(1, "Clinician name is required"),
  requestDate: z.string().min(1, "Request date is required"),
  
  // Patient Information
  patientClinicId: z.string().min(1, "Patient Clinic ID/ART # is required"),
  otherId: z.string().optional(),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.string().min(1, "Age is required"),
  phoneNumber: z.string().optional(),
  
  // Treatment Information
  treatmentInitiationDate: z.string().min(1, "Treatment initiation date is required"),
  currentRegimen: z.string().min(1, "Current regimen is required"),
  currentRegimenInitiationDate: z.string().min(1, "Current regimen initiation date is required"),
  pregnant: z.enum(["yes", "no", "unknown"], {
    required_error: "Please select pregnancy status",
  }),
  ancNumber: z.string().optional(),
  motherBreastFeeding: z.enum(["yes", "no", "unknown"], {
    required_error: "Please select breast feeding status",
  }),
  activeTbStatus: z.enum(["yes", "no", "unknown"], {
    required_error: "Please select TB status",
  }),
  tbTreatmentPhase: z.enum(["intensive", "continuation", "none"], {
    required_error: "Please select TB treatment phase",
  }),
  arvAdherence: z.enum(["good", "fair", "poor"], {
    required_error: "Please select adherence level",
  }),
  treatmentCareApproach: z.string().min(1, "Treatment care approach is required"),
  currentWhoStage: z.enum(["1", "2", "3", "4"], {
    required_error: "Please select WHO stage",
  }),
  indicationForTesting: z.string().min(1, "Indication for viral load testing is required"),
});

type NewRequestFormData = z.infer<typeof newRequestSchema>;

export default function NewRequestPage() {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('viral-load');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<NewRequestFormData>({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      facility: "Butabika Hospital",
      district: "Kampala",
      hub: "Kampala Hub",
      requestDate: new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = async (data: NewRequestFormData) => {
    setIsLoading(true);
    try {
      console.log("New Request Data:", data);
      // Here you would send to your API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Redirect back to viral load operations
      router.push('/viral-load');
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/viral-load">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">New Viral Load Request</h1>
            <p className="text-gray-600">Create a new test request</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Facility Information */}
            <Card>
              <CardHeader style={{ backgroundColor: colors.primaryLight }}>
                <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
                  <MapPin className="h-5 w-5" />
                  <span>Facility Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="facility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input {...field} className="text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hub"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hub</FormLabel>
                          <FormControl>
                            <Input {...field} className="text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requesting Clinician */}
            <Card>
              <CardHeader style={{ backgroundColor: colors.primaryLight }}>
                <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
                  <User className="h-5 w-5" />
                  <span>Requesting Clinician</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="clinicianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinician Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Dr. John Doe" className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requestDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader style={{ backgroundColor: colors.primaryLight }}>
                <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
                  <User className="h-5 w-5" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="patientClinicId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Clinic ID/ART #</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="VL-001234" className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="otherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other ID (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Additional identifier" className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Years)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="25" className="text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+256 700 000 000" className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Treatment Information */}
            <Card>
              <CardHeader style={{ backgroundColor: colors.primaryLight }}>
                <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
                  <Save className="h-5 w-5" />
                  <span>Treatment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="treatmentInitiationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment Initiation Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentRegimenInitiationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Regimen Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="currentRegimen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Regimen</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="TDF/3TC/EFV" className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pregnant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pregnant</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherBreastFeeding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breast Feeding</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ancNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ANC Number (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ANC identifier" className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="activeTbStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active TB Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tbTreatmentPhase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TB Treatment Phase</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select phase" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="intensive">Intensive</SelectItem>
                            <SelectItem value="continuation">Continuation</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="arvAdherence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ARV Adherence</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select adherence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentWhoStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current WHO Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Stage 1</SelectItem>
                            <SelectItem value="2">Stage 2</SelectItem>
                            <SelectItem value="3">Stage 3</SelectItem>
                            <SelectItem value="4">Stage 4</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="treatmentCareApproach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Care Approach (DSDM)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Facility-based" className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="indicationForTesting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indication for Viral Load Testing</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe the indication for this viral load test..."
                          rows={4}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-white p-4 border-t">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 text-white font-semibold text-lg"
                style={{ backgroundColor: colors.primary }}
              >
                {isLoading ? "Saving Request..." : "Save Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 