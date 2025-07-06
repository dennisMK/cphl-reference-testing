"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Baby, Edit, TestTube, Calendar, User, MapPin, Phone, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { format } from "date-fns";

const getStatusBadge = (request: any) => {
  if (!request.date_dbs_taken) {
    return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending Collection</Badge>;
  } else if (request.date_dbs_taken && !request.date_rcvd_by_cphl) {
    return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Collected</Badge>;
  } else if (request.date_rcvd_by_cphl && request.testing_completed !== "YES") {
    return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Processing</Badge>;
  } else if (request.testing_completed === "YES") {
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
  }
  return <Badge variant="outline">Unknown</Badge>;
};

const getPriorityBadge = (pcr: string) => {
  switch (pcr) {
    case "FIRST":
      return <Badge variant="default" className="bg-green-600">First PCR</Badge>;
    case "SECOND":
      return <Badge variant="default" className="bg-yellow-600">Second PCR</Badge>;
    case "THIRD":
      return <Badge variant="default" className="bg-red-600">Third PCR</Badge>;
    case "NON_ROUTINE":
      return <Badge variant="default" className="bg-purple-600">Non-Routine</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const formatAge = (age: string | null, units: string | null) => {
  if (!age) return "Not specified";
  return `${age} ${units || ""}`.trim();
};

export default function EIDDetailsPage() {
  const params = useParams();
  const requestId = parseInt(params.id as string);

  // Fetch the EID request details
  const { data: request, isLoading, error } = api.eid.getRequest.useQuery(
    { id: requestId },
    { enabled: !!requestId }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">EID Request Not Found</h1>
          <p className="text-gray-600 mb-6">
            The EID request you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/eid">
            <Button>Back to EID</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/eid">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to EID</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Baby className="h-8 w-8 text-blue-600" />
                <span>EID Request Details</span>
              </h1>
              <p className="text-gray-600 mt-1">
                EID-{String(requestId).padStart(6, "0")} • {request.infant_name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(request)}
            <Link href={`/eid/${requestId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            {!request.date_dbs_taken && (
              <Link href={`/eid/${requestId}/collect`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  <TestTube className="mr-2 h-4 w-4" />
                  Collect Sample
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infant Information */}
          <Card>
            <CardHeader className="bg-blue-600 text-white rounded-t-xl p-4 mb-0">
              <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                <Baby className="h-5 w-5" />
                <span>Infant Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Infant Name</label>
                    <p className="text-lg font-semibold text-gray-900">{request.infant_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900">{request.infant_gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900">{formatAge(request.infant_age, request.infant_age_units)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">EXP Number</label>
                    <p className="text-gray-900">{request.infant_exp_id || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">
                      {request.infant_dob ? format(new Date(request.infant_dob), "PPP") : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Breastfeeding</label>
                    <p className="text-gray-900">{request.infant_is_breast_feeding}</p>
                  </div>
                </div>
              </div>
              {request.infant_contact_phone && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-500">Contact Phone:</span>
                    <span className="text-gray-900">{request.infant_contact_phone}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mother Information */}
          <Card>
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-lg font-semibold text-pink-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Mother Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">HTS Number</label>
                    <p className="text-gray-900">{request.mother_htsnr || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ART Number</label>
                    <p className="text-gray-900">{request.mother_artnr || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">NIN</label>
                    <p className="text-gray-900">{request.mother_nin || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Information */}
          <Card>
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-lg font-semibold text-purple-900 flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                Test Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">PCR Type</label>
                    <div className="mt-1">{getPriorityBadge(request.pcr)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Test Type</label>
                    <p className="text-gray-900">{request.test_type || "Standard EID"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">PCR Test Requested</label>
                    <p className="text-gray-900">{request.PCR_test_requested}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">SCD Test Requested</label>
                    <p className="text-gray-900">{request.SCD_test_requested}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Request Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Status</span>
                  {getStatusBadge(request)}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${request.created_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="text-sm font-medium">Request Created</p>
                      {request.created_at && (
                        <p className="text-xs text-gray-500">
                          {format(new Date(request.created_at), "PPP 'at' pp")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${request.date_dbs_taken ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="text-sm font-medium">Sample Collected</p>
                      {request.date_dbs_taken && (
                        <p className="text-xs text-gray-500">
                          {format(new Date(request.date_dbs_taken), "PPP")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${request.date_rcvd_by_cphl ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="text-sm font-medium">Received at Lab</p>
                      {request.date_rcvd_by_cphl && (
                        <p className="text-xs text-gray-500">
                          {format(new Date(request.date_rcvd_by_cphl), "PPP")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${request.testing_completed === "YES" ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="text-sm font-medium">Testing Completed</p>
                      {request.testing_completed === "YES" && (
                        <p className="text-xs text-gray-500">Completed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facility Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Facility Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Facility Name</label>
                  <p className="text-gray-900">{request.facility_name || "Not specified"}</p>
                </div>
                {/* <div>
                  <label className="text-sm font-medium text-gray-500">District</label>
                  <p className="text-gray-900">{request.facility_district || "Not specified"}</p>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Link href={`/eid/${requestId}/edit`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Request
                  </Button>
                </Link>
                {!request.date_dbs_taken && (
                  <Link href={`/eid/${requestId}/collect`} className="block">
                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                      <TestTube className="mr-2 h-4 w-4" />
                      Collect Sample
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    navigator.clipboard.writeText(`EID-${String(requestId).padStart(6, "0")}`)
                  }
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Copy Request ID
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 