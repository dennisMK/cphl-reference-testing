"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Loader2, Building, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const facilitySchema = z.object({
  facility_name: z.string().min(1, "Facility name is required").min(2, "Facility name must be at least 2 characters"),
  hub_name: z.string().min(1, "Hub name is required"),
  facility_id: z.string().optional(),
  hub_id: z.string().optional(),
});

type FacilityFormData = z.infer<typeof facilitySchema>;

// Sample Uganda districts and their hubs
const ugandaHubs = [
  { district: "Kampala", hubs: ["Kampala Hub", "Mulago Hub", "Kiruddu Hub"] },
  { district: "Wakiso", hubs: ["Wakiso Hub", "Entebbe Hub"] },
  { district: "Mukono", hubs: ["Mukono Hub", "Lugazi Hub"] },
  { district: "Jinja", hubs: ["Jinja Hub", "Iganga Hub"] },
  { district: "Mbale", hubs: ["Mbale Hub", "Tororo Hub"] },
  { district: "Gulu", hubs: ["Gulu Hub", "Lira Hub"] },
  { district: "Mbarara", hubs: ["Mbarara Hub", "Bushenyi Hub"] },
  { district: "Fort Portal", hubs: ["Fort Portal Hub", "Kasese Hub"] },
  { district: "Masaka", hubs: ["Masaka Hub", "Rakai Hub"] },
  { district: "Soroti", hubs: ["Soroti Hub", "Kumi Hub"] },
];

export default function EditFacilityPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      facility_name: user?.facility_name || "",
      hub_name: user?.hub_name || "",
      facility_id: user?.facility_id?.toString() || "",
      hub_id: user?.hub_id?.toString() || "",
    },
  });

  // Update form values when user data loads
  React.useEffect(() => {
    if (user) {
      const currentDistrict = user.hub_name ? user.hub_name.split(' ')[0] : "";
      setSelectedDistrict(currentDistrict);
      
      form.reset({
        facility_name: user.facility_name || "",
        hub_name: user.hub_name || "",
        facility_id: user.facility_id?.toString() || "",
        hub_id: user.hub_id?.toString() || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: FacilityFormData) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/update-facility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facility_name: data.facility_name,
          hub_name: data.hub_name,
          facility_id: data.facility_id ? parseInt(data.facility_id) : null,
          hub_id: data.hub_id ? parseInt(data.hub_id) : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Facility information updated successfully!" });
        await refreshUser(); // Refresh user data in context
        
        // Redirect back to settings after a short delay
        setTimeout(() => {
          router.push('/settings');
        }, 1500);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update facility information" });
      }
    } catch (error: any) {
      console.error("Facility update error:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    form.setValue("hub_name", ""); // Reset hub selection when district changes
  };

  const getAvailableHubs = () => {
    const districtData = ugandaHubs.find(d => d.district === selectedDistrict);
    return districtData ? districtData.hubs : [];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:container mx-auto md:px-0 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/settings" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Facility Information</h1>
        <p className="text-gray-600 mt-2">Update your facility and hub assignment details</p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <Alert className={`mb-6 ${
          message.type === "success" 
            ? "border-green-200 bg-green-50" 
            : "border-red-200 bg-red-50"
        }`}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Facility Information
          </CardTitle>
          <CardDescription>
            Update your facility name and hub assignment. This information will be used in test requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Facility Name */}
            <div>
              <Label htmlFor="facility_name" className="text-sm font-medium text-gray-700">
                Facility Name *
              </Label>
              <Input
                id="facility_name"
                {...form.register("facility_name")}
                placeholder="Enter facility name (e.g., Mulago National Referral Hospital)"
                className="mt-2"
              />
              {form.formState.errors.facility_name && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.facility_name.message}</p>
              )}
            </div>

            {/* District Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                District *
              </Label>
              <Select onValueChange={handleDistrictChange} value={selectedDistrict}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {ugandaHubs.map((district) => (
                    <SelectItem key={district.district} value={district.district}>
                      {district.district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hub Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Testing Hub *
              </Label>
              <Select 
                onValueChange={(value) => form.setValue("hub_name", value)}
                value={form.watch("hub_name")}
                disabled={!selectedDistrict}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={selectedDistrict ? "Select testing hub" : "Select district first"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableHubs().map((hub) => (
                    <SelectItem key={hub} value={hub}>
                      {hub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.hub_name && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.hub_name.message}</p>
              )}
            </div>

            {/* Facility ID (Optional) */}
            <div>
              <Label htmlFor="facility_id" className="text-sm font-medium text-gray-700">
                Facility ID (Optional)
              </Label>
              <Input
                id="facility_id"
                {...form.register("facility_id")}
                placeholder="Enter facility ID if known"
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave blank if you don't know your facility ID.
              </p>
            </div>

            {/* Hub ID (Optional) */}
            <div>
              <Label htmlFor="hub_id" className="text-sm font-medium text-gray-700">
                Hub ID (Optional)
              </Label>
              <Input
                id="hub_id"
                {...form.register("hub_id")}
                placeholder="Enter hub ID if known"
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave blank if you don't know your hub ID.
              </p>
            </div>

            {/* Information Notice */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This information will be automatically filled in test request forms. 
                Make sure the details are accurate to ensure proper sample routing and result delivery.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Link href="/settings">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 