"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, CheckCircle, ArrowUpDown, Loader2, Eye, PackageOpen, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { api } from "@/trpc/react"

export default function PackageSamplesPage() {
  const router = useRouter()
  const [packageIdentifier, setPackageIdentifier] = React.useState("")
  const [selectedSamples, setSelectedSamples] = React.useState<string[]>([])
  const [pageSize, setPageSize] = React.useState(50)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [viewPageSize, setViewPageSize] = React.useState(50)
  const [viewCurrentPage, setViewCurrentPage] = React.useState(1)
  const [selectedPackage, setSelectedPackage] = React.useState<string>("")

  // Calculate pagination for both tabs
  const offset = (currentPage - 1) * pageSize
  const viewOffset = (viewCurrentPage - 1) * viewPageSize

  // Fetch collected samples using tRPC
  const { 
    data: samplesData, 
    isLoading, 
    error,
    refetch 
  } = api.viralLoad.getCollectedSamples.useQuery({
    limit: pageSize,
    offset: offset,
  })

  // Fetch packaged samples
  const {
    data: packagedData,
    isLoading: isLoadingPackaged,
    error: packagedError,
    refetch: refetchPackaged
  } = api.viralLoad.getPackagedSamples.useQuery({
    limit: viewPageSize,
    offset: viewOffset,
    packageIdentifier: selectedPackage || undefined,
  })

  // Fetch package summary
  const {
    data: packageSummary,
    isLoading: isLoadingSummary,
  } = api.viralLoad.getPackageSummary.useQuery()

  // Package samples mutation
  const packageSamplesMutation = api.viralLoad.packageSamples.useMutation({
    onSuccess: (data) => {
      toast.success(data.message)
      setPackageIdentifier("")
      setSelectedSamples([])
      refetch() // Refresh the samples list
      refetchPackaged() // Refresh packaged samples
    },
    onError: (error) => {
      toast.error(error.message || "Failed to package samples")
    },
  })

  const samples = samplesData?.samples || []
  const totalSamples = samplesData?.total || 0
  const totalPages = Math.ceil(totalSamples / pageSize)

  const packagedSamples = packagedData?.samples || []
  const totalPackagedSamples = packagedData?.total || 0
  const totalPackagedPages = Math.ceil(totalPackagedSamples / viewPageSize)
  const availablePackages = packagedData?.packages || []

  const handleSelectAll = () => {
    if (selectedSamples.length === samples.length) {
      setSelectedSamples([])
    } else {
      setSelectedSamples(samples.map(sample => sample.vl_sample_id || sample.id.toString()))
    }
  }

  const handleSelectSample = (sampleId: string) => {
    setSelectedSamples(prev => 
      prev.includes(sampleId) 
        ? prev.filter(id => id !== sampleId)
        : [...prev, sampleId]
    )
  }

  const handleSubmit = async () => {
    if (!packageIdentifier.trim()) {
      toast.error("Please enter a package identifier")
      return
    }

    if (selectedSamples.length === 0) {
      toast.error("Please select at least one sample to package")
      return
    }

    packageSamplesMutation.mutate({
      packageIdentifier: packageIdentifier.trim(),
      sampleIds: selectedSamples,
    })
  }

  // Helper function to get ART number (fallback to reception or data ART number)
  const getArtNumber = (sample: any) => {
    return sample.reception_art_number || sample.data_art_number || sample.patient_unique_id || "N/A"
  }

  // Helper function to get sample type display
  const getSampleTypeDisplay = (sampleType: string) => {
    switch (sampleType) {
      case "P": return "Plasma"
      case "D": return "DBS"
      case "W": return "Whole Blood"
      default: return sampleType || "Unknown"
    }
  }

  // Helper function to get sample status
  const getSampleStatus = (sample: any) => {
    // Primary validation: use date_received as the key indicator
    if (sample.date_received) {
      // If received and verified, it's completed
      if (sample.verified === 1) {
        return { label: "Completed", variant: "default" as const, color: "text-green-600 bg-green-50", icon: CheckCircle }
      }
      // If received but not verified, it's processing
      return { label: "Processing", variant: "secondary" as const, color: "text-blue-600 bg-blue-50", icon: Package }
    }
    
    // If not received but collected, it's ready for packaging
    if (sample.date_collected) {
      return { label: "Ready for Packaging", variant: "secondary" as const, color: "text-blue-600 bg-blue-50", icon: Package }
    }
    
    // If not collected, it's pending
    return { label: "Pending Collection", variant: "outline" as const, color: "text-orange-600 bg-orange-50", icon: Clock }
  }

  if (error && packagedError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data</p>
          <Button onClick={() => { refetch(); refetchPackaged(); }} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="md:container md:px-0 px-4 pt-4 pb-20 md:mx-auto">
      {/* Header with title and actions */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Package Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Package collected samples and view packaged samples
            </p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Link href="/viral-load" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-6 text-sm">
                Back to Viral Load
              </Button>
            </Link>
          </div>
        </div>
      </div>


      {/* Tabs for Package vs View */}
      <Tabs defaultValue="package" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="package" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Packaged</span>
          </TabsTrigger>
        </TabsList>

        {/* Package Samples Tab */}
        <TabsContent value="package" className="space-y-6">
          {/* Package Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Package Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="package-identifier" className="text-sm font-medium text-gray-700">
                  Package Identifier *
                </Label>
                <Input
                  id="package-identifier"
                  value={packageIdentifier}
                  onChange={(e) => setPackageIdentifier(e.target.value)}
                  placeholder="Enter package identifier (e.g., PKG-2025-001)"
                  className="mt-2 h-10"
                  required
                  disabled={packageSamplesMutation.isPending}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Selected Samples
                </Label>
                <div className="mt-2 h-10 flex items-center">
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                    {selectedSamples.length} sample{selectedSamples.length !== 1 ? 's' : ''} selected
                  </Badge>
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSubmit}
                  disabled={packageSamplesMutation.isPending || selectedSamples.length === 0 || !packageIdentifier.trim()}
                  className="bg-red-600 hover:bg-red-700 h-10 px-8 w-full"
                >
                  {packageSamplesMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Packaging...
                    </>
                  ) : (
                    "Submit Package"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Samples Table for Packaging */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Samples Ready for Packaging ({totalSamples} total)
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Samples that have been collected and are ready to be packaged for transport
              </p>
            </div>

            {/* Table Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium text-gray-700">Show</Label>
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setCurrentPage(1)
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="text-sm font-medium text-gray-700">rows</Label>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading samples...</span>
              </div>
            )}

            {/* Package Samples Table */}
            {!isLoading && (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedSamples.length === samples.length && samples.length > 0}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all samples"
                            disabled={samples.length === 0}
                          />
                        </TableHead>
                        <TableHead>ART Number</TableHead>
                        <TableHead>Sample ID</TableHead>
                        <TableHead>Sample Type</TableHead>
                        <TableHead>Date Collected</TableHead>
                        <TableHead>Form Number</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {samples.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No samples ready for packaging
                          </TableCell>
                        </TableRow>
                      ) : (
                        samples.map((sample) => {
                          const sampleId = sample.vl_sample_id || sample.id.toString()
                          return (
                            <TableRow key={sample.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedSamples.includes(sampleId)}
                                  onCheckedChange={() => handleSelectSample(sampleId)}
                                  aria-label={`Select sample ${sample.vl_sample_id}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{getArtNumber(sample)}</TableCell>
                              <TableCell className="font-mono text-sm">{sample.vl_sample_id || `ID-${sample.id}`}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {getSampleTypeDisplay(sample.sample_type || "")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {sample.date_collected ? (
                                  new Date(sample.date_collected).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                ) : (
                                  "Not collected"
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">{sample.form_number || "N/A"}</TableCell>
                              <TableCell>
                                {(() => {
                                  const status = getSampleStatus(sample);
                                  const Icon = status.icon;
                                  return (
                                    <Badge variant={status.variant} className={status.color}>
                                      <Icon className="h-3 w-3 mr-1" />
                                      {status.label}
                                    </Badge>
                                  );
                                })()}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination for Package Tab */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-gray-500">
                      {offset + 1} to {Math.min(offset + pageSize, totalSamples)} of {totalSamples}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page: number
                          if (totalPages <= 5) {
                            page = i + 1
                          } else if (currentPage <= 3) {
                            page = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i
                          } else {
                            page = currentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* View Packaged Samples Tab */}
        <TabsContent value="view" className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Packaged Samples ({totalPackagedSamples} total)
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium text-gray-700">Filter by Package:</Label>
                  <Select 
                    value={selectedPackage} 
                    onValueChange={(value) => {
                      setSelectedPackage(value === "all" ? "" : value)
                      setViewCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All packages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All packages</SelectItem>
                      {availablePackages.map((packageId) => (
                        <SelectItem key={packageId} value={packageId}>
                          {packageId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* View Table Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium text-gray-700">Show</Label>
                <Select 
                  value={viewPageSize.toString()} 
                  onValueChange={(value) => {
                    setViewPageSize(Number(value))
                    setViewCurrentPage(1)
                  }}
                  disabled={isLoadingPackaged}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="text-sm font-medium text-gray-700">rows</Label>
              </div>
            </div>

            {/* Loading State for View */}
            {isLoadingPackaged && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading packaged samples...</span>
              </div>
            )}

            {/* Packaged Samples Table */}
            {!isLoadingPackaged && (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package ID</TableHead>
                        <TableHead>ART Number</TableHead>
                        <TableHead>Sample ID</TableHead>
                        <TableHead>Sample Type</TableHead>
                        <TableHead>Date Collected</TableHead>
                        <TableHead>Date Packaged</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packagedSamples.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No packaged samples found
                          </TableCell>
                        </TableRow>
                      ) : (
                        packagedSamples.map((sample) => (
                          <TableRow key={sample.id}>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {sample.facility_reference}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{getArtNumber(sample)}</TableCell>
                            <TableCell className="font-mono text-sm">{sample.vl_sample_id || `ID-${sample.id}`}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {getSampleTypeDisplay(sample.sample_type || "")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {sample.date_collected ? (
                                new Date(sample.date_collected).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              ) : (
                                "Not collected"
                              )}
                            </TableCell>
                            <TableCell>
                              {sample.updated_at ? (
                                new Date(sample.updated_at).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              ) : (
                                "Unknown"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="text-orange-600 bg-orange-50">
                                <PackageOpen className="h-3 w-3 mr-1" />
                                Packaged
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination for View Tab */}
                {totalPackagedPages > 1 && (
                  <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-gray-500">
                      {viewOffset + 1} to {Math.min(viewOffset + viewPageSize, totalPackagedSamples)} of {totalPackagedSamples}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={viewCurrentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(totalPackagedPages, 5) }, (_, i) => {
                          let page: number
                          if (totalPackagedPages <= 5) {
                            page = i + 1
                          } else if (viewCurrentPage <= 3) {
                            page = i + 1
                          } else if (viewCurrentPage >= totalPackagedPages - 2) {
                            page = totalPackagedPages - 4 + i
                          } else {
                            page = viewCurrentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={viewCurrentPage === page ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => setViewCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewCurrentPage(prev => Math.min(prev + 1, totalPackagedPages))}
                        disabled={viewCurrentPage === totalPackagedPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
