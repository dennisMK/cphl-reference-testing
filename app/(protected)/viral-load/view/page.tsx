"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TestTube, User, MapPin, Calendar, Clock, Edit, Heart, Stethoscope, Pill } from "lucide-react";
import Link from "next/link";

// Extended mock data with full request details
const mockRequestData = {
  "VL-001456": {
    id: "VL-001456",
    patientId: "95/24",
    status: "pending",
    
    // Facility Information
    facility: "Butabika Hospital",
    district: "Kampala", 
    hub: "Kampala Hub",
    
    // Requesting Clinician
    clinicianName: "Dr. Rita Zemeyi",
    requestDate: "2025-06-17",
    
    // Patient Information
    otherId: "",
    gender: "Male",
    dateOfBirth: "1989-06-26",
    age: 36,
    phoneNumber: "+256 703 998 916",
    
    // Treatment Information
    treatmentInitiationDate: "2005-05-11",
    currentRegimen: "1N+TDF+3TC+DTG",
    currentRegimenInitiationDate: "2024-05-21",
    pregnant: "no",
    ancNumber: "",
    motherBreastFeeding: "no",
    activeTbStatus: "no",
    tbTreatmentPhase: "none",
    arvAdherence: "good",
    treatmentCareApproach: "FTDR",
    currentWhoStage: "1",
    indicationForTesting: "Routine monitoring"
  },
  "VL-001457": {
    id: "VL-001457",
    patientId: "96/24",
    status: "pending",
    
    facility: "Mulago Hospital",
    district: "Kampala",
    hub: "Kampala Hub",
    
    clinicianName: "Dr. John Mugisha", 
    requestDate: "2025-06-16",
    
    otherId: "ALT-789",
    gender: "Female",
    dateOfBirth: "1997-03-15",
    age: 28,
    phoneNumber: "+256 701 234 567",
    
    treatmentInitiationDate: "2022-01-10",
    currentRegimen: "TDF/3TC/EFV",
    currentRegimenInitiationDate: "2022-01-10",
    pregnant: "yes",
    ancNumber: "ANC-2024-456",
    motherBreastFeeding: "unknown",
    activeTbStatus: "no",
    tbTreatmentPhase: "none", 
    arvAdherence: "good",
    treatmentCareApproach: "Facility-based",
    currentWhoStage: "2",
    indicationForTesting: "Post treatment initiation"
  }
};

export default function ViewRequestPage() {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('viral-load');
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');
  const [requestData, setRequestData] = useState<any>(null);
  
  useEffect(() => {
    if (requestId && mockRequestData[requestId as keyof typeof mockRequestData]) {
      setRequestData(mockRequestData[requestId as keyof typeof mockRequestData]);
    }
  }, [requestId]);

  if (!requestId || !requestData) {
    return (
      <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Request Not Found</h3>
              <p className="text-gray-600 mb-4">
                {!requestId ? "No request ID provided." : `Request ID ${requestId} not found.`}
              </p>
              <Link href="/viral-load/pending-collection">
                <Button style={{ backgroundColor: colors.primary }} className="text-white">
                  Back to Pending Collection
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending Collection</Badge>;
      case 'collected':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Sample Collected</Badge>;
      case 'packaged':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Packaged</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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

  return (
    <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link href="/viral-load/pending-collection">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">View Request</h1>
              <p className="text-gray-600">Request details for {requestId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {getStatusBadge(requestData.status)}
            <Link href={`/viral-load/edit?id=${requestId}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Facility Information */}
        <Card>
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
              <MapPin className="h-5 w-5" />
              <span>Facility Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField label="Facility" value={requestData.facility} />
              <InfoField label="District" value={requestData.district} />
              <InfoField label="Hub" value={requestData.hub} />
            </div>
          </CardContent>
        </Card>

        {/* Requesting Clinician */}
        <Card>
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
              <User className="h-5 w-5" />
              <span>Requesting Clinician</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField 
                label="Clinician Name" 
                value={requestData.clinicianName}
                icon={<User className="h-4 w-4 text-gray-500" />}
              />
              <InfoField 
                label="Request Date" 
                value={requestData.requestDate}
                icon={<Calendar className="h-4 w-4 text-gray-500" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
              <User className="h-5 w-5" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoField label="Patient Clinic ID/ART #" value={requestData.patientId} />
              <InfoField label="Other ID" value={requestData.otherId} />
              <InfoField label="Gender" value={requestData.gender} />
              <InfoField label="Date of Birth" value={requestData.dateOfBirth} />
              <InfoField label="Age" value={`${requestData.age} years`} />
              <InfoField label="Phone Number" value={requestData.phoneNumber} />
            </div>
          </CardContent>
        </Card>

        {/* Treatment Information */}
        <Card>
          <CardHeader style={{ backgroundColor: colors.primaryLight }}>
            <CardTitle className="flex items-center space-x-2" style={{ color: colors.primaryDark }}>
              <TestTube className="h-5 w-5" />
              <span>Treatment Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Treatment Initiation Date" value={requestData.treatmentInitiationDate} />
                <InfoField label="Current Regimen Initiation Date" value={requestData.currentRegimenInitiationDate} />
              </div>
              
              <InfoField label="Current Regimen" value={requestData.currentRegimen} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField 
                  label="Pregnant" 
                  value={requestData.pregnant === 'yes' ? 'Yes' : requestData.pregnant === 'no' ? 'No' : 'Unknown'}
                  icon={<Heart className="h-4 w-4 text-gray-500" />}
                />
                <InfoField label="ANC Number" value={requestData.ancNumber} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField 
                  label="Mother Breast-Feeding" 
                  value={requestData.motherBreastFeeding === 'yes' ? 'Yes' : requestData.motherBreastFeeding === 'no' ? 'No' : 'Unknown'}
                />
                <InfoField 
                  label="Active TB Status" 
                  value={requestData.activeTbStatus === 'yes' ? 'Yes' : requestData.activeTbStatus === 'no' ? 'No' : 'Unknown'}
                  icon={<Stethoscope className="h-4 w-4 text-gray-500" />}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="TB Treatment Phase" value={requestData.tbTreatmentPhase} />
                <InfoField 
                  label="ARV Adherence" 
                  value={requestData.arvAdherence}
                  icon={<Pill className="h-4 w-4 text-gray-500" />}
                />
                <InfoField label="Current WHO Stage" value={`Stage ${requestData.currentWhoStage}`} />
              </div>
              
              <InfoField label="Treatment Care Approach (DSDM)" value={requestData.treatmentCareApproach} />
              
              <InfoField label="Indication for Viral Load Testing" value={requestData.indicationForTesting} />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/viral-load/edit?id=${requestId}`}>
                <Button 
                  className="text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Request
                </Button>
              </Link>
              
              {requestData.status === 'pending' && (
                <Link href={`/viral-load/collect-sample?id=${requestId}`}>
                  <Button variant="outline">
                    <TestTube className="h-4 w-4 mr-2" />
                    Collect Sample
                  </Button>
                </Link>
              )}
              
              <Link href="/viral-load/pending-collection">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 