"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, TestTube } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

const formSchema = z.object({
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
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicianEmail: "",
      phoneNumber: "",
      clinicalNotes: "",
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
    <div className="">
      {/* Header with title and actions */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Create Viral Load Request
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Create a new viral load testing request
            </p>
          </div>
          
        </div>
      </div>

      <div className="">
        <form id="viral-load-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {/* Facility Information - Display Only */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Facility Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-700">Facility Name</Label>
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
                <Label className="text-sm font-medium text-gray-700">Testing Hub</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {user?.hub_name || "Not specified"}
                </div>
              </div>
            </div>
          </div>

          {/* Requesting Clinician */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Requesting Clinician
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinicianName" className="text-sm font-medium text-gray-700">
                  Clinician Name *
                </Label>
                <Input
                  id="clinicianName"
                  {...form.register("clinicianName")}
                  placeholder="Dr. John Doe"
                  className="mt-2 h-10"
                />
                {form.formState.errors.clinicianName && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.clinicianName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="clinicianPhone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="clinicianPhone"
                  {...form.register("clinicianPhone")}
                  placeholder="+256 700 000 000"
                  className="mt-2 h-10"
                />
                {form.formState.errors.clinicianPhone && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.clinicianPhone.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="clinicianEmail" className="text-sm font-medium text-gray-700">
                  Email Address (Optional)
                </Label>
                <Input
                  id="clinicianEmail"
                  type="email"
                  {...form.register("clinicianEmail")}
                  placeholder="doctor@facility.com"
                  className="mt-2 h-10"
                />
                {form.formState.errors.clinicianEmail && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.clinicianEmail.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Patient Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientId" className="text-sm font-medium text-gray-700">
                  Patient ID *
                </Label>
                <Input
                  id="patientId"
                  {...form.register("patientId")}
                  placeholder="P001234"
                  className="mt-2 h-10 w-full"
                />
                {form.formState.errors.patientId && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.patientId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="patientName" className="text-sm font-medium text-gray-700">
                  Patient Name *
                </Label>
                <Input
                  id="patientName"
                  {...form.register("patientName")}
                  placeholder="Jane Doe"
                  className="mt-2 h-10 w-full"
                />
                {form.formState.errors.patientName && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.patientName.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Gender *
                </Label>
                <Select onValueChange={(value: "male" | "female") => form.setValue("gender", value)}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.gender.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Date of Birth *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 h-10",
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
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                  Age *
                </Label>
                <Input
                  id="age"
                  {...form.register("age")}
                  placeholder="25 years"
                  className="mt-2 h-10"
                />
                {form.formState.errors.age && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.age.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  placeholder="+256 700 000 000"
                  className="mt-2 h-10"
                />
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Treatment Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Current ART Regimen *
                </Label>
                <Select onValueChange={(value) => form.setValue("currentRegimen", value)}>
                  <SelectTrigger className="mt-2 h-10 w-full">
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
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.currentRegimen.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Date Started ART *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 h-10 w-full",
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
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.dateStartedArt.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Pregnant {form.watch("gender") === "female" ? "*" : ""}
                </Label>
                <Select 
                  
                  onValueChange={(value: "yes" | "no" | "unknown" | "not_applicable") => form.setValue("isPregnant", value)}
                  disabled={form.watch("gender") === "male"}
                  value={form.watch("gender") === "male" ? "not_applicable" : form.watch("isPregnant")}
                >
                  <SelectTrigger className={cn(
                    "mt-2 h-10 w-full",
                    form.watch("gender") === "male" && "bg-muted cursor-not-allowed"
                  )}>
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
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.isPregnant.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TB Status *
                </Label>
                <Select onValueChange={(value: "yes" | "no" | "unknown") => form.setValue("hasTb", value)}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.hasTb && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.hasTb.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Adherence Level *
                </Label>
                <Select onValueChange={(value: "good" | "fair" | "poor") => form.setValue("adherenceLevel", value)}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select adherence level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good (≥95%)</SelectItem>
                    <SelectItem value="fair">Fair (85-94%)</SelectItem>
                    <SelectItem value="poor">Poor (≤85%)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.adherenceLevel && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.adherenceLevel.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  WHO Stage *
                </Label>
                <Select onValueChange={(value: "1" | "2" | "3" | "4") => form.setValue("whoStage", value)}>
                  <SelectTrigger className="mt-2 h-10 w-full">
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
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.whoStage.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">
                  Indication for VL Testing *
                </Label>
                <Select onValueChange={(value) => form.setValue("indication", value)}>
                  <SelectTrigger className="mt-2 h-10 w-full  ">
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
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.indication.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="clinicalNotes" className="text-sm font-medium text-gray-700">
                  Clinical Notes (Optional)
                </Label>
                <Textarea
                  id="clinicalNotes"
                  {...form.register("clinicalNotes")}
                  placeholder="Additional clinical information..."
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Bottom Submit Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-end space-x-4">
              <Link href="/viral-load">
                <Button variant="outline" className="h-10 px-6">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 h-10 px-8"
              >
                {isSubmitting ? "Creating Request..." : "Create Request"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 