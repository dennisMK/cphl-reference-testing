"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/lib/theme-context";

const viralLoadSchema = z.object({
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

type ViralLoadFormData = z.infer<typeof viralLoadSchema>;

interface ViralLoadFormProps {
  onSubmit?: (data: ViralLoadFormData) => void;
  isLoading?: boolean;
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

export default function ViralLoadForm({ onSubmit, isLoading }: ViralLoadFormProps) {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('viral-load');
  const [user, setUser] = useState<User | null>(null);
  
  const form = useForm<ViralLoadFormData>({
    resolver: zodResolver(viralLoadSchema),
    defaultValues: {
      requestDate: new Date().toISOString().split('T')[0],
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
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

  const handleSubmit = (data: ViralLoadFormData) => {
    console.log("Viral Load Form Data:", data);
    onSubmit?.(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader style={{ backgroundColor: colors.primaryLight }}>
          <CardTitle className="text-2xl font-bold" style={{ color: colors.primaryDark }}>
            Viral Load Test Request Form
          </CardTitle>
          <CardDescription className="text-gray-600">
            Complete all required fields to submit a viral load test request
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              
              {/* Facility Information - Display Only */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b-2 pb-2" style={{ borderColor: colors.primary }}>
                  Facility Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Facility</Label>
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
              </div>

              {/* Requesting Clinician */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b-2 pb-2" style={{ borderColor: colors.primary }}>
                  Requesting Clinician
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clinicianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clinician Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b-2 pb-2" style={{ borderColor: colors.primary }}>
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientClinicId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Clinic ID/ART #</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="VL-001234" />
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
                        <FormLabel>Other ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Optional" />
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
                            <SelectTrigger>
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
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
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
                          <Input {...field} type="number" placeholder="25" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+256 700 000 000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Treatment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b-2 pb-2" style={{ borderColor: colors.primary }}>
                  Treatment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="treatmentInitiationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment Initiation Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentRegimen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Regimen</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="TDF/3TC/EFV" />
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
                        <FormLabel>Current Regimen Initiation Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pregnant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pregnant</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select one" />
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
                    name="ancNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ANC Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Optional" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherBreastFeeding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother Breast-Feeding</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select one" />
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
                    name="activeTbStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active TB Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select one" />
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select one" />
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
                  <FormField
                    control={form.control}
                    name="arvAdherence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ARV Adherence</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select one" />
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
                    name="treatmentCareApproach"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment Care Approach (DSDM)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Facility-based" />
                        </FormControl>
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select one" />
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
                  name="indicationForTesting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indication for Viral Load Testing</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe the indication for this viral load test..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-8 py-2 text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  {isLoading ? "Submitting..." : "Submit Viral Load Request"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 