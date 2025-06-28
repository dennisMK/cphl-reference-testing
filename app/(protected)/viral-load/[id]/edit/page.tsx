"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { CalendarIcon, Edit, ArrowLeft, Save, X, Loader2 } from "lucide-react";
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

export default function EditSamplePage(): React.JSX.Element {
  const router = useRouter();
  const { id } = useParams();
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

  // Fetch sample data using tRPC
  const { data: sample, isLoading: sampleLoading, error } = api.viralLoad.getSample.useQuery(
    { sampleId: id as string },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  // Update sample mutation
  const updateSampleMutation = api.viralLoad.updateSample.useMutation({
    onSuccess: () => {
      toast.success("Sample updated successfully!");
      setTimeout(() => {
        router.push(`/viral-load/${id as string}`)
      }, 1000)
    },
    onError: (error: any) => {
      toast.error(`Failed to update sample: ${error.message}`)
      setIsSubmitting(false)
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      art_number: "",
      other_id: "",
      gender: undefined, // Allow undefined initially, will be set from sample data
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
      requested_on: "",
    },
  });

  // Handle conditional logic for pregnancy field
  const watchedGender = form.watch("gender");
  useEffect(() => {
    if (watchedGender === "M") {
      form.setValue("pregnant", undefined);
    }
  }, [watchedGender, form]);

  // Initialize form with sample data
  useEffect(() => {
    if (sample) {
      console.log("Initializing form with sample data:", sample);
      
      // Set available properties from sample and patient data
      if (sample.patient_data?.art_number) {
        form.setValue("art_number", sample.patient_data.art_number);
      } else if (sample.patient_unique_id) {
        form.setValue("art_number", sample.patient_unique_id);
      }
      
      if (sample.patient_data?.other_id) {
        form.setValue("other_id", sample.patient_data.other_id);
      }
      
      if (sample.patient_data?.gender && ["M", "F"].includes(sample.patient_data.gender)) {
        form.setValue("gender", sample.patient_data.gender as "M" | "F");
      }
      
      // Health Information fields
      if (sample.pregnant && ["Y", "N", "U"].includes(sample.pregnant)) {
        form.setValue("pregnant", sample.pregnant as "Y" | "N" | "U");
      }
      if (sample.anc_number) {
        form.setValue("anc_number", sample.anc_number);
      }
      if (sample.breast_feeding && ["Y", "N", "U"].includes(sample.breast_feeding)) {
        form.setValue("breast_feeding", sample.breast_feeding as "Y" | "N" | "U");
      }
      if (sample.active_tb_status && ["Y", "N", "U"].includes(sample.active_tb_status)) {
        form.setValue("active_tb_status", sample.active_tb_status as "Y" | "N" | "U");
      }
      
      // Contact and clinician information
      if (sample.patient_phone_number) {
        form.setValue("patient_phone_number", sample.patient_phone_number);
      }
      
      if (sample.clinician_id) {
        form.setValue("clinician_id", String(sample.clinician_id));
      }
      
      // Treatment information - convert numbers to strings for form fields
      if (sample.current_regimen_id !== null && sample.current_regimen_id !== undefined) {
        form.setValue("current_regimen_id", String(sample.current_regimen_id));
      }
      
      if (sample.tb_treatment_phase_id !== null && sample.tb_treatment_phase_id !== undefined) {
        form.setValue("tb_treatment_phase_id", String(sample.tb_treatment_phase_id));
      }
      
      if (sample.arv_adherence_id !== null && sample.arv_adherence_id !== undefined) {
        form.setValue("arv_adherence_id", String(sample.arv_adherence_id));
      }
      
      if (sample.treatment_care_approach !== null && sample.treatment_care_approach !== undefined) {
        form.setValue("treatment_care_approach", String(sample.treatment_care_approach));
      }
      
      if (sample.current_who_stage !== null && sample.current_who_stage !== undefined) {
        form.setValue("current_who_stage", String(sample.current_who_stage));
      }
      
      if (sample.treatment_indication_id !== null && sample.treatment_indication_id !== undefined) {
        form.setValue("treatment_indication_id", String(sample.treatment_indication_id));
      }
      
      // Handle date fields that exist
      if (sample.requested_on) {
        const requestDate = sample.requested_on instanceof Date ? sample.requested_on : new Date(sample.requested_on);
        form.setValue("requested_on", requestDate.toISOString().split('T')[0]);
      }

      // Set treatment initiation date
      if (sample.treatment_initiation_date) {
        const treatmentDate = new Date(sample.treatment_initiation_date);
        setTreatmentDay(String(treatmentDate.getDate()).padStart(2, '0'));
        setTreatmentMonth(String(treatmentDate.getMonth() + 1).padStart(2, '0'));
        setTreatmentYear(String(treatmentDate.getFullYear()));
        const treatmentDateString = treatmentDate.toISOString().split('T')[0];
        form.setValue("treatment_initiation_date", treatmentDateString);
      }

      // Set current regimen initiation date
      if (sample.current_regimen_initiation_date) {
        const regimenDate = new Date(sample.current_regimen_initiation_date);
        setRegimenDay(String(regimenDate.getDate()).padStart(2, '0'));
        setRegimenMonth(String(regimenDate.getMonth() + 1).padStart(2, '0'));
        setRegimenYear(String(regimenDate.getFullYear()));
        const regimenDateString = regimenDate.toISOString().split('T')[0];
        form.setValue("current_regimen_initiation_date", regimenDateString);
      }

      // Set date of birth from patient data
      if (sample.patient_data?.dob) {
        const dobDate = new Date(sample.patient_data.dob);
        setDobDay(String(dobDate.getDate()).padStart(2, '0'));
        setDobMonth(String(dobDate.getMonth() + 1).padStart(2, '0'));
        setDobYear(String(dobDate.getFullYear()));
        const dobDateString = dobDate.toISOString().split('T')[0];
        form.setValue("dob", dobDateString);
      }

      console.log("Form values after initialization:", form.getValues());
    }
  }, [sample, form]);

  // Combine date parts into complete dates
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const dateString = `${dobYear}-${dobMonth}-${dobDay}`;
      form.setValue("dob", dateString);
      form.trigger("dob");
    } else {
      form.setValue("dob", "");
    }
  }, [dobDay, dobMonth, dobYear, form]);

  useEffect(() => {
    if (treatmentDay && treatmentMonth && treatmentYear) {
      const dateString = `${treatmentYear}-${treatmentMonth}-${treatmentDay}`;
      form.setValue("treatment_initiation_date", dateString);
      form.trigger("treatment_initiation_date");
    } else {
      form.setValue("treatment_initiation_date", "");
    }
  }, [treatmentDay, treatmentMonth, treatmentYear, form]);

  useEffect(() => {
    if (regimenDay && regimenMonth && regimenYear) {
      const dateString = `${regimenYear}-${regimenMonth}-${regimenDay}`;
      form.setValue("current_regimen_initiation_date", dateString);
      form.trigger("current_regimen_initiation_date");
    } else {
      form.setValue("current_regimen_initiation_date", "");
    }
  }, [regimenDay, regimenMonth, regimenYear, form]);

  const onSubmit = async (data: FormData): Promise<void> => {
    console.log("Form submission started", data);
    setIsSubmitting(true);
    
    try {
      if (typeof id !== 'string') {
        throw new Error('Invalid sample ID');
      }
      
      // Ensure gender is provided
      if (!data.gender) {
        toast.error("Please select a gender");
        setIsSubmitting(false);
        return;
      }
      
      await updateSampleMutation.mutateAsync({
        sampleId: id,
        ...data,
        gender: data.gender as "M" | "F" // Type assertion since we checked above
      });
    } catch (error) {
      console.error("Failed to update sample:", error);
      setIsSubmitting(false);
    }
  };

  if (sampleLoading) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading sample details...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Sample</h1>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </main>
    );
  }

  if (!sample) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sample Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested sample could not be found.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </main>
    );
  }

  return (
    <div className="md:container md:px-0 px-4 pt-4 md:mx-auto">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Edit className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Edit Viral Load Request
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Modify viral load request information
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-sm">
            ID: {sample.vl_sample_id}
          </Badge>
        </div>
      </div>

      <div className="">
        <form id="viral-load-edit-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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
                    value={form.watch("current_regimen_id")} 
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
                    value={form.watch("pregnant")}
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
                    value={form.watch("breast_feeding")}
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
                    value={form.watch("active_tb_status")}
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
                  <Label htmlFor="tb_treatment_phase_id" className="text-sm font-medium text-gray-700">
                    TB Treatment Phase:
                  </Label>
                  <Select 
                    value={form.watch("tb_treatment_phase_id")}
                    onValueChange={(value) => form.setValue("tb_treatment_phase_id", value)}
                  >
                    <SelectTrigger className="mt-2 h-10 w-full">
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
                    value={form.watch("arv_adherence_id")}
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
                    value={form.watch("treatment_care_approach")}
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
                    value={form.watch("current_who_stage")}
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
                    value={form.watch("treatment_indication_id")}
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Link href={`/viral-load/${id}`}>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 