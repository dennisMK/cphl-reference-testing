"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { IconBabyCarriage, IconArrowLeft, IconLoader2, IconUser, IconTestPipe } from "@tabler/icons-react";
import { api } from "@/trpc/react";

// Form validation schema matching the HTML form
const eidRequestSchema = z.object({
  // Requesting clinician
  infant_entryPoint: z.string().optional(),
  senders_name: z.string().min(1, "Requested by is required"),
  senders_telephone: z.string().min(1, "Telephone number is required"),
  
  // Patient information
  infant_name: z.string().min(1, "Infant name is required"),
  infant_exp_id: z.string().min(1, "EXP No is required"),
  infant_gender: z.enum(["MALE", "FEMALE", "NOT_RECORDED"]),
  infant_age: z.string().min(1, "Age is required"),
  infant_age_units: z.enum(["months", "days", "weeks", "years"]),
  infant_contact_phone: z.string().optional(),
  given_contri: z.enum(["BLANK", "Y", "N"]),
  delivered_at_hc: z.enum(["BLANK", "Y", "N"]),
  infant_arvs: z.string().optional(),
  env_num1: z.string().optional(),
  
  // Other section
  infant_feeding: z.string().min(1, "Infant feeding is required"),
  test_type: z.enum(["P", "S", "B"]).optional(),
  pcr: z.enum(["UNKNOWN", "FIRST", "SECOND", "THIRD"]),
  non_routine: z.enum(["NONE", "R1", "R2", "R3"]).optional(),
  mother_htsnr: z.string().optional(),
  mother_artnr: z.string().optional(),
  mother_nin: z.string().optional(),
  mother_antenatal_prophylaxis: z.string().optional(),
  mother_delivery_prophylaxis: z.string().optional(),
  mother_postnatal_prophylaxis: z.string().optional(),
  
  // Hidden SCD fields
  sample_type: z.enum(["DBS", "Whole blood"]).optional(),
  first_symptom_age: z.enum(["BLANK", "1", "2"]).optional(),
  diagnosis_age: z.enum(["BLANK", "1", "2"]).optional(),
  test_reason: z.string().optional(),
  fam_history: z.string().optional(),
  screening_program: z.string().optional(),
});

type EIDRequestForm = z.infer<typeof eidRequestSchema>;

export default function NewEIDRequest(): React.JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EIDRequestForm>({
    resolver: zodResolver(eidRequestSchema),
    defaultValues: {
      infant_gender: "NOT_RECORDED",
      infant_age_units: "months",
      given_contri: "BLANK",
      delivered_at_hc: "BLANK",
      pcr: "UNKNOWN",
      non_routine: "NONE",
    },
  });

  const createRequestMutation = api.eid.createRequest.useMutation({
    onSuccess: (data) => {
      toast.success("EID request created successfully!");
      router.push(`/eid`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create EID request");
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: EIDRequestForm) => {
    setIsSubmitting(true);
    
    try {
      await createRequestMutation.mutateAsync(data);
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  return (
    <main className="md:container md:px-0 px-4 pt-4 pb-20 md:mx-auto">
      <div>
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <IconBabyCarriage className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">New EID Request</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">Create a new Early Infant Diagnosis request</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Badge variant="secondary" className="border-0 bg-blue-50 text-blue-700 font-medium px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
              Step 1 of 3
            </Badge>
            <span className="text-gray-500 font-medium text-sm sm:text-base">Request Creation</span>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()}
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* EID Request Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Requesting Clinician */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <IconUser className="h-5 w-5 text-blue-600" />
                  <span>Requesting Clinician</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="infant_entryPoint"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Entry Point:</FormLabel>
                        <Select  onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue  placeholder="Select entry point" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent >
                            <SelectItem value="53">ART Clinic</SelectItem>
                            <SelectItem value="54">EID/MBCP</SelectItem>
                            <SelectItem value="55">Lab</SelectItem>
                            <SelectItem value="56">Left Blank</SelectItem>
                            <SelectItem value="57">Maternity</SelectItem>
                            <SelectItem value="58">MCH/PMTCT/ANC</SelectItem>
                            <SelectItem value="59">OPD</SelectItem>
                            <SelectItem value="60">Other</SelectItem>
                            <SelectItem value="61">Outreach</SelectItem>
                            <SelectItem value="62">Peadiatric Ward</SelectItem>
                            <SelectItem value="63">PNC</SelectItem>
                            <SelectItem value="64">Unknown</SelectItem>
                            <SelectItem value="65">YCC/Immunisation</SelectItem>
                            <SelectItem value="83">EPI</SelectItem>
                            <SelectItem value="84">Nutrition</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="senders_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested by: *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter requester name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="senders_telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tel No: *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter telephone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <IconBabyCarriage className="h-5 w-5 text-blue-600" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                      <FormItem>
                        <FormLabel>Sex: *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                          <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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

                  <FormField
                    control={form.control}
                    name="infant_arvs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Infant PMTCT ARVS:</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select ARV regimen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1-Received NVP syrup at birth for 6 weeks</SelectItem>
                            <SelectItem value="2">2-Received NVP syrup at birth for 12 weeks</SelectItem>
                            <SelectItem value="3">3-AZT/3TC/NVP</SelectItem>
                            <SelectItem value="4">4-No ARVs taken</SelectItem>
                            <SelectItem value="5">5-Unkown-Infant EMTCT regimen not known</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="env_num1"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormLabel>Envelope Number:</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Other Section */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <IconTestPipe className="h-5 w-5 text-blue-600" />
                  <span>Other</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="infant_feeding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Infant Feeding: *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select feeding type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EBF">Exclusive Breast Feeding</SelectItem>
                            <SelectItem value="MF">Mixed Feeding (below 6 months)</SelectItem>
                            <SelectItem value="W">Wean from breastfeeding</SelectItem>
                            <SelectItem value="RF">Replacement Feeding (never breastfed)</SelectItem>
                            <SelectItem value="CF">Complimentary Feeding (above 6 months)</SelectItem>
                            <SelectItem value="NLB">No longer Breastfeeding</SelectItem>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                      name="sample_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of sample collected:</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DBS">DBS</SelectItem>
                              <SelectItem value="Whole blood">Whole blood</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="first_symptom_age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age of first symptom:</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BLANK">Blank</SelectItem>
                              <SelectItem value="1">Below 36 months</SelectItem>
                              <SelectItem value="2">3 years or above</SelectItem>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BLANK">Blank</SelectItem>
                              <SelectItem value="1">Below 36 months</SelectItem>
                              <SelectItem value="2">3 years or above</SelectItem>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Known positive family history">Known positive family history</SelectItem>
                              <SelectItem value="Screening program">Screening program</SelectItem>
                              <SelectItem value="Illness">Illness</SelectItem>
                              <SelectItem value="Pregnancy">Pregnancy</SelectItem>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select family history" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="One parent with AS">One parent with AS</SelectItem>
                              <SelectItem value="Both parents with AS">Both parents with AS</SelectItem>
                              <SelectItem value="Sibling with SCD">Sibling with SCD</SelectItem>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select screening program" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Birth">Birth</SelectItem>
                              <SelectItem value="First immunization">First immunization</SelectItem>
                              <SelectItem value="subsequent immunization">subsequent immunization</SelectItem>
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button 
                type="button"
                onClick={() => router.back()}
                variant="outline" 
                className="flex items-center space-x-2"
                disabled={isSubmitting}
              >
                <IconArrowLeft className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconBabyCarriage className="h-4 w-4" />
                )}
                <span>{isSubmitting ? "Creating..." : "Save"}</span>
              </Button>
            </div>
          </form>
        </Form>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">What is EID?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Early Infant Diagnosis (EID) is the process of HIV testing in infants and children younger than 18 months born to HIV-positive mothers. It's crucial for early detection and treatment.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Testing Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Standard EID testing occurs at 6 weeks, 14 weeks, 6 months, 12 months, and 18 months of age, with additional testing as clinically indicated.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 