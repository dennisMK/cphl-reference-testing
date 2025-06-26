"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  TestTube, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Download, 
  Printer, 
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VLResultsPage() {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('viral-load');
  const searchParams = useSearchParams();
  const resultId = searchParams.get('id');
  
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate pagination
  const offset = (currentPage - 1) * pageSize;

  // Fetch results using tRPC
  const { 
    data: resultsData, 
    isLoading: isLoadingResults, 
    error: resultsError,
    refetch: refetchResults 
  } = api.viralLoad.getResults.useQuery({
    limit: pageSize,
    offset: offset,
    searchTerm: debouncedSearchTerm || undefined,
  }, {
    enabled: !resultId, // Only fetch list when not viewing specific result
  });

  // Fetch specific result when resultId is provided
  const {
    data: specificResult,
    isLoading: isLoadingSpecific,
    error: specificError,
  } = api.viralLoad.getResult.useQuery(
    { resultId: resultId! },
    { 
      enabled: !!resultId,
    }
  );

  // Set selected result when specific result is loaded
  useEffect(() => {
    if (specificResult) {
      setSelectedResult(specificResult);
    }
  }, [specificResult]);

  // Clear selected result when resultId changes
  useEffect(() => {
    if (!resultId) {
      setSelectedResult(null);
    }
  }, [resultId]);

  const results = resultsData?.results || [];
  const totalResults = resultsData?.total || 0;
  const totalPages = Math.ceil(totalResults / pageSize);

  const getResultBadge = (interpretation: string, value: number | null) => {
    if (interpretation === "Suppressed") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Suppressed
        </Badge>
      );
    } else if (interpretation === "Unsuppressed") {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Unsuppressed
        </Badge>
      );
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getTrendIcon = (currentValue: number | null, previousValue: number | null) => {
    if (!currentValue || !previousValue) return <Minus className="h-4 w-4 text-gray-400" />;
    
    if (currentValue > previousValue) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (currentValue < previousValue) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const formatViralLoadValue = (value: number | null, detectionStatus: string) => {
    if (detectionStatus === "not_detected") {
      return "Target Not Detected";
    }
    return value ? `${value.toLocaleString()} copies/mL` : "N/A";
  };

  const InfoField = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        {icon}
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      <div className="p-2 bg-gray-50 rounded border text-sm text-gray-900">
        {value || "Not specified"}
      </div>
    </div>
  );

  // Error handling
  if (resultsError || specificError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading results: {resultsError?.message || specificError?.message}
          </p>
          <Button 
            onClick={() => { 
              refetchResults(); 
            }} 
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Loading state for specific result
  if (resultId && isLoadingSpecific) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading result details...</p>
        </div>
      </div>
    );
  }

  // If viewing a specific result
  if (selectedResult) {
    return (
      <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/viral-load/results">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Viral Load Result</h1>
                <p className="text-gray-600">Result for {selectedResult.patientId} - {selectedResult.sampleId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {getResultBadge(selectedResult.interpretation, selectedResult.viralLoadValue)}
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Test Results - Main Card */}
          <Card className="border-2" style={{ borderColor: selectedResult.interpretation === "Suppressed" ? "#10b981" : "#ef4444" }}>
            <CardHeader style={{ backgroundColor: selectedResult.interpretation === "Suppressed" ? "#ecfdf5" : "#fef2f2" }}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-6 w-6" style={{ color: selectedResult.interpretation === "Suppressed" ? "#10b981" : "#ef4444" }} />
                  <span>Viral Load Result</span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedResult.previousResults && selectedResult.previousResults[0] && 
                    getTrendIcon(selectedResult.viralLoadValue, selectedResult.previousResults[0]?.value)
                  }
                  <span className="text-sm text-gray-600">vs. previous</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Result Value</h3>
                    <div className="text-3xl font-bold" style={{ color: selectedResult.interpretation === "Suppressed" ? "#10b981" : "#ef4444" }}>
                      {formatViralLoadValue(selectedResult.viralLoadValue, selectedResult.detectionStatus)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Reference: {selectedResult.referenceRange}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Interpretation</h4>
                    <p className="text-sm text-gray-700">{selectedResult.clinicalSignificance}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <InfoField 
                    label="Result Date" 
                    value={`${selectedResult.resultDate} at ${selectedResult.resultTime}`}
                    icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  />
                  <InfoField 
                    label="Test Method" 
                    value={selectedResult.testMethod}
                    icon={<TestTube className="h-4 w-4 text-gray-500" />}
                  />
                  <InfoField 
                    label="Laboratory" 
                    value={selectedResult.laboratoryName}
                    icon={<MapPin className="h-4 w-4 text-gray-500" />}
                  />
                </div>
              </div>
              
              {/* Clinical Recommendation */}
              <Alert className="mt-6 border-blue-200 bg-blue-50">
                <FileText className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Clinical Recommendation:</strong> {selectedResult.recommendation}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Sample Information */}
          <Card>
            <CardHeader style={{ backgroundColor: colors.primaryLight }}>
              <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
                <TestTube className="h-5 w-5" />
                <span>Sample Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="Sample ID" value={selectedResult.sampleId} />
                <InfoField label="Sample Type" value={selectedResult.sampleType} />
                <InfoField label="Batch Number" value={selectedResult.batchNumber} />
                <InfoField label="Date Collected" value={selectedResult.dateCollected} />
                <InfoField label="Date Received" value={selectedResult.dateReceived} />
                <InfoField label="Date Processed" value={selectedResult.dateProcessed} />
                <InfoField label="Instrument" value={selectedResult.instrument} />
                <InfoField label="Lab Technician" value={selectedResult.labTechnician} />
                <InfoField label="Quality Control" value={selectedResult.qualityControl} />
              </div>
            </CardContent>
          </Card>

          {/* Patient & Facility Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader style={{ backgroundColor: colors.primaryLight }}>
                <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
                  <User className="h-5 w-5" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <InfoField label="Patient ID" value={selectedResult.patientId} />
                  <InfoField label="Gender" value={selectedResult.gender} />
                  <InfoField label="Age" value={`${selectedResult.age} years`} />
                  <InfoField label="Current Regimen" value={selectedResult.currentRegimen} />
                  <InfoField label="Treatment Duration" value={selectedResult.treatmentDuration} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ backgroundColor: colors.primaryLight }}>
                <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
                  <MapPin className="h-5 w-5" />
                  <span>Facility Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <InfoField label="Facility" value={selectedResult.facility} />
                  <InfoField label="District" value={selectedResult.district} />
                  <InfoField label="Hub" value={selectedResult.hub} />
                  <InfoField label="Requesting Clinician" value={selectedResult.requestingClinician} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Previous Results */}
          {selectedResult.previousResults && selectedResult.previousResults.length > 0 && (
            <Card>
              <CardHeader style={{ backgroundColor: colors.primaryLight }}>
                <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
                  <TrendingUp className="h-5 w-5" />
                  <span>Previous Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {selectedResult.previousResults.map((result: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{result.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {result.status === "not_detected" ? "Target Not Detected" : `${result.value} copies/mL`}
                        </span>
                        <Badge variant={result.status === "not_detected" || result.value < 50 ? "default" : "destructive"}>
                          {result.status === "not_detected" || result.value < 50 ? "Suppressed" : "Unsuppressed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  className="text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Result
                </Button>
                
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                
                <Link href="/viral-load/results">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Results
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main results list view
  return (
    <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link href="/viral-load">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Viral Load Results</h1>
              <p className="text-gray-600">View and manage viral load test results ({totalResults} total)</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Label htmlFor="search" className="sr-only">Search results</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search by Patient ID, Sample ID, ART Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoadingResults && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading results...</span>
        </div>
      )}

      {/* Results List */}
      {!isLoadingResults && (
        <>
          {/* Results Table */}
          {results.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Test Results ({totalResults} total)
                </h2>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium text-gray-700">Show</Label>
                  <Select 
                    value={pageSize.toString()} 
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setCurrentPage(1)
                    }}
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

              {/* Debug info - remove this in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Debug: Results={results.length}, Total={totalResults}, Pages={totalPages}, Current={currentPage}, Offset={offset}
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sample Type</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.patientId}</TableCell>
                        <TableCell className="font-mono text-sm">{result.sampleId}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <span className="font-medium">
                              {formatViralLoadValue(result.viralLoadValue, result.detectionStatus)}
                            </span>
                            <span className="text-xs text-gray-500">{result.viralLoadUnit}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getResultBadge(result.interpretation, result.viralLoadValue)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm">{result.resultDate}</span>
                            <span className="text-xs text-gray-500">{result.resultTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {result.sampleType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{result.facility}</TableCell>
                        <TableCell>
                          <Link href={`/viral-load/results?id=${result.id}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalResults > 0 && (
                <div className="flex items-center justify-between px-2">
                  <div className="text-sm text-gray-500">
                    {offset + 1} to {Math.min(offset + pageSize, totalResults)} of {totalResults}
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
                    {totalPages > 1 && (
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
                    )}
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
            </div>
          ) : (
            /* No Results */
            <Card>
              <CardContent className="p-8 text-center">
                <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">
                  {searchTerm ? `No results match "${searchTerm}"` : "No viral load results available."}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
} 