"use client"

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Baby, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { api } from "@/trpc/react";

// Form validation schema for editing (more lenient than create form)
const updateEIDRequestSchema = z.object({
  // Patient information - optional for edit form
  infant_name: z.string().optional(),
  infant_exp_id: z.string().optional(),
  infant_gender: z.enum(["MALE", "FEMALE", "NOT_RECORDED"]).optional(),
  infant_age: z.string().optional(),
  infant_age_units: z.enum(["months", "days", "weeks", "years"]).optional(),
  infant_contact_phone: z.string().optional(),
  given_contri: z.enum(["BLANK", "Y", "N"]).optional(),
  delivered_at_hc: z.enum(["BLANK", "Y", "N"]).optional(),

  // Other section - optional for edit form
  infant_feeding: z.string().optional(),
  test_type: z.enum(["P", "S", "B"]).optional(),
  pcr: z.enum(["UNKNOWN", "FIRST", "SECOND", "THIRD"]).optional(),
  non_routine: z.enum(["NONE", "R1", "R2", "R3"]).optional(),
  mother_htsnr: z.string().optional(),
  mother_artnr: z.string().optional(),
  mother_nin: z.string().optional(),
  mother_antenatal_prophylaxis: z.string().optional(),
  mother_delivery_prophylaxis: z.string().optional(),
  mother_postnatal_prophylaxis: z.string().optional(),

  // Hidden SCD fields that exist in database
  first_symptom_age: z.enum(["BLANK", "1", "2"]).optional(),
  diagnosis_age: z.enum(["BLANK", "1", "2"]).optional(),
  test_reason: z.string().optional(),
  fam_history: z.string().optional(),
  screening_program: z.string().optional(),
});

type UpdateEIDRequestData = z.infer<typeof updateEIDRequestSchema>;

export default function EditEIDRequestPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = parseInt(params.id as string);
  const utils = api.useUtils();
  const [isFormInitialized, setIsFormInitialized] = React.useState(false);

  // Fetch EID request data
  const { data: request, isLoading: requestLoading, error: requestError } = api.eid.getRequest.useQuery(
    { id: requestId },
    { enabled: !isNaN(requestId) }
  );

  // Update mutation
  const updateMutation = api.eid.updateRequest.useMutation({
    onSuccess: (result) => {
      console.log("Update success:", result);
      toast.dismiss(); // Dismiss loading toast
      toast.success("EID request updated successfully!");
      // Invalidate queries to refresh data
      utils.eid.getRequest.invalidate({ id: requestId });
      utils.eid.getRequests.invalidate();
      // router.push(`/eid/${requestId}`);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.dismiss(); // Dismiss loading toast
      toast.error(error.message || "Failed to update EID request");
    },
    onMutate: () => {
      console.log("Update mutation started");
      toast.loading("Updating EID request...");
    },
  });

  const form = useForm<UpdateEIDRequestData>({
    resolver: zodResolver(updateEIDRequestSchema),
    mode: "onSubmit", // Only validate on submit, not on change
    defaultValues: {
      infant_name: "",
      infant_exp_id: "",
      infant_gender: "NOT_RECORDED",
      infant_age: "",
      infant_age_units: "months",
      infant_contact_phone: "",
      given_contri: "BLANK",
      delivered_at_hc: "BLANK",
      infant_feeding: "",
      test_type: "P",
      pcr: "UNKNOWN",
      non_routine: "NONE",
      mother_htsnr: "",
      mother_artnr: "",
      mother_nin: "",
      mother_antenatal_prophylaxis: "",
      mother_delivery_prophylaxis: "",
      mother_postnatal_prophylaxis: "",
      first_symptom_age: "BLANK",
      diagnosis_age: "BLANK",
      test_reason: "",
      fam_history: "",
      screening_program: "",
    },
  });

  // Update form when data is loaded
  React.useEffect(() => {
    if (request && !isFormInitialized) {
      console.log("Loading request data:", request);
      const formData = {
        infant_name: request.infant_name || "",
        infant_exp_id: request.infant_exp_id || "",
        infant_gender: (request.infant_gender as "MALE" | "FEMALE" | "NOT_RECORDED") || "NOT_RECORDED",
        infant_age: request.infant_age || "",
        infant_age_units: (request.infant_age_units as "months" | "days" | "weeks" | "years") || "months",
        infant_contact_phone: request.infant_contact_phone || "",
        given_contri: (request.given_contri as "BLANK" | "Y" | "N") || "BLANK",
        delivered_at_hc: (request.delivered_at_hc as "BLANK" | "Y" | "N") || "BLANK",
        infant_feeding: request.infant_feeding || "",
        test_type: (request.test_type as "P" | "S" | "B") || "P",
        pcr: (request.pcr === "NON_ROUTINE" ? "UNKNOWN" : (request.pcr as "UNKNOWN" | "FIRST" | "SECOND" | "THIRD")) || "UNKNOWN",
        non_routine: (request.non_routine as "NONE" | "R1" | "R2" | "R3") || "NONE",
        mother_htsnr: request.mother_htsnr || "",
        mother_artnr: request.mother_artnr || "",
        mother_nin: request.mother_nin || "",
        mother_antenatal_prophylaxis: request.mother_antenatal_prophylaxis ? String(request.mother_antenatal_prophylaxis) : "",
        mother_delivery_prophylaxis: request.mother_delivery_prophylaxis ? String(request.mother_delivery_prophylaxis) : "",
        mother_postnatal_prophylaxis: request.mother_postnatal_prophylaxis ? String(request.mother_postnatal_prophylaxis) : "",
        first_symptom_age: (request.first_symptom_age as "BLANK" | "1" | "2") || "BLANK",
        diagnosis_age: (request.diagnosis_age as "BLANK" | "1" | "2") || "BLANK",
        test_reason: request.test_reason || "",
        fam_history: request.fam_history || "",
        screening_program: request.screening_program || "",
      };
      console.log("Setting form data:", formData);
      console.log("Select field values:", {
        infant_feeding: formData.infant_feeding,
        test_type: formData.test_type,
        pcr: formData.pcr,
        non_routine: formData.non_routine,
        infant_gender: formData.infant_gender,
        given_contri: formData.given_contri,
        delivered_at_hc: formData.delivered_at_hc,
      });
      form.reset(formData);
      setIsFormInitialized(true);
    }
  }, [request, form, isFormInitialized]);

  const onSubmit = (data: UpdateEIDRequestData) => {
    console.log("Form submitted with data:", data);
    console.log("Request ID:", requestId);
    
    // Validate required fields on submit since schema is more lenient
    const errors: Record<string, string> = {};
    
    if (!data.infant_name || data.infant_name.trim() === "") {
      errors.infant_name = "Infant name is required";
    }
    
    if (!data.infant_exp_id || data.infant_exp_id.trim() === "") {
      errors.infant_exp_id = "EXP No is required";
    }
    
    if (!data.infant_age || data.infant_age.trim() === "") {
      errors.infant_age = "Age is required";
    }
    
    if (!data.infant_feeding || data.infant_feeding.trim() === "") {
      errors.infant_feeding = "Infant feeding is required";
    }
    
    // If there are validation errors, set them and return
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach(field => {
        form.setError(field as any, { message: errors[field] });
      });
    toast.error("Please fix the form errors before submitting");
    
    // Focus on first error field
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
      }
    }
      return;
    }
    
    console.log("Starting mutation with data:", data);
    
    updateMutation.mutate({
      id: requestId,
      ...data,
    });
  };

  const getStatusBadge = () => {
    if (!request) return null;
    
    if (request.date_dbs_taken) {
      return <Badge className="bg-blue-100 text-blue-800">Collected</Badge>;
    } else {
      return <Badge className="bg-orange-100 text-orange-800">Pending Collection</Badge>;
    }
  };

  if (requestError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading EID request</p>
            <Button onClick={() => router.push("/eid")} variant="outline">
              Back to EID
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (requestLoading || !request || !isFormInitialized) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading EID request...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="md:container md:px-0 px-4 pt-4 pb-20 md:mx-auto">
      <div>
      {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link href={`/eid/${requestId}`}>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Request</span>
              </Button>
            </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <Baby className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <span>Edit EID Request</span>
              </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                Update details for EID-{String(requestId).padStart(6, "0")}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </div>

        {/* EID Request Form */}
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Patient Information */}
            <Card className="border-0 shadow-sm bg-white rounded-xl p-0">
            <CardHeader className="bg-blue-600 text-white rounded-t-xl p-4 mb-0">
              <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                  <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="infant_name"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Infant Name: *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter infant name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="infant_exp_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EXP No: *</FormLabel>
                      <FormControl>
                          <Input placeholder="Enter EXP number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="infant_gender"
                  render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Sex: *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                        <FormControl>
                            <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="MALE">M</SelectItem>
                            <SelectItem value="FEMALE">F</SelectItem>
                            <SelectItem value="NOT_RECORDED">Blank</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                      name="infant_age"
                  render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Age: *</FormLabel>
                      <FormControl>
                            <Input placeholder="Age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                      name="infant_age_units"
                  render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Units: *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                      <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                      </FormControl>
                            <SelectContent>
                              <SelectItem value="months">Months</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="weeks">Weeks</SelectItem>
                              <SelectItem value="years">Years</SelectItem>
                            </SelectContent>
                          </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                <FormField
                  control={form.control}
                    name="infant_contact_phone"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Care Giver Phone Number:</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="given_contri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Given Contrimoxazole: *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="BLANK">Blank</SelectItem>
                            <SelectItem value="Y">Y</SelectItem>
                            <SelectItem value="N">N</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                    name="delivered_at_hc"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Delivered at H/C: *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                        <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="BLANK">UNKNOWN</SelectItem>
                            <SelectItem value="Y">Y</SelectItem>
                            <SelectItem value="N">N</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  <div className="col-span-2">
                    {/* Placeholder for additional fields if needed */}
                  </div>
              </div>
              </CardContent>
            </Card>

            {/* Other Section */}
            <Card className="border-0 shadow-sm bg-white rounded-xl p-0">
              <CardHeader className="bg-blue-600 text-white rounded-t-xl p-4 mb-0">
                <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                  <span>Other</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                    name="infant_feeding"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>Infant Feeding: *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                    <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select feeding type" />
                            </SelectTrigger>
                    </FormControl>
                          <SelectContent>
                            <SelectItem value="EBF">
                              Exclusive Breast Feeding
                            </SelectItem>
                            <SelectItem value="MF">
                              Mixed Feeding (below 6 months)
                            </SelectItem>
                            <SelectItem value="W">
                              Wean from breastfeeding
                            </SelectItem>
                            <SelectItem value="RF">
                              Replacement Feeding (never breastfed)
                            </SelectItem>
                            <SelectItem value="CF">
                              Complimentary Feeding (above 6 months)
                            </SelectItem>
                            <SelectItem value="NLB">
                              No longer Breastfeeding
                            </SelectItem>
                          </SelectContent>
                        </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

                  <FormField
                    control={form.control}
                    name="test_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Test:</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select test type" />
                            </SelectTrigger>
                          </FormControl>
                      <SelectContent>
                            <SelectItem value="P">PCR</SelectItem>
                            <SelectItem value="S">SCD</SelectItem>
                            <SelectItem value="B">Both</SelectItem>
                      </SelectContent>
                    </Select>
                        <FormMessage />
                      </FormItem>
                  )}
                />

                  <FormField
                    control={form.control}
                    name="pcr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PCR:</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UNKNOWN">Blank</SelectItem>
                            <SelectItem value="FIRST">1st</SelectItem>
                            <SelectItem value="SECOND">2nd</SelectItem>
                            <SelectItem value="THIRD">3rd</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                )}
                  />

                  <FormField
                    control={form.control}
                    name="non_routine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Non Routine PCR:</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select non-routine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NONE">None</SelectItem>
                            <SelectItem value="R1">R1</SelectItem>
                            <SelectItem value="R2">R2</SelectItem>
                            <SelectItem value="R3">R3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                )}
                  />
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="mother_htsnr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mothers HTS No:</FormLabel>
                        <FormControl>
                          <Input placeholder="HTS number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mother_artnr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ART No:</FormLabel>
                        <FormControl>
                          <Input placeholder="ART number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                )}
                  />

                  <FormField
                    control={form.control}
                    name="mother_nin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIN:</FormLabel>
                        <FormControl>
                          <Input placeholder="National ID number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                )}
                  />
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                  control={form.control}
                    name="mother_antenatal_prophylaxis"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Antenatal:</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select antenatal" />
                      </SelectTrigger>
                          </FormControl>
                      <SelectContent>
                            <SelectItem value="80">1:Lifelong ART</SelectItem>
                            <SelectItem value="81">2:No ART</SelectItem>
                            <SelectItem value="82">3:Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                        <FormMessage />
                      </FormItem>
                  )}
                />

                  <FormField
                  control={form.control}
                    name="mother_delivery_prophylaxis"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery:</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select delivery" />
                      </SelectTrigger>
                          </FormControl>
                      <SelectContent>
                            <SelectItem value="80">1:Lifelong ART</SelectItem>
                            <SelectItem value="81">2:No ART</SelectItem>
                            <SelectItem value="82">3:Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                        <FormMessage />
                      </FormItem>
                )}
                  />

                  <FormField
                    control={form.control}
                    name="mother_postnatal_prophylaxis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postnatal:</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select postnatal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="80">1:Lifelong ART</SelectItem>
                            <SelectItem value="81">2:No ART</SelectItem>
                            <SelectItem value="82">3:Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                )}
                  />
              </div>

                {/* Hidden SCD Testing Fields */}
                <div className="hidden space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                  control={form.control}
                      name="first_symptom_age"
                  render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age of first symptom:</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                            </FormControl>
                      <SelectContent>
                              <SelectItem value="BLANK">Blank</SelectItem>
                              <SelectItem value="1">Below 36 months</SelectItem>
                              <SelectItem value="2">
                                3 years or above
                              </SelectItem>
                      </SelectContent>
                    </Select>
                          <FormMessage />
                        </FormItem>
                  )}
                />

                    <FormField
                      control={form.control}
                      name="diagnosis_age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age at diagnosis:</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BLANK">Blank</SelectItem>
                              <SelectItem value="1">Below 36 months</SelectItem>
                              <SelectItem value="2">
                                3 years or above
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                />
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                  control={form.control}
                      name="test_reason"
                  render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for testing:</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                            </FormControl>
                      <SelectContent>
                              <SelectItem value="Known positive family history">
                                Known positive family history
                              </SelectItem>
                              <SelectItem value="Screening program">
                                Screening program
                              </SelectItem>
                              <SelectItem value="Illness">Illness</SelectItem>
                              <SelectItem value="Pregnancy">
                                Pregnancy
                              </SelectItem>
                              <SelectItem value="Surgery">Surgery</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                          <FormMessage />
                        </FormItem>
                  )}
                />

                    <FormField
                      control={form.control}
                      name="fam_history"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Known positive family history:</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select family history" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="One parent with AS">
                                One parent with AS
                              </SelectItem>
                              <SelectItem value="Both parents with AS">
                                Both parents with AS
                              </SelectItem>
                              <SelectItem value="Sibling with SCD">
                                Sibling with SCD
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                  control={form.control}
                      name="screening_program"
                  render={({ field }) => (
                        <FormItem>
                          <FormLabel>Early screening program:</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select screening program" />
                      </SelectTrigger>
                            </FormControl>
                      <SelectContent>
                              <SelectItem value="Birth">Birth</SelectItem>
                              <SelectItem value="First immunization">
                                First immunization
                              </SelectItem>
                              <SelectItem value="subsequent immunization">
                                subsequent immunization
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                          <FormMessage />
                        </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facility Information (Display Only) */}
            <Card className="border-0 shadow-sm bg-white rounded-xl p-0">
          <CardHeader className="bg-blue-600 text-white rounded-t-xl p-4 mb-0">
            <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>Facility Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
              <div>
                    <div className="text-sm font-medium text-gray-700">Facility Name</div>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {request?.facility_name || "Not specified"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button
                type="button"
                onClick={() => router.push(`/eid/${requestId}`)}
                variant="outline"
                className="flex items-center space-x-2"
                disabled={updateMutation.isPending}
              >
                <span>Cancel</span>
          </Button>
          <Button 
            type="submit" 
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            disabled={updateMutation.isPending}
          >
                {updateMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <Save className="h-4 w-4" />
                <span>{updateMutation.isPending ? "Updating..." : "Update Request"}</span>
          </Button>
            </div>
          </form>
        </Form>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                What is EID?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Early Infant Diagnosis (EID) is the process of HIV testing in
                infants and children younger than 18 months born to HIV-positive
                mothers. It's crucial for early detection and treatment.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Testing Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Standard EID testing occurs at 6 weeks, 14 weeks, 6 months, 12
                months, and 18 months of age, with additional testing as
                clinically indicated.
              </p>
            </CardContent>
          </Card>
        </div>
    </div>
    </main>
  );
} 