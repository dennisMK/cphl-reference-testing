"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Package, 
  Clock, 
  ArrowLeft,
  Edit,
  Download,
  Printer,
  Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="text-orange-600 bg-orange-50">Pending Collection</Badge>
    case "collected":
      return <Badge variant="secondary" className="text-blue-600 bg-blue-50">Collected</Badge>
    case "processing":
      return <Badge variant="secondary" className="text-purple-600 bg-purple-50">Processing</Badge>
    case "completed":
      return <Badge variant="secondary" className="text-green-600 bg-green-50">Completed</Badge>
    case "rejected":
      return <Badge variant="secondary" className="text-red-600 bg-red-50">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return <Badge variant="destructive">Urgent</Badge>
    case "High":
      return <Badge variant="secondary" className="text-orange-600 bg-orange-50">High</Badge>
    case "Routine":
      return <Badge variant="outline">Routine</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

export default function SampleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  // Fetch sample data using tRPC
  const { data: sample, isLoading, error } = api.viralLoad.getSample.useQuery(
    { sampleId: params.id },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading sample details...</span>
          </div>
        </div>
      </main>
    )
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
    )
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
    )
  }

  // Determine status based on sample data
  const getSampleStatus = () => {
    if (sample.verified === 1) return "completed"
    if (sample.date_received) return "processing"
    if (sample.date_collected) return "collected"
    return "pending"
  }

  const status = getSampleStatus()

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{sample.vl_sample_id}</h1>
            <p className="text-muted-foreground">Viral Load Sample Details</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge(status)}
          <Badge variant="outline">Routine</Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/viral-load/${sample.vl_sample_id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Sample
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print Label
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                <p className="font-medium">{sample.patient_unique_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ART Number</p>
                <p className="font-medium">{sample.art_number || "Not specified"}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sample ID</p>
                <p className="font-medium">{sample.vl_sample_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Form Number</p>
                <p className="font-medium">{sample.form_number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sample Type</p>
                <Badge variant="outline">
                  {sample.sample_type === "P" ? "Plasma" : 
                   sample.sample_type === "D" ? "DBS" : 
                   sample.sample_type === "W" ? "Whole Blood" : sample.sample_type}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <Badge variant={sample.verified === 1 ? "secondary" : "outline"}>
                  {sample.verified === 1 ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Sample Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sample ID</p>
                <p className="font-mono text-sm font-medium">{sample.vl_sample_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Form Number</p>
                <p className="font-mono text-sm">{sample.form_number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sample Type</p>
                <Badge variant="outline">
                  {sample.sample_type === "P" ? "Plasma" : 
                   sample.sample_type === "D" ? "DBS" : 
                   sample.sample_type === "W" ? "Whole Blood" : sample.sample_type}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Worksheet</p>
                <Badge variant={sample.in_worksheet === 1 ? "secondary" : "outline"}>
                  {sample.in_worksheet === 1 ? "Yes" : "No"}
                </Badge>
              </div>
            </div>

            {sample.pregnant && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pregnant</p>
                <p className="font-medium">{sample.pregnant}</p>
              </div>
            )}

            {sample.anc_number && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">ANC Number</p>
                <p className="font-medium">{sample.anc_number}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline & Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline & Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <span className="text-sm">
                  {sample.created_at ? new Date(sample.created_at).toLocaleDateString() : "Not specified"}
                </span>
              </div>

              {sample.date_collected && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Collected</span>
                  </div>
                  <span className="text-sm">{new Date(sample.date_collected).toLocaleDateString()}</span>
                </div>
              )}

              {sample.date_received && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Received</span>
                  </div>
                  <span className="text-sm">{new Date(sample.date_received).toLocaleDateString()}</span>
                </div>
              )}

              {sample.updated_at && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Last Updated</span>
                  </div>
                  <span className="text-sm">{new Date(sample.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sample.treatment_initiation_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Treatment Initiation Date</p>
                <p className="font-medium">{new Date(sample.treatment_initiation_date).toLocaleDateString()}</p>
              </div>
            )}

            {sample.current_regimen_initiation_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Regimen Initiation Date</p>
                <p className="font-medium">{new Date(sample.current_regimen_initiation_date).toLocaleDateString()}</p>
              </div>
            )}

            {sample.breast_feeding && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Breast Feeding</p>
                <p className="font-medium">{sample.breast_feeding}</p>
              </div>
            )}

            {sample.active_tb_status && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active TB Status</p>
                <p className="font-medium">{sample.active_tb_status}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {status === "pending" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={() => router.push(`/viral-load/${sample.vl_sample_id}/collect`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Package className="h-4 w-4 mr-2" />
                Collect Sample
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push(`/viral-load/${sample.vl_sample_id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
} 