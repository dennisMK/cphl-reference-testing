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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { IconBabyCarriage, IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import { api } from "@/trpc/react";

// Form validation schema
const eidRequestSchema = z.object({
  // Infant information
  infant_name: z.string().min(1, "Infant name is required"),
  infant_gender: z.enum(["MALE", "FEMALE", "NOT_RECORDED"]).default("NOT_RECORDED"),
  infant_age: z.string().optional(),
  infant_age_units: z.enum(["weeks", "months", "years"]).optional(),
  infant_dob: z.string().optional(),
  infant_is_breast_feeding: z.enum(["YES", "NO", "UNKNOWN"]).default("UNKNOWN"),
  infant_contact_phone: z.string().optional(),
  infant_feeding: z.string().optional(),
  
  // Mother information
  mother_htsnr: z.string().optional(),
  mother_artnr: z.string().optional(),
  mother_nin: z.string().optional(),
  
  // Test information
  test_type: z.string().optional(),
  pcr: z.enum(["FIRST", "SECOND", "NON_ROUTINE", "UNKNOWN", "THIRD"]).default("FIRST"),
  PCR_test_requested: z.enum(["NO", "YES"]).default("YES"),
  SCD_test_requested: z.enum(["NO", "YES"]).default("NO"),
});

type EIDRequestForm = z.infer<typeof eidRequestSchema>;

export default function NewEIDRequest(): React.JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EIDRequestForm>({
    resolver: zodResolver(eidRequestSchema),
    defaultValues: {
      infant_gender: "NOT_RECORDED",
      infant_is_breast_feeding: "UNKNOWN",
      pcr: "FIRST",
      PCR_test_requested: "YES",
      SCD_test_requested: "NO",
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
      <div >
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
            {/* Infant Information */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <IconBabyCarriage className="h-5 w-5 text-blue-600" />
                  <span>Infant Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="infant_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Infant Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter infant name" {...field} />
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
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="NOT_RECORDED">Not Recorded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="infant_dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="infant_age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
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
                        <FormItem>
                          <FormLabel>Units</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Units" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weeks">Weeks</SelectItem>
                              <SelectItem value="months">Months</SelectItem>
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
                    name="infant_is_breast_feeding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is Breast Feeding?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select feeding status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="YES">Yes</SelectItem>
                            <SelectItem value="NO">No</SelectItem>
                            <SelectItem value="UNKNOWN">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="infant_contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="infant_feeding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeding Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional feeding information"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide any additional information about infant feeding
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Mother Information */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Mother Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="mother_htsnr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HTS Number</FormLabel>
                        <FormControl>
                          <Input placeholder="HTS number" {...field} />
                        </FormControl>
                        <FormDescription>HIV Testing Services number</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mother_artnr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ART Number</FormLabel>
                        <FormControl>
                          <Input placeholder="ART number" {...field} />
                        </FormControl>
                        <FormDescription>Antiretroviral therapy number</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mother_nin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National ID</FormLabel>
                        <FormControl>
                          <Input placeholder="National ID number" {...field} />
                        </FormControl>
                        <FormDescription>National identification number</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Information */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Test Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pcr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PCR Test Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select PCR type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FIRST">First PCR (6 weeks)</SelectItem>
                            <SelectItem value="SECOND">Second PCR (14 weeks)</SelectItem>
                            <SelectItem value="THIRD">Third PCR (6 months)</SelectItem>
                            <SelectItem value="NON_ROUTINE">Non-routine</SelectItem>
                            <SelectItem value="UNKNOWN">Unknown</SelectItem>
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
                        <FormLabel>Test Classification</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Initial, Follow-up, Confirmatory" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FormField
                      control={form.control}
                      name="PCR_test_requested"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "YES"}
                              onCheckedChange={(checked) => 
                                field.onChange(checked ? "YES" : "NO")
                              }
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            PCR Test Requested
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <FormField
                      control={form.control}
                      name="SCD_test_requested"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "YES"}
                              onCheckedChange={(checked) => 
                                field.onChange(checked ? "YES" : "NO")
                              }
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Sickle Cell Disease Test Requested
                          </FormLabel>
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
                <span>{isSubmitting ? "Creating..." : "Create EID Request"}</span>
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