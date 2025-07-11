"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/trpc/react";
import EditViralLoadForm from "./_components/EditViralLoadForm";

export default function EditSamplePage(): React.JSX.Element {
  const router = useRouter();
  const { id } = useParams();
  const { user, isLoading } = useAuth();

  // Fetch sample data using tRPC
  const { data: sample, isLoading: sampleLoading, error } = api.viralLoad.getSample.useQuery(
    { sampleId: id as string },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

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
            ID: {sample.vlSampleId}
          </Badge>
        </div>
      </div>

      {/* Form Component - Only render when sample data is loaded */}
      <EditViralLoadForm 
        key={sample.id} // Add key to ensure proper re-rendering
        sample={sample} 
        sampleId={id as string} 
        user={user} 
      />
    </div>
  );
}
 