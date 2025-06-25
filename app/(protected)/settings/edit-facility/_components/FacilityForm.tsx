"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Save, Loader2, Building, AlertCircle, CheckCircle } from "lucide-react";

const facilitySchema = z.object({
  facility_name: z.string().min(1, "Facility name is required").min(2, "Facility name must be at least 2 characters"),
  district: z.string().min(1, "District is required"),
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

interface User {
  id: number;
  name: string;
  email: string | null;
  username: string;
  telephone: string | null;
  facility_id: number | null;
  facility_name: string | null;
  hub_id: number | null;
  hub_name: string | null;
  deactivated: number;
  other_facilities: string | null;
  ip_id: number | null;
  ip_name: string | null;
  requesting_facility_id: number | null;
}

interface FacilityFormProps {
  user: User;
  onSuccess: () => void;
}

export default function FacilityForm({ user, onSuccess }: FacilityFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

    const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      facility_name: "",
      district: "",
      hub_name: "",
      facility_id: "",
      hub_id: "",
    },
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      console.log('🏥 User data:', user);
      
      // Find the district that contains the user's hub
      let currentDistrict = "";
      if (user.hub_name) {
        const districtData = ugandaHubs.find(d => 
          d.hubs.includes(user.hub_name!)
        );
        if (districtData) {
          currentDistrict = districtData.district;
        }
      }
      
      setSelectedDistrict(currentDistrict);
      
      // Set form values
      const formData = {
        facility_name: user.facility_name || "",
        district: currentDistrict,
        hub_name: user.hub_name || "",
        facility_id: user.facility_id?.toString() || "",
        hub_id: user.hub_id?.toString() || "",
      };
      
      console.log('📝 Form data being set:', formData);
      form.reset(formData);
    }
  }, [user, form]);

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    form.setValue("district", district);
    form.setValue("hub_name", ""); // Reset hub selection when district changes
  };

  const getAvailableHubs = () => {
    const currentDistrict = form.watch("district") || selectedDistrict;
    const districtData = ugandaHubs.find(d => d.district === currentDistrict);
    return districtData ? districtData.hubs : [];
  };

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
        onSuccess(); // Call the success callback to refresh user data
        
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Facility Name */}
              <FormField
                control={form.control}
                name="facility_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter facility name (e.g., Mulago National Referral Hospital)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* District Selection */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District *</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        handleDistrictChange(value);
                      }} value={field.value}>
                        <SelectTrigger>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hub Selection */}
              <FormField
                control={form.control}
                name="hub_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testing Hub *</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!form.watch("district")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={form.watch("district") ? "Select testing hub" : "Select district first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableHubs().map((hub) => (
                            <SelectItem key={hub} value={hub}>
                              {hub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Facility ID (Optional) */}
              <FormField
                control={form.control}
                name="facility_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter facility ID if known"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank if you don't know your facility ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hub ID (Optional) */}
              <FormField
                control={form.control}
                name="hub_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hub ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter hub ID if known"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank if you don't know your hub ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 