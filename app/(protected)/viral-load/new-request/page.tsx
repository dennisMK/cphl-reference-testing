"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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
  clinicianEmail: z.string().email("Valid email required").optional(),
  
  // Patient Information
  patientId: z.string().min(1, "Patient ID is required"),
  patientName: z.string().min(1, "Patient name is required"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  age: z.string().min(1, "Age is required"),
  phoneNumber: z.string().optional(),
  
  // Treatment Information
  currentRegimen: z.string().min(1, "Current regimen is required"),
  dateStartedArt: z.date({ required_error: "ART start date is required" }),
  isPregnant: z.enum(["yes", "no", "unknown"], { required_error: "Pregnancy status required" }),
  hasTb: z.enum(["yes", "no", "unknown"], { required_error: "TB status required" }),
  adherenceLevel: z.enum(["good", "fair", "poor"], { required_error: "Adherence level required" }),
  whoStage: z.enum(["1", "2", "3", "4"], { required_error: "WHO stage required" }),
  indication: z.string().min(1, "Indication is required"),
  clinicalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function NewViralLoadRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityName: "Butabika Hospital",
      district: "Kampala",
      hub: "Kampala Hub",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("New Viral Load Request:", data);
    
    // Redirect to pending collection
    router.push("/viral-load/pending-collection");
  };

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
              <h1 className="text-3xl font-bold text-gray-900">New Viral Load Request</h1>
              <p className="text-gray-600 mt-1">Create a new viral load testing request</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
              Step 1 of 3
            </Badge>
            <span className="text-sm text-gray-500">Request Creation</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Facility Information */}
          <Card className="border-red-200 shadow-sm">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <MapPinIcon className="h-5 w-5" />
                <span>Facility Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facilityName" className="text-sm font-medium text-gray-700">
                    Facility Name *
                  </Label>
                  <Input
                    id="facilityName"
                    {...form.register("facilityName")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter facility name"
                  />
                  {form.formState.errors.facilityName && (
                    <p className="text-sm text-red-600">{form.formState.errors.facilityName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityCode" className="text-sm font-medium text-gray-700">
                    Facility Code *
                  </Label>
                  <Input
                    id="facilityCode"
                    {...form.register("facilityCode")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter facility code"
                  />
                  {form.formState.errors.facilityCode && (
                    <p className="text-sm text-red-600">{form.formState.errors.facilityCode.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                    District *
                  </Label>
                  <Input
                    id="district"
                    {...form.register("district")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter district"
                  />
                  {form.formState.errors.district && (
                    <p className="text-sm text-red-600">{form.formState.errors.district.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hub" className="text-sm font-medium text-gray-700">
                    Testing Hub *
                  </Label>
                  <Input
                    id="hub"
                    {...form.register("hub")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter testing hub"
                  />
                  {form.formState.errors.hub && (
                    <p className="text-sm text-red-600">{form.formState.errors.hub.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requesting Clinician */}
          <Card className="border-red-200 shadow-sm">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <UserIcon className="h-5 w-5" />
                <span>Requesting Clinician</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clinicianName" className="text-sm font-medium text-gray-700">
                    Clinician Name *
                  </Label>
                  <Input
                    id="clinicianName"
                    {...form.register("clinicianName")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Dr. John Doe"
                  />
                  {form.formState.errors.clinicianName && (
                    <p className="text-sm text-red-600">{form.formState.errors.clinicianName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicianPhone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="clinicianPhone"
                    {...form.register("clinicianPhone")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="+256 700 000 000"
                  />
                  {form.formState.errors.clinicianPhone && (
                    <p className="text-sm text-red-600">{form.formState.errors.clinicianPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="clinicianEmail" className="text-sm font-medium text-gray-700">
                    Email Address (Optional)
                  </Label>
                  <Input
                    id="clinicianEmail"
                    type="email"
                    {...form.register("clinicianEmail")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="doctor@facility.com"
                  />
                  {form.formState.errors.clinicianEmail && (
                    <p className="text-sm text-red-600">{form.formState.errors.clinicianEmail.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card className="border-red-200 shadow-sm">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <HeartIcon className="h-5 w-5" />
                <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientId" className="text-sm font-medium text-gray-700">
                    Patient ID *
                  </Label>
                  <Input
                    id="patientId"
                    {...form.register("patientId")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="P001234"
                  />
                  {form.formState.errors.patientId && (
                    <p className="text-sm text-red-600">{form.formState.errors.patientId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientName" className="text-sm font-medium text-gray-700">
                    Patient Name *
                  </Label>
                  <Input
                    id="patientName"
                    {...form.register("patientName")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Jane Doe"
                  />
                  {form.formState.errors.patientName && (
                    <p className="text-sm text-red-600">{form.formState.errors.patientName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Gender *</Label>
                  <RadioGroup
                    value={form.watch("gender")}
                    onValueChange={(value: "male" | "female") => form.setValue("gender", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" className="border-red-300 text-red-600" />
                      <Label htmlFor="male" className="text-sm font-normal">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" className="border-red-300 text-red-600" />
                      <Label htmlFor="female" className="text-sm font-normal">Female</Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-600">{form.formState.errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Date of Birth *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-300 hover:border-red-500",
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
                    <p className="text-sm text-red-600">{form.formState.errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    {...form.register("age")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="25 years"
                  />
                  {form.formState.errors.age && (
                    <p className="text-sm text-red-600">{form.formState.errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phoneNumber"
                    {...form.register("phoneNumber")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="+256 700 000 000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Information */}
          <Card className="border-red-200 shadow-sm">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <ClipboardIcon className="h-5 w-5" />
                <span>Treatment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentRegimen" className="text-sm font-medium text-gray-700">
                    Current ART Regimen *
                  </Label>
                  <Select onValueChange={(value) => form.setValue("currentRegimen", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
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
                    <p className="text-sm text-red-600">{form.formState.errors.currentRegimen.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Date Started ART *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-300 hover:border-red-500",
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
                    <p className="text-sm text-red-600">{form.formState.errors.dateStartedArt.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Pregnant *</Label>
                  <RadioGroup
                    value={form.watch("isPregnant")}
                    onValueChange={(value: "yes" | "no" | "unknown") => form.setValue("isPregnant", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pregnant-yes" className="border-red-300 text-red-600" />
                      <Label htmlFor="pregnant-yes" className="text-sm font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pregnant-no" className="border-red-300 text-red-600" />
                      <Label htmlFor="pregnant-no" className="text-sm font-normal">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unknown" id="pregnant-unknown" className="border-red-300 text-red-600" />
                      <Label htmlFor="pregnant-unknown" className="text-sm font-normal">Unknown</Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.isPregnant && (
                    <p className="text-sm text-red-600">{form.formState.errors.isPregnant.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">TB Status *</Label>
                  <RadioGroup
                    value={form.watch("hasTb")}
                    onValueChange={(value: "yes" | "no" | "unknown") => form.setValue("hasTb", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="tb-yes" className="border-red-300 text-red-600" />
                      <Label htmlFor="tb-yes" className="text-sm font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="tb-no" className="border-red-300 text-red-600" />
                      <Label htmlFor="tb-no" className="text-sm font-normal">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unknown" id="tb-unknown" className="border-red-300 text-red-600" />
                      <Label htmlFor="tb-unknown" className="text-sm font-normal">Unknown</Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.hasTb && (
                    <p className="text-sm text-red-600">{form.formState.errors.hasTb.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Adherence Level *</Label>
                  <Select onValueChange={(value: "good" | "fair" | "poor") => form.setValue("adherenceLevel", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select adherence level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good (>95%)</SelectItem>
                      <SelectItem value="fair">Fair (85-94%)</SelectItem>
                      <SelectItem value="poor">Poor (<85%)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.adherenceLevel && (
                    <p className="text-sm text-red-600">{form.formState.errors.adherenceLevel.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">WHO Stage *</Label>
                  <Select onValueChange={(value: "1" | "2" | "3" | "4") => form.setValue("whoStage", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
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
                    <p className="text-sm text-red-600">{form.formState.errors.whoStage.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="indication" className="text-sm font-medium text-gray-700">
                    Indication for VL Testing *
                  </Label>
                  <Select onValueChange={(value) => form.setValue("indication", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
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
                    <p className="text-sm text-red-600">{form.formState.errors.indication.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="clinicalNotes" className="text-sm font-medium text-gray-700">
                    Clinical Notes (Optional)
                  </Label>
                  <Textarea
                    id="clinicalNotes"
                    {...form.register("clinicalNotes")}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 min-h-[100px]"
                    placeholder="Additional clinical information..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 px-8"
            >
              {isSubmitting ? "Creating Request..." : "Create Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 