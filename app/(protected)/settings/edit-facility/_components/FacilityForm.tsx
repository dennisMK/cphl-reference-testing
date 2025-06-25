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
import { useAuth } from "@/lib/auth-context";

const facilitySchema = z.object({
  facility_name: z.string().min(1, "Facility name is required").min(2, "Facility name must be at least 2 characters"),
  hub_name: z.string().min(1, "Hub name is required"),
  facility_id: z.string().optional(),
  hub_id: z.string().optional(),
  other_facilities: z.string().optional(),
  requesting_facility_id: z.string().optional(),
});

type FacilityFormData = z.infer<typeof facilitySchema>;

// All available hubs from the database
const availableHubs = [
  "Kampala Hub", "Mulago Hub", "Kiruddu Hub",
  "Wakiso Hub", "Entebbe Hub",
  "Mukono Hub", "Lugazi Hub",
  "Jinja Hub", "Iganga Hub",
  "Mbale Hub", "Tororo Hub",
  "Gulu Hub", "Lira Hub",
  "Mbarara Hub", "Bushenyi Hub",
  "Fort Portal Hub", "Kasese Hub",
  "Masaka Hub", "Rakai Hub",
  "Soroti Hub", "Kumi Hub",
  "Kayunga Hub", "Kawolo Hub",
  "Gombe Hub", "Mubende Hub",
  "Maddu Hub", "Mityana Hub",
  "Luwero Hub", "Amolatar Hub",
  "Moroto Hub"
];

export default function FacilityForm() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      facility_name: user?.facility_name || "",
      hub_name: user?.hub_name || "",
      facility_id: user?.facility_id?.toString() || "",
      hub_id: user?.hub_id?.toString() || "",
      other_facilities: user?.other_facilities || "",
      requesting_facility_id: user?.requesting_facility_id?.toString() || "",
    },
  });

  // Update form values when user data loads
  React.useEffect(() => {
    if (user) {
      form.reset({
        facility_name: user.facility_name || "",
        hub_name: user.hub_name || "",
        facility_id: user.facility_id?.toString() || "",
        hub_id: user.hub_id?.toString() || "",
        other_facilities: user.other_facilities || "",
        requesting_facility_id: user.requesting_facility_id?.toString() || "",
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
          other_facilities: data.other_facilities || null,
          requesting_facility_id: data.requesting_facility_id ? parseInt(data.requesting_facility_id) : null,
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

              {/* Hub Selection */}
              <FormField
                control={form.control}
                name="hub_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testing Hub *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select testing hub" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableHubs.map((hub) => (
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

              {/* Other Facilities (Optional) */}
              <FormField
                control={form.control}
                name="other_facilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Facilities (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter other facilities if applicable"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional facilities associated with your account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requesting Facility ID (Optional) */}
              <FormField
                control={form.control}
                name="requesting_facility_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requesting Facility ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter requesting facility ID if known"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      ID of the facility making requests.
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