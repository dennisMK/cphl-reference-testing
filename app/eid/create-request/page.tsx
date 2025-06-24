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
import { IconBabyCarriage, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function page() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
        <div className="">
      {/* Header with title and actions */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Create EID Request
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Early Infant Diagnosis test request
            </p>
          </div>
         
        </div>
      </div>

       <div className="">
         <form id="eid-form" onSubmit={handleSubmit} className="space-y-8">

           <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Requesting Clinician
              </h2>
            </div>
            <div className="grid grid-cols-1  items-center md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="entryPoint"
                  className="text-sm font-medium text-gray-700"
                >
                  Entry Point
                </Label>
                <Select>
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
                  className="mt-2 h-10"
                />
              </div>
            </div>
          </div>

          {/* Patient Information */}
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
                  <Select>
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
                    className="mt-2 h-10 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1  gap-4">
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
                      className="flex-1 h-10"
                    />
                    <Select>
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
                  <Select>
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
                  <Select>
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
                  <Select>
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

               {/* Other Information */}
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
                <Select>
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
                <Select>
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
                <Select>
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
                <Select>
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
                <Select>
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
                <Select>
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
                <Select>
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
            <div className="flex items-center justify-end space-x-4">
              <Link href="/eid">
                <Button variant="outline" className="h-10 px-6">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 h-10 px-8"
              >
                Save Request
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
