"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Baby, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { api } from "@/trpc/react";

const updateEIDRequestSchema = z.object({
  infant_name: z.string().min(1, "Infant name is required"),
  infant_gender: z.enum(["MALE", "FEMALE", "NOT_RECORDED"]).optional(),
  infant_age: z.string().optional(),
  infant_age_units: z.enum(["DAYS", "WEEKS", "MONTHS", "YEARS"]).optional(),
  infant_dob: z.string().optional(),
  infant_is_breast_feeding: z.enum(["YES", "NO", "UNKNOWN"]).optional(),
  infant_contact_phone: z.string().optional(),
  mother_htsnr: z.string().optional(),
  mother_artnr: z.string().optional(),
  mother_nin: z.string().optional(),
  test_type: z.string().optional(),
  pcr: z.enum(["FIRST", "SECOND", "THIRD", "NON_ROUTINE", "UNKNOWN"]).optional(),
  PCR_test_requested: z.enum(["YES", "NO"]).optional(),
  SCD_test_requested: z.enum(["YES", "NO"]).optional(),
});

type UpdateEIDRequestData = z.infer<typeof updateEIDRequestSchema>;

interface EditEIDRequestPageProps {
  params: {
    id: string;
  };
}

export default function EditEIDRequestPage({ params }: EditEIDRequestPageProps) {
  const router = useRouter();
  const requestId = parseInt(params.id);

  // Fetch EID request data
  const { data: request, isLoading: requestLoading, error: requestError } = api.eid.getRequest.useQuery(
    { id: requestId },
    { enabled: !isNaN(requestId) }
  );

  // Update mutation
  const updateMutation = api.eid.updateRequest.useMutation({
    onSuccess: () => {
      toast.success("EID request updated successfully!");
      router.push(`/eid/${requestId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update EID request");
    },
  });

  const form = useForm<UpdateEIDRequestData>({
    resolver: zodResolver(updateEIDRequestSchema),
    defaultValues: {
      infant_name: "",
      infant_gender: "NOT_RECORDED",
      infant_age: "",
      infant_age_units: "WEEKS",
      infant_dob: "",
      infant_is_breast_feeding: "UNKNOWN",
      infant_contact_phone: "",
      mother_htsnr: "",
      mother_artnr: "",
      mother_nin: "",
      test_type: "",
      pcr: "FIRST",
      PCR_test_requested: "YES",
      SCD_test_requested: "NO",
    },
  });

  // Update form when data is loaded
  React.useEffect(() => {
    if (request) {
      form.reset({
        infant_name: request.infant_name || "",
        infant_gender: request.infant_gender || "NOT_RECORDED",
        infant_age: request.infant_age || "",
        infant_age_units: (request.infant_age_units as any) || "WEEKS",
        infant_dob: request.infant_dob ? new Date(request.infant_dob).toISOString().split('T')[0] : "",
        infant_is_breast_feeding: (request.infant_is_breast_feeding as any) || "UNKNOWN",
        infant_contact_phone: request.infant_contact_phone || "",
        mother_htsnr: request.mother_htsnr || "",
        mother_artnr: request.mother_artnr || "",
        mother_nin: request.mother_nin || "",
        test_type: request.test_type || "",
        pcr: request.pcr || "FIRST",
        PCR_test_requested: (request.PCR_test_requested as any) || "YES",
        SCD_test_requested: (request.SCD_test_requested as any) || "NO",
      });
    }
  }, [request, form]);

  const onSubmit = (data: UpdateEIDRequestData) => {
    updateMutation.mutate({
      id: requestId,
      ...data,
      infant_dob: data.infant_dob ? data.infant_dob : undefined,
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

  if (requestLoading) {
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
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link href={`/eid/${requestId}`}>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Request</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Baby className="h-8 w-8 text-blue-600" />
                <span>Edit EID Request</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Update details for EID-{String(requestId).padStart(6, "0")}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Infant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Baby className="h-5 w-5 text-blue-600" />
              <span>Infant Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="infant_name">Infant Name *</Label>
                <Input 
                  id="infant_name" 
                  {...form.register("infant_name")}
                  className="mt-2"
                />
                {form.formState.errors.infant_name && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.infant_name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="infant_gender">Gender</Label>
                <Select 
                  value={form.watch("infant_gender")} 
                  onValueChange={(value) => form.setValue("infant_gender", value as any)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="NOT_RECORDED">Not Recorded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="infant_dob">Date of Birth</Label>
                <Input 
                  id="infant_dob" 
                  type="date"
                  {...form.register("infant_dob")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="infant_contact_phone">Contact Phone</Label>
                <Input 
                  id="infant_contact_phone" 
                  {...form.register("infant_contact_phone")}
                  className="mt-2"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <Label htmlFor="infant_age">Age</Label>
                <Input 
                  id="infant_age" 
                  {...form.register("infant_age")}
                  className="mt-2"
                  placeholder="e.g., 6"
                />
              </div>

              <div>
                <Label htmlFor="infant_age_units">Age Units</Label>
                <Select 
                  value={form.watch("infant_age_units")} 
                  onValueChange={(value) => form.setValue("infant_age_units", value as any)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAYS">Days</SelectItem>
                    <SelectItem value="WEEKS">Weeks</SelectItem>
                    <SelectItem value="MONTHS">Months</SelectItem>
                    <SelectItem value="YEARS">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="infant_is_breast_feeding">Breastfeeding Status</Label>
                <Select 
                  value={form.watch("infant_is_breast_feeding")} 
                  onValueChange={(value) => form.setValue("infant_is_breast_feeding", value as any)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mother Information */}
        <Card>
          <CardHeader>
            <CardTitle>Mother Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="mother_htsnr">Mother's HTS Number</Label>
                <Input 
                  id="mother_htsnr" 
                  {...form.register("mother_htsnr")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="mother_artnr">Mother's ART Number</Label>
                <Input 
                  id="mother_artnr" 
                  {...form.register("mother_artnr")}
                  className="mt-2"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="mother_nin">Mother's NIN</Label>
                <Input 
                  id="mother_nin" 
                  {...form.register("mother_nin")}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Information */}
        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pcr">PCR Type</Label>
                <Select 
                  value={form.watch("pcr")} 
                  onValueChange={(value) => form.setValue("pcr", value as any)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST">First PCR</SelectItem>
                    <SelectItem value="SECOND">Second PCR</SelectItem>
                    <SelectItem value="THIRD">Third PCR</SelectItem>
                    <SelectItem value="NON_ROUTINE">Non-Routine</SelectItem>
                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="test_type">Test Type</Label>
                <Input 
                  id="test_type" 
                  {...form.register("test_type")}
                  className="mt-2"
                  placeholder="e.g., Standard EID"
                />
              </div>

              <div>
                <Label htmlFor="PCR_test_requested">PCR Test Requested</Label>
                <Select 
                  value={form.watch("PCR_test_requested")} 
                  onValueChange={(value) => form.setValue("PCR_test_requested", value as any)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="SCD_test_requested">SCD Test Requested</Label>
                <Select 
                  value={form.watch("SCD_test_requested")} 
                  onValueChange={(value) => form.setValue("SCD_test_requested", value as any)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facility Information (Display Only) */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-700">Facility Name</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {request?.facility_name || "Not specified"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">District</Label>
                <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                  {request?.facility_district || "Not specified"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.push(`/eid/${requestId}`)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 