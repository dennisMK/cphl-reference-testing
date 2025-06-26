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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, TestTube, AlertTriangle, Settings } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { useAuth } from "@/lib/auth-context";
import { api } from "@/trpc/react";

const formSchema = z.object({
  // Patient Information
  patient_unique_id: z.string().min(1, "Patient ID is required"),
  art_number: z.string().min(1, "ART number is required"),
  other_id: z.string().optional(),
  gender: z.enum(["M", "F"], { required_error: "Gender is required" }),
  dob: z.date({ required_error: "Date of birth is required" }),
  treatment_initiation_date: z.date({ required_error: "Treatment initiation date is required" }),
  current_regimen_initiation_date: z.date({ required_error: "Current regimen initiation date is required" }),
  
  // Sample Information
  pregnant: z.enum(["Y", "N", "U"]).optional(),
  anc_number: z.string().optional(),
  breast_feeding: z.enum(["Y", "N", "U"]).optional(),
  active_tb_status: z.enum(["Y", "N", "U"]).optional(),
  sample_type: z.enum(["P", "D", "W"], { required_error: "Sample type is required" }), // Plasma, DBS, Whole blood
  indication: z.string().min(1, "Indication is required"),
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user, isLoading } = useAuth();

  const createRequest = api.viralLoad.createRequest.useMutation({
    onSuccess: (data) => {
      console.log("Request created successfully:", data);
      router.push("/viral-load/pending-collection");
    },
    onError: (error) => {
      console.error("Error creating request:", error);
      setSubmitError(error.message);
      setIsSubmitting(false);
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      other_id: "",
      anc_number: "",
    },
  });

  // Handle conditional logic for pregnancy field
  const watchedGender = form.watch("gender");
  useEffect(() => {
    if (watchedGender === "M") {
      form.setValue("pregnant", undefined);
    }
  }, [watchedGender, form]);

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true);
    setSubmitError(null); // Clear previous errors
    
    try {
      await createRequest.mutateAsync({
        patient_unique_id: data.patient_unique_id,
        art_number: data.art_number,
        other_id: data.other_id || undefined,
        gender: data.gender,
        dob: data.dob.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        treatment_initiation_date: data.treatment_initiation_date.toISOString().split('T')[0],
        current_regimen_initiation_date: data.current_regimen_initiation_date.toISOString().split('T')[0],
        pregnant: data.pregnant,
        anc_number: data.anc_number || undefined,
        breast_feeding: data.breast_feeding,
        active_tb_status: data.active_tb_status,
        sample_type: data.sample_type,
        indication: data.indication,
      });
    } catch (error) {
      console.error("Failed to create request:", error);
      setIsSubmitting(false);
    }
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

      {/* Error Alert */}
      {submitError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex flex-col gap-2">
              <span>{submitError}</span>
              {submitError.includes("facility information") && (
                <Link href="/settings/edit-facility" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline">
                  <Settings className="h-4 w-4" />
                  Go to Settings → Edit Facility
                </Link>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

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

          {/* Patient Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Patient Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient_unique_id" className="text-sm font-medium text-gray-700">
                  Patient Unique ID *
                </Label>
                <Input
                  id="patient_unique_id"
                  {...form.register("patient_unique_id")}
                  placeholder="PAT-001-2024"
                  className="mt-2 h-10"
                />
                {form.formState.errors.patient_unique_id && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.patient_unique_id.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="art_number" className="text-sm font-medium text-gray-700">
                  ART Number *
                </Label>
                <Input
                  id="art_number"
                  {...form.register("art_number")}
                  placeholder="ART-2024-001"
                  className="mt-2 h-10"
                />
                {form.formState.errors.art_number && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.art_number.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="other_id" className="text-sm font-medium text-gray-700">
                  Other ID (Optional)
                </Label>
                <Input
                  id="other_id"
                  {...form.register("other_id")}
                  placeholder="Alternative patient ID"
                  className="mt-2 h-10"
                />
              </div>

              <div>
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gender *
                </Label>
                <Select onValueChange={(value) => form.setValue("gender", value as "M" | "F")}>
                  <SelectTrigger className="mt-2 h-10">
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

              <div>
                <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                  Date of Birth *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "mt-2 w-full h-10 justify-start text-left font-normal",
                        !form.watch("dob") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("dob") ? format(form.watch("dob"), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch("dob")}
                      onSelect={(date) => form.setValue("dob", date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.dob && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.dob.message}</p>
                )}
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
                <Label htmlFor="treatment_initiation_date" className="text-sm font-medium text-gray-700">
                  Treatment Initiation Date *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "mt-2 w-full h-10 justify-start text-left font-normal",
                        !form.watch("treatment_initiation_date") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("treatment_initiation_date") ? format(form.watch("treatment_initiation_date"), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch("treatment_initiation_date")}
                      onSelect={(date) => form.setValue("treatment_initiation_date", date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.treatment_initiation_date && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.treatment_initiation_date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="current_regimen_initiation_date" className="text-sm font-medium text-gray-700">
                  Current Regimen Initiation Date *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "mt-2 w-full h-10 justify-start text-left font-normal",
                        !form.watch("current_regimen_initiation_date") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("current_regimen_initiation_date") ? format(form.watch("current_regimen_initiation_date"), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch("current_regimen_initiation_date")}
                      onSelect={(date) => form.setValue("current_regimen_initiation_date", date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.current_regimen_initiation_date && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.current_regimen_initiation_date.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sample Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Sample Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sample_type" className="text-sm font-medium text-gray-700">
                  Sample Type *
                </Label>
                <Select onValueChange={(value) => form.setValue("sample_type", value as "P" | "D" | "W")}>
                  <SelectTrigger className="mt-2 h-10">
                    <SelectValue placeholder="Select sample type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P">Plasma</SelectItem>
                    <SelectItem value="D">Dried Blood Spot (DBS)</SelectItem>
                    <SelectItem value="W">Whole Blood</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.sample_type && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.sample_type.message}</p>
                )}
              </div>

              {watchedGender === "F" && (
                <>
                  <div>
                    <Label htmlFor="pregnant" className="text-sm font-medium text-gray-700">
                      Pregnant *
                    </Label>
                    <Select onValueChange={(value) => form.setValue("pregnant", value as "Y" | "N" | "U")}>
                      <SelectTrigger className="mt-2 h-10">
                        <SelectValue placeholder="Select pregnancy status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Yes</SelectItem>
                        <SelectItem value="N">No</SelectItem>
                        <SelectItem value="U">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.pregnant && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.pregnant.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="anc_number" className="text-sm font-medium text-gray-700">
                      ANC Number (Optional)
                    </Label>
                    <Input
                      id="anc_number"
                      {...form.register("anc_number")}
                      placeholder="ANC-2024-001"
                      className="mt-2 h-10"
                    />
                  </div>

                  <div>
                    <Label htmlFor="breast_feeding" className="text-sm font-medium text-gray-700">
                      Breast Feeding
                    </Label>
                    <Select onValueChange={(value) => form.setValue("breast_feeding", value as "Y" | "N" | "U")}>
                      <SelectTrigger className="mt-2 h-10">
                        <SelectValue placeholder="Select breast feeding status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Yes</SelectItem>
                        <SelectItem value="N">No</SelectItem>
                        <SelectItem value="U">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="active_tb_status" className="text-sm font-medium text-gray-700">
                  Active TB Status
                </Label>
                <Select onValueChange={(value) => form.setValue("active_tb_status", value as "Y" | "N" | "U")}>
                  <SelectTrigger className="mt-2 h-10">
                    <SelectValue placeholder="Select TB status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                    <SelectItem value="U">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="indication" className="text-sm font-medium text-gray-700">
                  Indication *
                </Label>
                <Textarea
                  id="indication"
                  {...form.register("indication")}
                  placeholder="Reason for viral load testing..."
                  className="mt-2 min-h-[100px]"
                />
                {form.formState.errors.indication && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.indication.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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