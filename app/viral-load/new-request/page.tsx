"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon, ClipboardIcon, HeartIcon, TestTube, MapPinIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  // Facility Information
  facilityName: z.string().min(1, "Facility name is required"),
  facilityCode: z.string().min(1, "Facility code is required"),
  district: z.string().min(1, "District is required"),
  hub: z.string().min(1, "Hub is required"),
  
  // Requesting Clinician
  clinicianName: z.string().min(1, "Clinician name is required"),
  clinicianPhone: z.string().min(10, "Valid phone number required"),
  clinicianEmail: z.union([
    z.string().email("Valid email required"),
    z.literal("")
  ]).optional(),
  
  // Patient Information
  patientId: z.string().min(1, "Patient ID is required"),
  patientName: z.string().min(1, "Patient name is required"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  age: z.string().min(1, "Age is required"),
  phoneNumber: z.string().optional().or(z.literal("")),
  
  // Treatment Information
  currentRegimen: z.string().min(1, "Current regimen is required"),
  dateStartedArt: z.date({ required_error: "ART start date is required" }),
  isPregnant: z.enum(["yes", "no", "unknown", "not_applicable"]).optional(),
  hasTb: z.enum(["yes", "no", "unknown"], { required_error: "TB status required" }),
  adherenceLevel: z.enum(["good", "fair", "poor"], { required_error: "Adherence level required" }),
  whoStage: z.enum(["1", "2", "3", "4"], { required_error: "WHO stage required" }),
  indication: z.string().min(1, "Indication is required"),
  clinicalNotes: z.string().optional().or(z.literal("")),
}).refine((data) => {
  // If gender is female, pregnancy status is required
  if (data.gender === "female") {
    return data.isPregnant && ["yes", "no", "unknown"].includes(data.isPregnant);
  }
  return true;
}, {
  message: "Please select pregnancy status for female patients",
  path: ["isPregnant"],
});

type FormData = z.infer<typeof formSchema>;

export default function NewViralLoadRequest(): React.JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityName: "Butabika Hospital",
      district: "Kampala", 
      hub: "Kampala Hub",
      clinicianEmail: "",
      phoneNumber: "",
      clinicalNotes: "",
    },
  });

  // Handle conditional logic for pregnancy field
  const watchedGender = form.watch("gender");
  useEffect(() => {
    if (watchedGender === "male") {
      form.setValue("isPregnant", "not_applicable");
    } else if (watchedGender === "female" && form.getValues("isPregnant") === "not_applicable") {
      form.setValue("isPregnant", undefined);
    }
  }, [watchedGender, form]);

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("New Viral Load Request:", data);
    
    // Redirect to pending collection
    router.push("/viral-load/pending-collection");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
            <TestTube className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Viral Load Request</h1>
            <p className="text-muted-foreground">Create a new viral load testing request</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
          Step 1 of 3 - Request Creation
        </Badge>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Facility Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              Facility Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facilityName">Facility Name *</Label>
                <Input
                  id="facilityName"
                  {...form.register("facilityName")}
                  placeholder="Enter facility name"
                />
                {form.formState.errors.facilityName && (
                  <p className="text-sm text-red-500">{form.formState.errors.facilityName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilityCode">Facility Code *</Label>
                <Input
                  id="facilityCode"
                  {...form.register("facilityCode")}
                  placeholder="Enter facility code"
                />
                {form.formState.errors.facilityCode && (
                  <p className="text-sm text-red-500">{form.formState.errors.facilityCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  {...form.register("district")}
                  placeholder="Enter district"
                />
                {form.formState.errors.district && (
                  <p className="text-sm text-red-500">{form.formState.errors.district.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hub">Testing Hub *</Label>
                <Input
                  id="hub"
                  {...form.register("hub")}
                  placeholder="Enter testing hub"
                />
                {form.formState.errors.hub && (
                  <p className="text-sm text-red-500">{form.formState.errors.hub.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requesting Clinician */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Requesting Clinician
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinicianName">Clinician Name *</Label>
                <Input
                  id="clinicianName"
                  {...form.register("clinicianName")}
                  placeholder="Dr. John Doe"
                />
                {form.formState.errors.clinicianName && (
                  <p className="text-sm text-red-500">{form.formState.errors.clinicianName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicianPhone">Phone Number *</Label>
                <Input
                  id="clinicianPhone"
                  {...form.register("clinicianPhone")}
                  placeholder="+256 700 000 000"
                />
                {form.formState.errors.clinicianPhone && (
                  <p className="text-sm text-red-500">{form.formState.errors.clinicianPhone.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clinicianEmail">Email Address (Optional)</Label>
                <Input
                  id="clinicianEmail"
                  type="email"
                  {...form.register("clinicianEmail")}
                  placeholder="doctor@facility.com"
                />
                {form.formState.errors.clinicianEmail && (
                  <p className="text-sm text-red-500">{form.formState.errors.clinicianEmail.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartIcon className="h-4 w-4" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input
                  id="patientId"
                  {...form.register("patientId")}
                  placeholder="P001234"
                />
                {form.formState.errors.patientId && (
                  <p className="text-sm text-red-500">{form.formState.errors.patientId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  {...form.register("patientName")}
                  placeholder="Jane Doe"
                />
                {form.formState.errors.patientName && (
                  <p className="text-sm text-red-500">{form.formState.errors.patientName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select onValueChange={(value: "male" | "female") => form.setValue("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("dateOfBirth") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("dateOfBirth") ? (
                        format(form.watch("dateOfBirth"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("dateOfBirth")}
                      onSelect={(date) => form.setValue("dateOfBirth", date!)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  {...form.register("age")}
                  placeholder="25 years"
                />
                {form.formState.errors.age && (
                  <p className="text-sm text-red-500">{form.formState.errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  placeholder="+256 700 000 000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardIcon className="h-4 w-4" />
              Treatment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current ART Regimen *</Label>
                <Select onValueChange={(value) => form.setValue("currentRegimen", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select regimen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TDF-3TC-EFV">TDF-3TC-EFV</SelectItem>
                    <SelectItem value="TDF-3TC-DTG">TDF-3TC-DTG</SelectItem>
                    <SelectItem value="AZT-3TC-EFV">AZT-3TC-EFV</SelectItem>
                    <SelectItem value="ABC-3TC-DTG">ABC-3TC-DTG</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.currentRegimen && (
                  <p className="text-sm text-red-500">{form.formState.errors.currentRegimen.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date Started ART *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("dateStartedArt") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("dateStartedArt") ? (
                        format(form.watch("dateStartedArt"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("dateStartedArt")}
                      onSelect={(date) => form.setValue("dateStartedArt", date!)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.dateStartedArt && (
                  <p className="text-sm text-red-500">{form.formState.errors.dateStartedArt.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Pregnant {form.watch("gender") === "female" ? "*" : ""}
                </Label>
                <Select 
                  onValueChange={(value: "yes" | "no" | "unknown" | "not_applicable") => form.setValue("isPregnant", value)}
                  disabled={form.watch("gender") === "male"}
                  value={form.watch("gender") === "male" ? "not_applicable" : form.watch("isPregnant")}
                >
                  <SelectTrigger className={form.watch("gender") === "male" ? "bg-muted cursor-not-allowed" : ""}>
                    <SelectValue placeholder={
                      form.watch("gender") === "male" ? "Not applicable (Male)" : "Select option"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.isPregnant && (
                  <p className="text-sm text-red-500">{form.formState.errors.isPregnant.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>TB Status *</Label>
                <Select onValueChange={(value: "yes" | "no" | "unknown") => form.setValue("hasTb", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.hasTb && (
                  <p className="text-sm text-red-500">{form.formState.errors.hasTb.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Adherence Level *</Label>
                <Select onValueChange={(value: "good" | "fair" | "poor") => form.setValue("adherenceLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select adherence level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good (≥95%)</SelectItem>
                    <SelectItem value="fair">Fair (85-94%)</SelectItem>
                    <SelectItem value="poor">Poor (≤85%)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.adherenceLevel && (
                  <p className="text-sm text-red-500">{form.formState.errors.adherenceLevel.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>WHO Stage *</Label>
                <Select onValueChange={(value: "1" | "2" | "3" | "4") => form.setValue("whoStage", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select WHO stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Stage 1</SelectItem>
                    <SelectItem value="2">Stage 2</SelectItem>
                    <SelectItem value="3">Stage 3</SelectItem>
                    <SelectItem value="4">Stage 4</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.whoStage && (
                  <p className="text-sm text-red-500">{form.formState.errors.whoStage.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Indication for VL Testing *</Label>
                <Select onValueChange={(value) => form.setValue("indication", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select indication" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine-6-months">Routine monitoring (6 months)</SelectItem>
                    <SelectItem value="routine-12-months">Routine monitoring (12 months)</SelectItem>
                    <SelectItem value="suspected-failure">Suspected treatment failure</SelectItem>
                    <SelectItem value="adherence-issues">Adherence issues</SelectItem>
                    <SelectItem value="drug-change">Drug change/switch</SelectItem>
                    <SelectItem value="pregnancy">Pregnancy</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.indication && (
                  <p className="text-sm text-red-500">{form.formState.errors.indication.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clinicalNotes">Clinical Notes (Optional)</Label>
                <Textarea
                  id="clinicalNotes"
                  {...form.register("clinicalNotes")}
                  placeholder="Additional clinical information..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Creating Request..." : "Create Request"}
          </Button>
        </div>
      </form>
    </div>
  );
} 