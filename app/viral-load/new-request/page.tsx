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
import { CalendarIcon, UserIcon, ClipboardIcon, HeartIcon, TestTube, MapPinIcon, ChevronDownIcon } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50/30 py-4 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
              <TestTube className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">New Viral Load Request</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">Create a new viral load testing request</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Badge variant="secondary" className="border-0 bg-red-50 text-red-700 font-medium px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
              Step 1 of 3
            </Badge>
            <span className="text-gray-500 font-medium text-sm sm:text-base">Request Creation</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Facility Information */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-red-500 border-b border-red-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-white text-lg sm:text-xl font-semibold">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white">
                  <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                </div>
                <span>Facility Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-3">
                  <Label htmlFor="facilityName" className="text-sm sm:text-base font-medium text-gray-700 block">
                    Facility Name *
                  </Label>
                  <Input
                    id="facilityName"
                    {...form.register("facilityName")}
                    className="h-12 sm:h-14 lg:h-16 px-4 sm:px-5 lg:px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter facility name"
                  />
                  {form.formState.errors.facilityName && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.facilityName.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="facilityCode" className="text-sm sm:text-base font-medium text-gray-700 block">
                    Facility Code *
                  </Label>
                  <Input
                    id="facilityCode"
                    {...form.register("facilityCode")}
                    className="h-12 sm:h-14 lg:h-16 px-4 sm:px-5 lg:px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-sm sm:text-base transition-all duration-200"
                    placeholder="Enter facility code"
                  />
                  {form.formState.errors.facilityCode && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.facilityCode.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="district" className="text-base font-medium text-gray-700 block">
                    District *
                  </Label>
                  <Input
                    id="district"
                    {...form.register("district")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="Enter district"
                  />
                  {form.formState.errors.district && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.district.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="hub" className="text-base font-medium text-gray-700 block">
                    Testing Hub *
                  </Label>
                  <Input
                    id="hub"
                    {...form.register("hub")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="Enter testing hub"
                  />
                  {form.formState.errors.hub && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.hub.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requesting Clinician */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-red-500 border-b border-red-600 px-8 py-6">
              <CardTitle className="flex items-center space-x-3 text-white text-xl font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                  <UserIcon className="h-4 w-4 text-red-600" />
                </div>
                <span>Requesting Clinician</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="clinicianName" className="text-base font-medium text-gray-700 block">
                    Clinician Name *
                  </Label>
                  <Input
                    id="clinicianName"
                    {...form.register("clinicianName")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="Dr. John Doe"
                  />
                  {form.formState.errors.clinicianName && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.clinicianName.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="clinicianPhone" className="text-base font-medium text-gray-700 block">
                    Phone Number *
                  </Label>
                  <Input
                    id="clinicianPhone"
                    {...form.register("clinicianPhone")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="+256 700 000 000"
                  />
                  {form.formState.errors.clinicianPhone && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.clinicianPhone.message}</p>
                  )}
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="clinicianEmail" className="text-base font-medium text-gray-700 block">
                    Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="clinicianEmail"
                    type="email"
                    {...form.register("clinicianEmail")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="doctor@facility.com"
                  />
                  {form.formState.errors.clinicianEmail && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.clinicianEmail.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-red-500 border-b border-red-600 px-8 py-6">
              <CardTitle className="flex items-center space-x-3 text-white text-xl font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                  <HeartIcon className="h-4 w-4 text-red-600" />
                </div>
                <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="patientId" className="text-base font-medium text-gray-700 block">
                    Patient ID *
                  </Label>
                  <Input
                    id="patientId"
                    {...form.register("patientId")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="P001234"
                  />
                  {form.formState.errors.patientId && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.patientId.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="patientName" className="text-base font-medium text-gray-700 block">
                    Patient Name *
                  </Label>
                  <Input
                    id="patientName"
                    {...form.register("patientName")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="Jane Doe"
                  />
                  {form.formState.errors.patientName && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.patientName.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 block">Gender *</Label>
                  <Select onValueChange={(value: "male" | "female") => form.setValue("gender", value)}>
                    <SelectTrigger className="w-full py-[23px] h-16 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base px-6">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-lg rounded-xl">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 block">Date of Birth *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-16 px-6 justify-start text-left font-normal border-gray-200 rounded-xl hover:border-red-500 transition-all duration-200",
                          !form.watch("dateOfBirth") && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {form.watch("dateOfBirth") ? (
                          format(form.watch("dateOfBirth"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-lg rounded-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("dateOfBirth")}
                        onSelect={(date) => form.setValue("dateOfBirth", date!)}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.dateOfBirth && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="age" className="text-base font-medium text-gray-700 block">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    {...form.register("age")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="25 years"
                  />
                  {form.formState.errors.age && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phoneNumber" className="text-base font-medium text-gray-700 block">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    {...form.register("phoneNumber")}
                    className="h-16 px-6 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base transition-all duration-200"
                    placeholder="+256 700 000 000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Information */}
          <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-red-500 border-b border-red-600 px-8 py-6">
              <CardTitle className="flex items-center space-x-3 text-white text-xl font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                  <ClipboardIcon className="h-4 w-4 text-red-600" />
                </div>
                <span>Treatment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Row 1 */}
                <div className="space-y-3">
                  <Label htmlFor="currentRegimen" className="text-base font-medium text-gray-700 block">
                    Current ART Regimen *
                  </Label>
                  <Select onValueChange={(value) => form.setValue("currentRegimen", value)}>
                    <SelectTrigger className="w-full py-[23px] h-16 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base px-6">
                      <SelectValue placeholder="Select regimen" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-lg rounded-xl">
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

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 block">Date Started ART *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-16 px-6 justify-start text-left font-normal border-gray-200 rounded-xl hover:border-red-500 transition-all duration-200",
                          !form.watch("dateStartedArt") && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {form.watch("dateStartedArt") ? (
                          format(form.watch("dateStartedArt"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-lg rounded-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("dateStartedArt")}
                        onSelect={(date) => form.setValue("dateStartedArt", date!)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.dateStartedArt && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.dateStartedArt.message}</p>
                  )}
                </div>

                {/* Row 2 */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 block">
                    Pregnant {form.watch("gender") === "female" ? "*" : ""}
                  </Label>
                  <Select 
                    onValueChange={(value: "yes" | "no" | "unknown" | "not_applicable") => form.setValue("isPregnant", value)}
                    disabled={form.watch("gender") === "male"}
                    value={form.watch("gender") === "male" ? "not_applicable" : form.watch("isPregnant")}
                  >
                    <SelectTrigger className={`w-full py-[23px] h-16 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base px-6 ${
                      form.watch("gender") === "male" ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}>
                      <SelectValue placeholder={
                        form.watch("gender") === "male" ? "Not applicable (Male)" : "Select option"
                      } />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-lg rounded-xl">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.isPregnant && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.isPregnant.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 block">TB Status *</Label>
                  <Select onValueChange={(value: "yes" | "no" | "unknown") => form.setValue("hasTb", value)}>
                    <SelectTrigger className="w-full py-[23px] h-16 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base px-6">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-lg rounded-xl">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.hasTb && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.hasTb.message}</p>
                  )}
                </div>

                {/* Row 3 */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 block">Adherence Level *</Label>
                  <Select onValueChange={(value: "good" | "fair" | "poor") => form.setValue("adherenceLevel", value)}>
                    <SelectTrigger className="w-full py-[23px] h-16 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base px-6">
                      <SelectValue placeholder="Select adherence level" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-lg rounded-xl">
                      <SelectItem value="good">Good (≥95%)</SelectItem>
                      <SelectItem value="fair">Fair (85-94%)</SelectItem>
                      <SelectItem value="poor">Poor (≤85%)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.adherenceLevel && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.adherenceLevel.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 block">WHO Stage *</Label>
                  <Select onValueChange={(value: "1" | "2" | "3" | "4") => form.setValue("whoStage", value)}>
                    <SelectTrigger className="w-full py-[23px] h-16 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base px-6">
                      <SelectValue placeholder="Select WHO stage" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-lg rounded-xl">
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

                {/* Full width sections */}
                <div className="space-y-3 col-span-2">
                  <Label htmlFor="indication" className="text-base font-medium text-gray-700 block">
                    Indication for VL Testing *
                  </Label>
                  <Select onValueChange={(value) => form.setValue("indication", value)}>
                    <SelectTrigger className="w-full py-[23px] h-16 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 text-base px-6">
                      <SelectValue placeholder="Select indication" />
                    </SelectTrigger>
                    <SelectContent className="border-0 shadow-lg rounded-xl">
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

                <div className="space-y-3 col-span-2">
                  <Label htmlFor="clinicalNotes" className="text-base font-medium text-gray-700 block">
                    Clinical Notes <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="clinicalNotes"
                    {...form.register("clinicalNotes")}
                    className="w-full px-6 py-4 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500/20 min-h-[120px] text-base transition-all duration-200"
                    placeholder="Additional clinical information..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pb-12">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-16 px-8 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-16 px-12 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 rounded-xl transition-all duration-200 font-medium shadow-lg disabled:shadow-none"
            >
              {isSubmitting ? "Creating Request..." : "Create Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 