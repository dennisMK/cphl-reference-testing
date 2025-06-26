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
  Activity
} from "lucide-react";
import Link from "next/link";

// Mock viral load results data
const mockResultsData = {
  "VL-001456": {
    id: "VL-001456",
    patientId: "95/24",
    sampleId: "VLS-2024-001456",
    
    // Test Results
    viralLoadValue: 45,
    viralLoadUnit: "copies/mL",
    detectionStatus: "detected",
    resultDate: "2024-01-20",
    resultTime: "14:30",
    
    // Result Interpretation
    interpretation: "Suppressed",
    clinicalSignificance: "Good viral suppression. Continue current treatment.",
    recommendation: "Continue current ARV regimen. Next VL test in 6 months.",
    
    // Laboratory Information
    laboratoryName: "Central Public Health Laboratory",
    labTechnician: "Dr. Sarah Nakamya",
    testMethod: "Real-time PCR",
    instrument: "Abbott m2000rt",
    batchNumber: "VL-2024-B047",
    
    // Sample Information
    sampleType: "Plasma",
    dateCollected: "2024-01-18",
    dateReceived: "2024-01-19",
    dateProcessed: "2024-01-20",
    
    // Facility Information
    facility: "Butabika Hospital",
    district: "Kampala",
    hub: "Kampala Hub",
    
    // Patient Information
    patientName: "Patient #95/24",
    gender: "Male",
    age: 36,
    requestingClinician: "Dr. Rita Zemeyi",
    
    // Treatment Information
    currentRegimen: "1N+TDF+3TC+DTG",
    treatmentDuration: "18 years",
    
    // Previous Results
    previousResults: [
      { date: "2023-07-15", value: 52, status: "detected" },
      { date: "2023-01-10", value: 38, status: "detected" },
      { date: "2022-07-05", value: 89, status: "detected" }
    ],
    
    // Quality Control
    qualityControl: "Passed",
    referenceRange: "< 50 copies/mL (Suppressed)",
    
    status: "completed"
  },
  "VL-001457": {
    id: "VL-001457",
    patientId: "96/24",
    sampleId: "VLS-2024-001457",
    
    viralLoadValue: 1250,
    viralLoadUnit: "copies/mL",
    detectionStatus: "detected",
    resultDate: "2024-01-21",
    resultTime: "09:15",
    
    interpretation: "Unsuppressed",
    clinicalSignificance: "Viral load above suppression threshold. Requires clinical review.",
    recommendation: "Review adherence counseling. Consider treatment modification. Repeat VL in 3 months.",
    
    laboratoryName: "Central Public Health Laboratory",
    labTechnician: "Dr. James Okello",
    testMethod: "Real-time PCR",
    instrument: "Abbott m2000rt",
    batchNumber: "VL-2024-B048",
    
    sampleType: "Plasma",
    dateCollected: "2024-01-19",
    dateReceived: "2024-01-20",
    dateProcessed: "2024-01-21",
    
    facility: "Mulago Hospital",
    district: "Kampala",
    hub: "Kampala Hub",
    
    patientName: "Patient #96/24",
    gender: "Female",
    age: 28,
    requestingClinician: "Dr. John Mugisha",
    
    currentRegimen: "TDF/3TC/EFV",
    treatmentDuration: "2 years",
    
    previousResults: [
      { date: "2023-10-15", value: 890, status: "detected" },
      { date: "2023-04-20", value: 1450, status: "detected" },
      { date: "2022-10-10", value: 2100, status: "detected" }
    ],
    
    qualityControl: "Passed",
    referenceRange: "< 50 copies/mL (Suppressed)",
    
    status: "completed"
  },
  "VL-001458": {
    id: "VL-001458",
    patientId: "78/24",
    sampleId: "VLS-2024-001458",
    
    viralLoadValue: null,
    viralLoadUnit: "copies/mL",
    detectionStatus: "not_detected",
    resultDate: "2024-01-22",
    resultTime: "11:45",
    
    interpretation: "Suppressed",
    clinicalSignificance: "Excellent viral suppression. Target not detected.",
    recommendation: "Continue current ARV regimen. Next VL test in 12 months.",
    
    laboratoryName: "Central Public Health Laboratory",
    labTechnician: "Dr. Mary Kisakye",
    testMethod: "Real-time PCR",
    instrument: "Abbott m2000rt",
    batchNumber: "VL-2024-B049",
    
    sampleType: "Plasma",
    dateCollected: "2024-01-20",
    dateReceived: "2024-01-21",
    dateProcessed: "2024-01-22",
    
    facility: "Kiruddu Hospital",
    district: "Wakiso",
    hub: "Wakiso Hub",
    
    patientName: "Patient #78/24",
    gender: "Male",
    age: 42,
    requestingClinician: "Dr. Grace Nalongo",
    
    currentRegimen: "TDF/3TC/DTG",
    treatmentDuration: "5 years",
    
    previousResults: [
      { date: "2023-01-15", value: null, status: "not_detected" },
      { date: "2022-07-10", value: 25, status: "detected" },
      { date: "2022-01-05", value: 180, status: "detected" }
    ],
    
    qualityControl: "Passed",
    referenceRange: "< 50 copies/mL (Suppressed)",
    
    status: "completed"
  }
};

// List of all results for the main view
const allResults = Object.values(mockResultsData);

export default function VLResultsPage() {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('viral-load');
  const searchParams = useSearchParams();
  const resultId = searchParams.get('id');
  
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState(allResults);

  useEffect(() => {
    if (resultId && mockResultsData[resultId as keyof typeof mockResultsData]) {
      setSelectedResult(mockResultsData[resultId as keyof typeof mockResultsData]);
    }
  }, [resultId]);

  useEffect(() => {
    const filtered = allResults.filter(result => 
      result.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.facility.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchTerm]);

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
                  {getTrendIcon(selectedResult.viralLoadValue, selectedResult.previousResults[0]?.value)}
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
              <p className="text-gray-600">View and manage viral load test results</p>
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
              placeholder="Search by Patient ID, Sample ID, or Facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {result.patientId}
                    </h3>
                    {getResultBadge(result.interpretation, result.viralLoadValue)}
                    <span className="text-sm text-gray-500">
                      {result.sampleId}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>
                        <strong>Result:</strong> {formatViralLoadValue(result.viralLoadValue, result.detectionStatus)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        <strong>Date:</strong> {result.resultDate}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        <strong>Facility:</strong> {result.facility}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>
                        <strong>Clinician:</strong> {result.requestingClinician}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Link href={`/viral-load/results?id=${result.id}`}>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Result
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResults.length === 0 && (
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
    </div>
  );
} 