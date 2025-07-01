"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  Loader2,
  Filter,
  RefreshCw
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
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Optimized debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (currentPage !== 1) {
        setCurrentPage(1); // Only reset page if not already on page 1
      }
    }, 500); // Increased debounce time to 500ms for better UX

    return () => clearTimeout(timer);
  }, [searchTerm]); // Removed debouncedSearchTerm dependency to prevent loops

  // Calculate pagination - memoized to prevent recalculation
  const offset = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize]);

  // Fetch results using tRPC
  const { 
    data: resultsData, 
    isLoading: isLoadingResults, 
    error: resultsError,
    refetch: refetchResults,
    isFetching: isFetchingResults
  } = api.viralLoad.getResults.useQuery({
    limit: pageSize,
    offset: offset,
    searchTerm: debouncedSearchTerm || undefined,
  }, {
    enabled: !resultId,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
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
      refetchOnWindowFocus: false,
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

  // Memoized results to prevent unnecessary recalculation
  const results = useMemo(() => resultsData?.results || [], [resultsData?.results]);
  const totalResults = useMemo(() => resultsData?.total || 0, [resultsData?.total]);
  const totalPages = useMemo(() => Math.ceil(totalResults / pageSize), [totalResults, pageSize]);

  // Memoized badge component to prevent re-renders
  const getResultBadge = useCallback((interpretation: string, status: string) => {
    if (status === "pending") {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }
    
    if (interpretation === "Suppressed") {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Suppressed
        </Badge>
      );
    } else if (interpretation === "Unsuppressed") {
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Unsuppressed
        </Badge>
      );
    } else if (interpretation === "Result Pending") {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <Loader2 className="h-3 w-3 mr-1" />
          Processing
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        <XCircle className="h-3 w-3 mr-1" />
        Unknown
      </Badge>
    );
  }, []);

  // Memoized format function
  const formatViralLoadValue = useCallback((value: number | null, detectionStatus: string) => {
    if (detectionStatus === "not_detected") {
      return "Not Detected";
    }
    return value ? `${value.toLocaleString()}` : "N/A";
  }, []);

  // Optimized search input handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Optimized page size change handler
  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  }, []);

  // Show loading state only for initial load, not for search/pagination
  const showMainLoader = isLoadingResults && !isFetchingResults;

  // Error state
  if (resultsError || specificError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Results</h3>
            <p className="text-gray-600 mb-4">
              {resultsError?.message || specificError?.message || "Something went wrong"}
            </p>
            <Button 
              onClick={() => refetchResults()} 
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if ((resultId && isLoadingSpecific) || showMainLoader) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  // Individual result view
  if (selectedResult) {
    return (
      <div className="min-h-screen">
        <div className="md:container mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/viral-load/results">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Results
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Viral Load Result</h1>
                <p className="text-gray-600 mt-1">
                  Patient: {selectedResult.patientId} • Sample: {selectedResult.sampleId}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {getResultBadge(selectedResult.interpretation, selectedResult.status)}
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Main Result Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-gray-600 mb-2">Viral Load Result</h2>
                  <div className={`text-4xl font-bold ${
                    selectedResult.interpretation === "Suppressed" ? "text-green-600" : "text-red-600"
                  }`}>
                    {formatViralLoadValue(selectedResult.viralLoadValue, selectedResult.detectionStatus)}
                  </div>
                  {selectedResult.detectionStatus !== "not_detected" && (
                    <p className="text-gray-500 mt-1">copies/mL</p>
                  )}
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <Alert className={`${
                    selectedResult.interpretation === "Suppressed" 
                      ? "border-green-200 bg-green-50" 
                      : "border-red-200 bg-red-50"
                  }`}>
                    <AlertDescription className="text-center">
                      <strong>Clinical Interpretation:</strong> {selectedResult.clinicalSignificance}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-blue-600" />
                  Sample Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Sample ID</p>
                    <p className="font-medium font-mono">{selectedResult.sampleId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Form Number</p>
                    <p className="font-medium font-mono">{selectedResult.formNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-medium">{selectedResult.sampleType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Collected</p>
                    <p className="font-medium">{selectedResult.dateCollected || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Received</p>
                    <p className="font-medium">{selectedResult.dateReceived || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Processed</p>
                    <p className="font-medium">{selectedResult.dateProcessed || "Pending"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Patient Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">ART Number</p>
                    <p className="font-medium">{selectedResult.patientId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Facility</p>
                    <p className="font-medium">{selectedResult.facility}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Clinician</p>
                    <p className="font-medium">{selectedResult.requestingClinician}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Result Date</p>
                    <p className="font-medium">{selectedResult.resultDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium capitalize">{selectedResult.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Laboratory Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Laboratory Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Laboratory</p>
                    <p className="font-medium">{selectedResult.laboratoryName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Test Method</p>
                    <p className="font-medium">{selectedResult.testMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Instrument</p>
                    <p className="font-medium">{selectedResult.instrument}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quality Control</p>
                    <p className="font-medium">{selectedResult.qualityControl}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reference Range</p>
                    <p className="font-medium">{selectedResult.referenceRange}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Detection Status</p>
                    <p className="font-medium capitalize">{selectedResult.detectionStatus?.replace('_', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinical Information */}
          {selectedResult.recommendation && (
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Clinical Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    {selectedResult.recommendation}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Main results list view
  return (
    <div className="min-h-screen">
      <div className="md:container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/viral-load">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Viral Load
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Viral Load Requests</h1>
              <p className="text-gray-600 mt-1">
                {totalResults > 0 ? `${totalResults} results found` : "No results available"}
              </p>
            </div>
            
            <Button
              onClick={() => refetchResults()}
              variant="outline"
              size="sm"
              disabled={isLoadingResults}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingResults ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {isFetchingResults && searchTerm && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
                )}
                <Input
                  placeholder="Search by patient ID, sample ID, or ART number..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`pl-10 ${isFetchingResults && searchTerm ? 'pr-10' : ''}`}
                />
              </div>
              
              {/* Page Size */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600">Show:</Label>
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-semibold">
                        Patient
                        {isFetchingResults && (
                          <Loader2 className="h-3 w-3 animate-spin inline ml-2 text-blue-500" />
                        )}
                      </TableHead>
                      <TableHead className="font-semibold">Sample</TableHead>
                      <TableHead className="font-semibold">Result</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Facility</TableHead>
                      <TableHead className="font-semibold">Collected</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <span className="font-medium">{result.patientId}</span>
                            {result.formNumber && (
                              <div className="text-xs text-gray-500 font-mono">{result.formNumber}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">
                          <div>
                            <div>{result.sampleId}</div>
                            {result.dateReceived && (
                              <div className="text-xs text-gray-400">Received: {result.dateReceived}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">
                              {formatViralLoadValue(result.viralLoadValue, result.detectionStatus)}
                            </span>
                            {result.detectionStatus !== "not_detected" && result.viralLoadValue && (
                              <span className="text-xs text-gray-500 ml-1">{result.viralLoadUnit}</span>
                            )}
                            {result.detectionStatus && (
                              <div className="text-xs text-gray-400 capitalize">
                                {result.detectionStatus.replace('_', ' ')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getResultBadge(result.interpretation, result.status)}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div className="font-medium text-gray-900">{result.facility}</div>
                            {result.requestingClinician && (
                              <div className="text-xs text-gray-500">{result.requestingClinician}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div>
                            <div>{result.dateCollected}</div>
                            {result.resultDate && result.resultDate !== result.dateCollected && (
                              <div className="text-xs text-gray-400">Result: {result.resultDate}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {result.sampleType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/viral-load/results?id=${result.id}`}>
                            <Button variant="ghost" size="sm" className="h-8">
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
                <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Showing {offset + 1} to {Math.min(offset + pageSize, totalResults)} of {totalResults} results
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1">
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
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <TestTube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `No results match "${searchTerm}". Try adjusting your search.` 
                  : "No Viral Load Requests are available yet."
                }
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm("")}
                  size="sm"
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 