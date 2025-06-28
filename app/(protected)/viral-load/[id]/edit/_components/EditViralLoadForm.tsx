"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/trpc/react";

const formSchema = z.object({
  // Patient Information
  art_number: z.string().min(1, "ART number is required"),
  other_id: z.string().optional(),
  gender: z.enum(["M", "F"], { required_error: "Gender is required" }).optional(),
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

interface EditViralLoadFormProps {
  sample: any; // The loaded sample data
  sampleId: string;
  user: any;
}

export default function EditViralLoadForm({ sample, sampleId, user }: EditViralLoadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const initializationRef = useRef(false);

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

  // Update sample mutation
  const updateSampleMutation = api.viralLoad.updateSample.useMutation({
    onSuccess: () => {
      toast.success("Sample updated successfully!");
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update sample: ${error.message}`)
      setIsSubmitting(false)
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Handle conditional logic for pregnancy field
  const watchedGender = form.watch("gender");
  useEffect(() => {
    if (watchedGender === "M") {
      form.setValue("pregnant", "N");
      form.setValue("breast_feeding", "N");
      form.setValue("anc_number", "");
    }
  }, [watchedGender, form]);

  // Handle conditional logic for TB treatment phase field
  const watchedTbStatus = form.watch("active_tb_status");
  useEffect(() => {
    if (watchedTbStatus === "N") {
      form.setValue("tb_treatment_phase_id", "");
    }
  }, [watchedTbStatus, form]);

  // Initialize form with sample data - only runs once when sample is provided
  useEffect(() => {
    console.log("useEffect triggered:", { sample: !!sample, patient_data: !!sample?.patient_data, isFormInitialized, initializationRef: initializationRef.current });
    
    if (sample && !initializationRef.current) {
      console.log("Initializing form with sample data:", sample);
      console.log("Sample patient_data:", sample.patient_data);
      
      // Prepare form data object
      const formData: Partial<FormData> = {
        // Patient Information
        art_number: sample.patient_data?.art_number || sample.patient_unique_id || "",
        other_id: sample.patient_data?.other_id || "",
        gender: (sample.patient_data?.gender && ["M", "F"].includes(sample.patient_data.gender)) 
          ? sample.patient_data.gender as "M" | "F" 
          : undefined,
        age: "", // Would need to be calculated or stored separately
        age_units: "Years",
        patient_phone_number: sample.patient_phone_number || "",
        
        // Requesting Clinician
        clinician_id: sample.clinician_id ? String(sample.clinician_id) : "",
        requested_on: sample.requested_on 
          ? (sample.requested_on instanceof Date ? sample.requested_on : new Date(sample.requested_on)).toISOString().split('T')[0]
          : "",
        
        // Health Information
        pregnant: (sample.pregnant && ["Y", "N", "U"].includes(sample.pregnant)) 
          ? sample.pregnant as "Y" | "N" | "U" 
          : undefined,
        anc_number: sample.anc_number || "",
        breast_feeding: (sample.breast_feeding && ["Y", "N", "U"].includes(sample.breast_feeding)) 
          ? sample.breast_feeding as "Y" | "N" | "U" 
          : undefined,
        active_tb_status: (sample.active_tb_status && ["Y", "N", "U"].includes(sample.active_tb_status)) 
          ? sample.active_tb_status as "Y" | "N" | "U" 
          : undefined,
        
        // Treatment Information
        current_regimen_id: (sample.current_regimen_id !== null && sample.current_regimen_id !== undefined) 
          ? String(sample.current_regimen_id) 
          : "",
        tb_treatment_phase_id: (sample.tb_treatment_phase_id !== null && sample.tb_treatment_phase_id !== undefined) 
          ? String(sample.tb_treatment_phase_id) 
          : "",
        arv_adherence_id: (sample.arv_adherence_id !== null && sample.arv_adherence_id !== undefined) 
          ? String(sample.arv_adherence_id) 
          : "",
        treatment_care_approach: (sample.treatment_care_approach !== null && sample.treatment_care_approach !== undefined) 
          ? String(sample.treatment_care_approach) 
          : "",
        current_who_stage: (sample.current_who_stage !== null && sample.current_who_stage !== undefined) 
          ? String(sample.current_who_stage) 
          : "",
        treatment_indication_id: (sample.treatment_indication_id !== null && sample.treatment_indication_id !== undefined) 
          ? String(sample.treatment_indication_id) 
          : "",
      };

      // Handle dates
      if (sample.patient_data?.dob) {
        const dobDate = new Date(sample.patient_data.dob);
        setDobDay(String(dobDate.getDate()).padStart(2, '0'));
        setDobMonth(String(dobDate.getMonth() + 1).padStart(2, '0'));
        setDobYear(String(dobDate.getFullYear()));
        formData.dob = dobDate.toISOString().split('T')[0];
      }

      if (sample.treatment_initiation_date) {
        const treatmentDate = new Date(sample.treatment_initiation_date);
        setTreatmentDay(String(treatmentDate.getDate()).padStart(2, '0'));
        setTreatmentMonth(String(treatmentDate.getMonth() + 1).padStart(2, '0'));
        setTreatmentYear(String(treatmentDate.getFullYear()));
        formData.treatment_initiation_date = treatmentDate.toISOString().split('T')[0];
      }

      if (sample.current_regimen_initiation_date) {
        const regimenDate = new Date(sample.current_regimen_initiation_date);
        setRegimenDay(String(regimenDate.getDate()).padStart(2, '0'));
        setRegimenMonth(String(regimenDate.getMonth() + 1).padStart(2, '0'));
        setRegimenYear(String(regimenDate.getFullYear()));
        formData.current_regimen_initiation_date = regimenDate.toISOString().split('T')[0];
      }

      // Use reset() to properly initialize the form
      console.log("About to reset form with data:", formData);
      form.reset(formData);
      initializationRef.current = true;
      setIsFormInitialized(true);
      
      console.log("Form reset completed. Current form values:", form.getValues());
      console.log("Form state after reset:", { 
        isFormInitialized: true,
        formValues: form.getValues(),
        errors: form.formState.errors 
      });
    }
  }, [sample?.id]); // Only depend on sample ID to prevent double initialization

  // Combine date parts into complete dates
  useEffect(() => {
    if (isFormInitialized) {
      if (dobDay && dobMonth && dobYear) {
        const dateString = `${dobYear}-${dobMonth}-${dobDay}`;
        form.setValue("dob", dateString);
        form.trigger("dob");
      } else {
        form.setValue("dob", "");
      }
    }
  }, [dobDay, dobMonth, dobYear, form, isFormInitialized]);

  useEffect(() => {
    if (isFormInitialized) {
      if (treatmentDay && treatmentMonth && treatmentYear) {
        const dateString = `${treatmentYear}-${treatmentMonth}-${treatmentDay}`;
        form.setValue("treatment_initiation_date", dateString);
        form.trigger("treatment_initiation_date");
      } else {
        form.setValue("treatment_initiation_date", "");
      }
    }
  }, [treatmentDay, treatmentMonth, treatmentYear, form, isFormInitialized]);

  useEffect(() => {
    if (isFormInitialized) {
      if (regimenDay && regimenMonth && regimenYear) {
        const dateString = `${regimenYear}-${regimenMonth}-${regimenDay}`;
        form.setValue("current_regimen_initiation_date", dateString);
        form.trigger("current_regimen_initiation_date");
      } else {
        form.setValue("current_regimen_initiation_date", "");
      }
    }
  }, [regimenDay, regimenMonth, regimenYear, form, isFormInitialized]);

  const onSubmit = async (data: FormData): Promise<void> => {
    console.log("Form submission started", data);
    setIsSubmitting(true);
    
    try {
      // Ensure gender is provided
      if (!data.gender) {
        toast.error("Please select a gender");
        setIsSubmitting(false);
        return;
      }
      
      await updateSampleMutation.mutateAsync({
        sampleId: sampleId,
        ...data,
        gender: data.gender as "M" | "F"
      });
    } catch (error) {
      console.error("Failed to update sample:", error);
      setIsSubmitting(false);
    }
  };

  // Show loading state while form is being initialized
  if (!isFormInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Initializing form...</span>
        </div>
      </div>
    );
  }

  return (
    <form id="viral-load-edit-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
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
              <Select 
                value={form.watch("gender") || ""} 
                onValueChange={(value) => {
                  if (value && (value === "M" || value === "F")) {
                    form.setValue("gender", value as "M" | "F");
                    form.trigger("gender");
                  }
                }}
              >
                <SelectTrigger className="mt-2 h-10 w-full">
                  <SelectValue placeholder="Select gender" />
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
              <Select 
                value={form.watch("current_regimen_id") || ""} 
                onValueChange={(value) => form.setValue("current_regimen_id", value)}
              >
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
                value={form.watch("pregnant") || ""}
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
                value={form.watch("breast_feeding") || ""}
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
              <Select 
                value={form.watch("active_tb_status") || ""}
                onValueChange={(value) => form.setValue("active_tb_status", value as "Y" | "N" | "U")}
              >
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
                value={form.watch("tb_treatment_phase_id") || ""}
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
              <Select 
                value={form.watch("arv_adherence_id") || ""}
                onValueChange={(value) => form.setValue("arv_adherence_id", value)}
              >
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
              <Select 
                value={form.watch("treatment_care_approach") || ""}
                onValueChange={(value) => form.setValue("treatment_care_approach", value)}
              >
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
              <Select 
                value={form.watch("current_who_stage") || ""}
                onValueChange={(value) => form.setValue("current_who_stage", value)}
              >
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
              <Select 
                value={form.watch("treatment_indication_id") || ""}
                onValueChange={(value) => form.setValue("treatment_indication_id", value)}
              >
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
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        <Link href={`/viral-load/${sampleId}`}>
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
} 