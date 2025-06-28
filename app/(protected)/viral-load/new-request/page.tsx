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
import { CalendarIcon, TestTube, AlertTriangle, Settings } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";
import { api } from "@/trpc/react";

const formSchema = z.object({
  // Patient Information
  art_number: z.string().min(1, "ART number is required"),
  other_id: z.string().optional(),
  gender: z.enum(["M", "F"], { required_error: "Gender is required" }),
  dob: z.string().min(1, "Date of birth is required"),
  age: z.string().optional(),
  age_units: z.enum(["Years", "Months", "Days"]).optional(),
  patient_phone_number: z.string().optional(),
  
  // Requesting Clinician
  clinician_id: z.string().optional(),
  requested_on: z.string().optional(),
  
  // Treatment Information
  treatment_initiation_date: z.string().min(1, "Treatment initiation date is required"),
  current_regimen_id: z.string().optional(),
  current_regimen_initiation_date: z.string().min(1, "Current regimen initiation date is required"),
  
  // Health Information
  pregnant: z.enum(["Y", "N", "U"]).optional(),
  anc_number: z.string().optional(),
  breast_feeding: z.enum(["Y", "N", "U"]).optional(),
  active_tb_status: z.enum(["Y", "N", "U"]).optional(),
  tb_treatment_phase_id: z.string().optional(),
  arv_adherence_id: z.string().optional(),
  treatment_care_approach: z.string().optional(),
  current_who_stage: z.string().optional(),
  treatment_indication_id: z.string().optional(),
}).refine((data) => {
  // If gender is female, pregnancy status is required
  if (data.gender === "F") {
    return data.pregnant && ["Y", "N", "U"].includes(data.pregnant);
  }
  return true;
}, {
  message: "Please select pregnancy status for female patients",
  path: ["pregnant"],
});

type FormData = z.infer<typeof formSchema>;

export default function NewViralLoadRequest(): React.JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useAuth();

  // Date component states
  const [dobDay, setDobDay] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<string>("");
  const [dobYear, setDobYear] = useState<string>("");
  
  const [treatmentDay, setTreatmentDay] = useState<string>("");
  const [treatmentMonth, setTreatmentMonth] = useState<string>("");
  const [treatmentYear, setTreatmentYear] = useState<string>("");
  
  const [regimenDay, setRegimenDay] = useState<string>("");
  const [regimenMonth, setRegimenMonth] = useState<string>("");
  const [regimenYear, setRegimenYear] = useState<string>("");

  const createRequest = api.viralLoad.createRequest.useMutation({
    onSuccess: (data) => {
      console.log("Request created successfully:", data);
      toast.success("Viral load request created successfully!", {
        description: `Sample ID: ${data.sampleId}`,
        action: {
          label: "View Requests",
          onClick: () => router.push("/viral-load/pending-collection"),
        },
      });
      router.push("/viral-load/pending-collection");
    },
    onError: (error) => {
      console.error("Error creating request:", error);
      
      // Show error toast with action to go to settings if it's a facility error
      if (error.message.includes("facility information")) {
        toast.error("Facility Setup Required", {
          description: error.message,
          action: {
            label: "Go to Settings",
            onClick: () => router.push("/settings/edit-facility"),
          },
          duration: 10000, // Show longer for important actions
        });
      } else {
        toast.error("Failed to create request", {
          description: error.message,
        });
      }
      
      setIsSubmitting(false);
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      art_number: "",
      other_id: "",
      gender: undefined,
      dob: "",
      age: "",
      age_units: "Years",
      patient_phone_number: "",
      clinician_id: "",
      current_regimen_id: "",
      tb_treatment_phase_id: "",
      arv_adherence_id: "",
      treatment_care_approach: "",
      current_who_stage: "",
      treatment_indication_id: "",
      treatment_initiation_date: "",
      current_regimen_initiation_date: "",
      requested_on: new Date().toISOString().split('T')[0],
    },
  });

  // Handle conditional logic for pregnancy field
  const watchedGender = form.watch("gender");
  useEffect(() => {
    if (watchedGender === "M") {
      form.setValue("pregnant", undefined);
    }
  }, [watchedGender, form]);

  // Handle conditional logic for TB treatment phase field
  const watchedTbStatus = form.watch("active_tb_status");
  useEffect(() => {
    if (watchedTbStatus === "N") {
      form.setValue("tb_treatment_phase_id", undefined);
    }
  }, [watchedTbStatus, form]);

  // Combine date parts into complete dates
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const dateString = `${dobYear}-${dobMonth}-${dobDay}`;
      console.log("Setting DOB:", dateString);
      form.setValue("dob", dateString);
      form.trigger("dob"); // Trigger validation
    } else {
      form.setValue("dob", "");
    }
  }, [dobDay, dobMonth, dobYear, form]);

  useEffect(() => {
    if (treatmentDay && treatmentMonth && treatmentYear) {
      const dateString = `${treatmentYear}-${treatmentMonth}-${treatmentDay}`;
      console.log("Setting treatment initiation date:", dateString);
      form.setValue("treatment_initiation_date", dateString);
      form.trigger("treatment_initiation_date"); // Trigger validation
    } else {
      form.setValue("treatment_initiation_date", "");
    }
  }, [treatmentDay, treatmentMonth, treatmentYear, form]);

  useEffect(() => {
    if (regimenDay && regimenMonth && regimenYear) {
      const dateString = `${regimenYear}-${regimenMonth}-${regimenDay}`;
      console.log("Setting regimen initiation date:", dateString);
      form.setValue("current_regimen_initiation_date", dateString);
      form.trigger("current_regimen_initiation_date"); // Trigger validation
    } else {
      form.setValue("current_regimen_initiation_date", "");
    }
  }, [regimenDay, regimenMonth, regimenYear, form]);

  const onSubmit = async (data: FormData): Promise<void> => {
    console.log("Form submission started", data);
    setIsSubmitting(true);
    
    try {
      // Zod validation is automatically handled by react-hook-form
      // If we reach here, all validations have passed

      await createRequest.mutateAsync({
        art_number: data.art_number,
        other_id: data.other_id || "",
        gender: data.gender,
        dob: data.dob,
        treatment_initiation_date: data.treatment_initiation_date,
        current_regimen_initiation_date: data.current_regimen_initiation_date,
        pregnant: data.pregnant,
        anc_number: data.anc_number || "",
        breast_feeding: data.breast_feeding,
        active_tb_status: data.active_tb_status,
        age: data.age || "",
        age_units: data.age_units,
        patient_phone_number: data.patient_phone_number || "",
        clinician_id: data.clinician_id || "",
        requested_on: data.requested_on || "",
        current_regimen_id: data.current_regimen_id || "",
        tb_treatment_phase_id: data.tb_treatment_phase_id || "",
        arv_adherence_id: data.arv_adherence_id || "",
        treatment_care_approach: data.treatment_care_approach || "",
        current_who_stage: data.current_who_stage || "",
        treatment_indication_id: data.treatment_indication_id || "",
      });
    } catch (error) {
      console.error("Failed to create request:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:container md:px-0 px-4 pt-4 md:mx-auto">
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

          {/* Facility Information - Single Line Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Facility:</span> {user?.facility_name || "Not specified"} | 
              <span className="font-medium"> District:</span> {user?.hub_name ? user.hub_name.split(' ')[0] : "Not specified"} | 
              <span className="font-medium"> Hub:</span> {user?.hub_name || "Not specified"}
            </div>
          </div>

          {/* Requesting Clinician Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Requesting Clinician
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinician_id" className="text-sm font-medium text-gray-700">
                  Clinician Name
                </Label>
                <Input
                  id="clinician_id"
                  {...form.register("clinician_id")}
                  placeholder="Enter clinician name"
                  className="mt-2 h-10"
                />
              </div>

              <div>
                <Label htmlFor="requested_on" className="text-sm font-medium text-gray-700">
                  Request Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                                          <Button
                        variant={"outline"}
                        className={cn(
                          "mt-2 w-full h-10 justify-start text-left font-normal",
                          !form.watch("requested_on") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("requested_on") ? format(new Date(form.watch("requested_on")!), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.watch("requested_on") ? new Date(form.watch("requested_on")!) : undefined}
                        onSelect={(date) => form.setValue("requested_on", date ? date.toISOString().split('T')[0] : "")}
                        initialFocus
                      />
                  </PopoverContent>
                </Popover>
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
            <div className="space-y-4">
              {/* First Row: Patient Clinic ID/ART #, Other ID, Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="art_number" className="text-sm font-medium text-gray-700">
                    Patient Clinic ID/ART #: *
                  </Label>
                  <Input
                    id="art_number"
                    {...form.register("art_number")}
                    placeholder="Please enter lab number"
                    className="mt-2 h-10"
                  />
                  {form.formState.errors.art_number && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.art_number.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="other_id" className="text-sm font-medium text-gray-700">
                    Other ID:
                  </Label>
                  <Input
                    id="other_id"
                    {...form.register("other_id")}
                    placeholder=""
                    className="mt-2 h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Gender:
                  </Label>
                  <Select onValueChange={(value) => {
                    form.setValue("gender", value as "M" | "F");
                    form.trigger("gender"); // Trigger validation
                  }}>
                    <SelectTrigger className="mt-2 h-10 w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.gender.message}</p>
                  )}
                </div>
              </div>

              {/* Second Row: Date of Birth, Age, Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                    Date of Birth:
                  </Label>
                  <div className="flex gap-1 mt-2 items-center">
                    <Select onValueChange={setDobDay} value={dobDay}>
                      <SelectTrigger className="h-10 w-20">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 31}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-gray-500">/</span>
                    <Select onValueChange={setDobMonth} value={dobMonth}>
                      <SelectTrigger className="h-10 w-20">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-gray-500">/</span>
                    <Select onValueChange={setDobYear} value={dobYear}>
                      <SelectTrigger className="h-10 w-24">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 100}, (_, i) => (
                          <SelectItem key={2024-i} value={String(2024-i)}>
                            {2024-i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {form.formState.errors.dob && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.dob.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                    Age:
                  </Label>
                  <div className="flex gap-2 mt-2 items-center">
                    <Input
                      id="age"
                      {...form.register("age")}
                      placeholder=""
                      className="h-10 flex-1"
                      type="number"
                      min="0"
                    />
                    <Select defaultValue="Years">
                      <SelectTrigger className="h-10 w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="patient_phone_number" className="text-sm font-medium text-gray-700">
                    Phone Number:
                  </Label>
                  <Input
                    id="patient_phone_number"
                    {...form.register("patient_phone_number")}
                    placeholder=""
                    className="mt-2 h-10"
                  />
                </div>
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
            <div className="space-y-4">
              {/* First Row: Treatment Initiation Date, Current regimen, Current regimen initiation date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="treatment_initiation_date" className="text-sm font-medium text-gray-700">
                    Treatment Initiation Date:
                  </Label>
                  <div className="flex gap-1 mt-2 items-center">
                    <Select onValueChange={setTreatmentDay} value={treatmentDay}>
                      <SelectTrigger className="h-10 w-20">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 31}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-gray-500">/</span>
                    <Select onValueChange={setTreatmentMonth} value={treatmentMonth}>
                      <SelectTrigger className="h-10 w-20">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-gray-500">/</span>
                    <Select onValueChange={setTreatmentYear} value={treatmentYear}>
                      <SelectTrigger className="h-10 w-24">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 100}, (_, i) => (
                          <SelectItem key={2024-i} value={String(2024-i)}>
                            {2024-i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {form.formState.errors.treatment_initiation_date && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.treatment_initiation_date.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="current_regimen_id" className="text-sm font-medium text-gray-700">
                    Current regimen:
                  </Label>
                  <Select onValueChange={(value) => form.setValue("current_regimen_id", value)}>
                    <SelectTrigger className="mt-2 h-10 w-full">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="110">3A=TDF+3TC+EFV</SelectItem>
                      <SelectItem value="111">3B=TDF+3TC+NVP</SelectItem>
                      <SelectItem value="112">3C=AZT-3TC-NVP</SelectItem>
                      <SelectItem value="113">3D=AZT-3TC-EFV</SelectItem>
                      <SelectItem value="114">3E=ABC-3TC-NVP</SelectItem>
                      <SelectItem value="115">3F=ABC-3TC-EFV</SelectItem>
                      <SelectItem value="116">3M=ABC-3TC-DTG</SelectItem>
                      <SelectItem value="117">3N=TDF-3TC-DTG</SelectItem>
                      <SelectItem value="118">3K=OTHERS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="current_regimen_initiation_date" className="text-sm font-medium text-gray-700">
                    Current regimen initiation date:
                  </Label>
                  <div className="flex gap-1 mt-2 items-center">
                    <Select onValueChange={setRegimenDay} value={regimenDay}>
                      <SelectTrigger className="h-10 w-20">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 31}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-gray-500">/</span>
                    <Select onValueChange={setRegimenMonth} value={regimenMonth}>
                      <SelectTrigger className="h-10 w-20">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-gray-500">/</span>
                    <Select onValueChange={setRegimenYear} value={regimenYear}>
                      <SelectTrigger className="h-10 w-24">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 100}, (_, i) => (
                          <SelectItem key={2024-i} value={String(2024-i)}>
                            {2024-i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {form.formState.errors.current_regimen_initiation_date && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.current_regimen_initiation_date.message}</p>
                  )}
                </div>
              </div>

              {/* Second Row: Pregnant, ANC Number, Mother Breast-Feeding */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pregnant" className={`text-sm font-medium ${watchedGender !== "F" ? "text-gray-400" : "text-gray-700"}`}>
                    Pregnant:
                  </Label>
                  <Select 
                    onValueChange={(value) => form.setValue("pregnant", value as "Y" | "N" | "U")}
                    disabled={watchedGender !== "F"}
                  >
                    <SelectTrigger className={`mt-2 h-10 w-full ${watchedGender !== "F" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Yes</SelectItem>
                      <SelectItem value="N">No</SelectItem>
                      <SelectItem value="U">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="anc_number" className={`text-sm font-medium ${watchedGender !== "F" ? "text-gray-400" : "text-gray-700"}`}>
                    ANC Number:
                  </Label>
                  <Input
                    id="anc_number"
                    {...form.register("anc_number")}
                    placeholder=""
                    className={`mt-2 h-10 ${watchedGender !== "F" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                    disabled={watchedGender !== "F"}
                  />
                </div>

                <div>
                  <Label htmlFor="breast_feeding" className={`text-sm font-medium ${watchedGender !== "F" ? "text-gray-400" : "text-gray-700"}`}>
                    Mother Breast-Feeding:
                  </Label>
                  <Select 
                    onValueChange={(value) => form.setValue("breast_feeding", value as "Y" | "N" | "U")}
                    disabled={watchedGender !== "F"}
                  >
                    <SelectTrigger className={`mt-2 h-10 w-full ${watchedGender !== "F" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Yes</SelectItem>
                      <SelectItem value="N">No</SelectItem>
                      <SelectItem value="U">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Third Row: Active TB Status, TB Treatment Phase, ARV Adherence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="active_tb_status" className="text-sm font-medium text-gray-700">
                    Active TB Status:
                  </Label>
                  <Select onValueChange={(value) => form.setValue("active_tb_status", value as "Y" | "N" | "U")}>
                    <SelectTrigger className="mt-2 h-10 w-full">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Yes</SelectItem>
                      <SelectItem value="N">No</SelectItem>
                      <SelectItem value="U">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tb_treatment_phase_id" className={`text-sm font-medium ${watchedTbStatus === "N" ? "text-gray-400" : "text-gray-700"}`}>
                    TB Treatment Phase:
                  </Label>
                  <Select 
                    onValueChange={(value) => form.setValue("tb_treatment_phase_id", value)}
                    disabled={watchedTbStatus === "N"}
                  >
                    <SelectTrigger className={`mt-2 h-10 w-full ${watchedTbStatus === "N" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="82">Initiation Phase</SelectItem>
                      <SelectItem value="83">Continuation Phase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="arv_adherence_id" className="text-sm font-medium text-gray-700">
                    ARV Adherence:
                  </Label>
                  <Select onValueChange={(value) => form.setValue("arv_adherence_id", value)}>
                    <SelectTrigger className="mt-2 h-10 w-full">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Good &gt; 95%</SelectItem>
                      <SelectItem value="2">Fair 85 - 94%</SelectItem>
                      <SelectItem value="3">Poor &lt; 85%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Fourth Row: Treatment Care Approach, Current WHO Stage, Indication for Viral Load Testing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="treatment_care_approach" className="text-sm font-medium text-gray-700">
                    Treatment Care Approach (DSDM):
                  </Label>
                  <Select onValueChange={(value) => form.setValue("treatment_care_approach", value)}>
                    <SelectTrigger className="mt-2 h-10 w-full">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">FBIM</SelectItem>
                      <SelectItem value="2">FBG</SelectItem>
                      <SelectItem value="3">FTDR</SelectItem>
                      <SelectItem value="4">CDDP</SelectItem>
                      <SelectItem value="5">CCLAD</SelectItem>
                      <SelectItem value="6">CRPDDP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="current_who_stage" className="text-sm font-medium text-gray-700">
                    Current WHO Stage:
                  </Label>
                  <Select onValueChange={(value) => form.setValue("current_who_stage", value)}>
                    <SelectTrigger className="mt-2 h-10 w-full">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">I</SelectItem>
                      <SelectItem value="2">II</SelectItem>
                      <SelectItem value="3">III</SelectItem>
                      <SelectItem value="4">IV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="treatment_indication_id" className="text-sm font-medium text-gray-700">
                    Indication for Viral Load Testing:
                  </Label>
                  <Select onValueChange={(value) => form.setValue("treatment_indication_id", value)}>
                    <SelectTrigger className="mt-2 h-10 w-full">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="93">Routine Monitoring</SelectItem>
                      <SelectItem value="94">Repeat Viral Load</SelectItem>
                      <SelectItem value="95">Suspected Treatment Failure</SelectItem>
                      <SelectItem value="97">6 months after ART initiation</SelectItem>
                      <SelectItem value="98">12 months after ART initiation</SelectItem>
                      <SelectItem value="99">Repeat (after IAC)</SelectItem>
                      <SelectItem value="100">1st ANC For PMTCT</SelectItem>
                      <SelectItem value="220">Special Consideration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>



          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                console.log("Submit button clicked");
                console.log("Form errors:", form.formState.errors);
                console.log("Form values:", form.getValues());
                console.log("Form valid:", form.formState.isValid);
              }}
            >
              {isSubmitting ? (
                <>
                  <TestTube className="mr-2 h-4 w-4 animate-spin" />
                  Creating Request...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  Create Viral Load Request
                </>
              )}
            </Button>
            <Link href="/viral-load">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 