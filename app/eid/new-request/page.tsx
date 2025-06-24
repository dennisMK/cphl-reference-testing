"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconBabyCarriage, IconArrowLeft } from "@tabler/icons-react";

export default function NewEIDRequest(): React.JSX.Element {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50/30 py-4 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <IconBabyCarriage className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">New EID Request</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">Create a new Early Infant Diagnosis request</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Badge variant="secondary" className="border-0 bg-blue-50 text-blue-700 font-medium px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
              Step 1 of 3
            </Badge>
            <span className="text-gray-500 font-medium text-sm sm:text-base">Request Creation</span>
          </div>
        </div>

        {/* Coming Soon Content */}
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <IconBabyCarriage className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">EID Request Form Coming Soon</h3>
            <p className="text-gray-600 mb-6 text-lg max-w-2xl mx-auto">
              The Early Infant Diagnosis request form is currently under development. This comprehensive form will allow you to register infants for HIV testing and track their care journey.
            </p>
            
            <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-3">Planned Features:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Mother and infant registration</li>
                <li>• Birth information and feeding status</li>
                <li>• Age-appropriate testing schedule</li>
                <li>• Risk assessment and care planning</li>
                <li>• Integration with viral load tracking</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => router.back()}
                variant="outline" 
                className="flex items-center space-x-2"
              >
                <IconArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Button>
              <Button 
                onClick={() => router.push("/eid")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View EID Dashboard
              </Button>
            </div>

            <div className="mt-8">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2">
                Expected Release: Next Update
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">What is EID?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Early Infant Diagnosis (EID) is the process of HIV testing in infants and children younger than 18 months born to HIV-positive mothers. It's crucial for early detection and treatment.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Testing Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Standard EID testing occurs at 6 weeks, 14 weeks, 6 months, 12 months, and 18 months of age, with additional testing as clinically indicated.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 