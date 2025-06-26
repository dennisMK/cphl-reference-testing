"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface EditEidRequestPageProps {
  params: {
    requesId: string;
  };
}

// Mock data for the EID request (in real app this would come from API)
const mockEidRequest = {
  id: "EID-001234",
  entryPoint: "58", // MCH/PMTCT/ANC
  requestedBy: "Dr. Sarah Nakato",
  clinicianTel: "+256700123456",
  infantName: "Baby Nakato",
  expNo: "EXP-001234",
  gender: "FEMALE",
  infantAge: "8",
  ageUnit: "weeks",
  caregiverPhone: "+256700987654",
  givenContrimoxazole: "Y",
  deliveredAtHC: "Y",
  infantPMTCTARVs: "1",
  infantFeeding: "EBF",
  testType: "P",
  pcr: "FIRST",
  nonRoutinePCR: "",
  motherHTSNo: "HTS-123456",
  motherARTNo: "ART-789012",
  motherNIN: "NIN-345678",
  antenatal: "80",
  delivery: "80",
  postnatal: "80",
  status: "Pending Collection",
  createdDate: "2024-01-15",
  lastModified: "2024-01-16"
};

export default function EditEidRequestPage({ params }: EditEidRequestPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form updated for request:", params.requesId);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyle = (status: string) => {
      switch (status) {
        case "Pending Collection":
          return "bg-orange-100 text-orange-800";
        case "Sample Collected":
          return "bg-green-100 text-green-800";
        case "In Transit":
          return "bg-blue-100 text-blue-800";
        case "Completed":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <Badge className={`${getStatusStyle(status)} text-sm`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Edit EID Request
            </h1>
            <StatusBadge status={mockEidRequest.status} />
          </div>
          <p className="text-gray-600">
            Request ID: {params.requesId} • Last modified: {mockEidRequest.lastModified}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/eid/collect-sample">
            <Button variant="outline" className="h-10 px-6">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="eid-edit-form"
            className="bg-blue-600 hover:bg-blue-700 h-10 px-8"
          >
            Update Request
          </Button>
        </div>
      </div>

      <div className="">
        <form id="eid-edit-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Requesting Clinician Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Requesting Clinician
              </h2>
            </div>
            <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="entryPoint"
                  className="text-sm font-medium text-gray-700"
                >
                  Entry Point
                </Label>
                <Select defaultValue={mockEidRequest.entryPoint}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Select entry point" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="53">ART Clinic</SelectItem>
                    <SelectItem value="54">EID/MBCP</SelectItem>
                    <SelectItem value="55">Lab</SelectItem>
                    <SelectItem value="56">Left Blank</SelectItem>
                    <SelectItem value="57">Maternity</SelectItem>
                    <SelectItem value="58">MCH/PMTCT/ANC</SelectItem>
                    <SelectItem value="59">OPD</SelectItem>
                    <SelectItem value="60">Other</SelectItem>
                    <SelectItem value="61">Outreach</SelectItem>
                    <SelectItem value="62">Peadiatric Ward</SelectItem>
                    <SelectItem value="63">PNC</SelectItem>
                    <SelectItem value="64">Unknown</SelectItem>
                    <SelectItem value="65">YCC/Immunisation</SelectItem>
                    <SelectItem value="83">EPI</SelectItem>
                    <SelectItem value="84">Nutrition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="requestedBy"
                  className="text-sm font-medium text-gray-700"
                >
                  Requested by
                </Label>
                <Input
                  id="requestedBy"
                  placeholder="Enter clinician name"
                  defaultValue={mockEidRequest.requestedBy}
                  className="mt-2 h-10"
                />
              </div>
              <div>
                <Label
                  htmlFor="clinicianTel"
                  className="text-sm font-medium text-gray-700"
                >
                  Tel No
                </Label>
                <Input
                  id="clinicianTel"
                  placeholder="Enter phone number"
                  defaultValue={mockEidRequest.clinicianTel}
                  className="mt-2 h-10"
                />
              </div>
            </div>
          </div>

          {/* Patient Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Patient Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="infantName"
                  className="text-sm font-medium text-gray-700"
                >
                  Infant Name
                </Label>
                <Input
                  id="infantName"
                  placeholder="Enter infant name"
                  defaultValue={mockEidRequest.infantName}
                  className="mt-2 h-10"
                />
              </div>
              <div>
                <Label
                  htmlFor="expNo"
                  className="text-sm font-medium text-gray-700"
                >
                  EXP No
                </Label>
                <Input
                  id="expNo"
                  placeholder="Enter exposure number"
                  defaultValue={mockEidRequest.expNo}
                  className="mt-2 h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="gender"
                  className="text-sm font-medium text-gray-700"
                >
                  Sex
                </Label>
                <Select defaultValue={mockEidRequest.gender}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">M</SelectItem>
                    <SelectItem value="FEMALE">F</SelectItem>
                    <SelectItem value="NOT_RECORDED">Blank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="caregiverPhone"
                  className="text-sm font-medium text-gray-700"
                >
                  Care Giver Phone Number
                </Label>
                <Input
                  id="caregiverPhone"
                  placeholder="Enter phone number"
                  defaultValue={mockEidRequest.caregiverPhone}
                  className="mt-2 h-10 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label
                  htmlFor="infantAge"
                  className="text-sm font-medium text-gray-700"
                >
                  Age in Months
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="infantAge"
                    placeholder="Enter age"
                    defaultValue={mockEidRequest.infantAge}
                    className="flex-1 h-10"
                  />
                  <Select defaultValue={mockEidRequest.ageUnit}>
                    <SelectTrigger className="w-28 h-10">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="givenContrimoxazole"
                  className="text-sm font-medium text-gray-700"
                >
                  Given Contrimoxazole
                </Label>
                <Select defaultValue={mockEidRequest.givenContrimoxazole}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLANK">Blank</SelectItem>
                    <SelectItem value="Y">Y</SelectItem>
                    <SelectItem value="N">N</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="deliveredAtHC"
                  className="text-sm font-medium text-gray-700"
                >
                  Delivered at H/C
                </Label>
                <Select defaultValue={mockEidRequest.deliveredAtHC}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLANK">UNKNOWN</SelectItem>
                    <SelectItem value="Y">Y</SelectItem>
                    <SelectItem value="N">N</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="infantPMTCTARVs"
                  className="text-sm font-medium text-gray-700"
                >
                  Infant PMTCT ARVS
                </Label>
                <Select defaultValue={mockEidRequest.infantPMTCTARVs}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select ARV regimen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      1-Received NVP syrup at birth for 6 weeks
                    </SelectItem>
                    <SelectItem value="2">
                      2-Received NVP syrup at birth for 12 weeks
                    </SelectItem>
                    <SelectItem value="3">3-AZT/3TC/NVP</SelectItem>
                    <SelectItem value="4">4-No ARVs taken</SelectItem>
                    <SelectItem value="5">
                      5-Unknown-Infant PMTCT regimen not known
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Other Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Other Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="infantFeeding"
                  className="text-sm font-medium text-gray-700"
                >
                  Infant Feeding
                </Label>
                <Select defaultValue={mockEidRequest.infantFeeding}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select feeding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EBF">
                      Exclusive Breast Feeding
                    </SelectItem>
                    <SelectItem value="MF">
                      Mixed Feeding (below 6 months)
                    </SelectItem>
                    <SelectItem value="W">Wean from breastfeeding</SelectItem>
                    <SelectItem value="RF">
                      Replacement Feeding (never breastfed)
                    </SelectItem>
                    <SelectItem value="CF">
                      Complimentary Feeding (above 6 months)
                    </SelectItem>
                    <SelectItem value="NLB">No longer Breastfeeding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="testType"
                  className="text-sm font-medium text-gray-700"
                >
                  Type of Test
                </Label>
                <Select defaultValue={mockEidRequest.testType}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P">PCR</SelectItem>
                    <SelectItem value="S">SCD</SelectItem>
                    <SelectItem value="B">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="pcr"
                  className="text-sm font-medium text-gray-700"
                >
                  PCR
                </Label>
                <Select defaultValue={mockEidRequest.pcr}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select PCR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNKNOWN">Blank</SelectItem>
                    <SelectItem value="FIRST">1st</SelectItem>
                    <SelectItem value="SECOND">2nd</SelectItem>
                    <SelectItem value="THIRD">3rd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="nonRoutinePCR"
                  className="text-sm font-medium text-gray-700"
                >
                  Non Routine PCR
                </Label>
                <Select defaultValue={mockEidRequest.nonRoutinePCR}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R1">R1</SelectItem>
                    <SelectItem value="R2">R2</SelectItem>
                    <SelectItem value="R3">R3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mother's Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="motherHTSNo"
                  className="text-sm font-medium text-gray-700"
                >
                  Mothers HTS No
                </Label>
                <Input
                  id="motherHTSNo"
                  placeholder="Enter HTS number"
                  defaultValue={mockEidRequest.motherHTSNo}
                  className="mt-2 h-10 w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="motherARTNo"
                  className="text-sm font-medium text-gray-700"
                >
                  ART No
                </Label>
                <Input
                  id="motherARTNo"
                  placeholder="Enter ART number"
                  defaultValue={mockEidRequest.motherARTNo}
                  className="mt-2 h-10 w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="motherNIN"
                  className="text-sm font-medium text-gray-700"
                >
                  NIN
                </Label>
                <Input
                  id="motherNIN"
                  placeholder="Enter NIN"
                  defaultValue={mockEidRequest.motherNIN}
                  className="mt-2 h-10 w-full"
                />
              </div>
            </div>

            {/* Mother's Treatment History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="antenatal"
                  className="text-sm font-medium text-gray-700"
                >
                  Antenatal
                </Label>
                <Select defaultValue={mockEidRequest.antenatal}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80">1:Lifelong ART</SelectItem>
                    <SelectItem value="81">2:No ART</SelectItem>
                    <SelectItem value="82">3:Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="delivery"
                  className="text-sm font-medium text-gray-700"
                >
                  Delivery
                </Label>
                <Select defaultValue={mockEidRequest.delivery}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80">1:Lifelong ART</SelectItem>
                    <SelectItem value="81">2:No ART</SelectItem>
                    <SelectItem value="82">3:Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="postnatal"
                  className="text-sm font-medium text-gray-700"
                >
                  Postnatal
                </Label>
                <Select defaultValue={mockEidRequest.postnatal}>
                  <SelectTrigger className="mt-2 h-10 w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80">1:Lifelong ART</SelectItem>
                    <SelectItem value="81">2:No ART</SelectItem>
                    <SelectItem value="82">3:Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bottom Submit Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Created: {mockEidRequest.createdDate} • Last modified: {mockEidRequest.lastModified}
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/eid/collect-sample">
                  <Button variant="outline" className="h-10 px-6">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 h-10 px-8"
                >
                  Update Request
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
