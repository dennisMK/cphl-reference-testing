"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconArrowLeft, IconFileText, IconBabyCarriage } from "@tabler/icons-react";
import { CheckCircle, XCircle, AlertTriangle, Calendar } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";

const getResultBadge = (result: string | null) => {
  switch (result) {
    case "POSITIVE":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Positive</Badge>;
    case "NEGATIVE":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Negative</Badge>;
    case "INVALID":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Invalid</Badge>;
    case "SAMPLE_WAS_REJECTED":
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getSCDResultBadge = (result: string | null) => {
  switch (result) {
    case "NORMAL":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Normal</Badge>;
    case "VARIANT":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Variant</Badge>;
    case "CARRIER":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Carrier</Badge>;
    case "SICKLER":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Sickler</Badge>;
    case "FAILED":
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Failed</Badge>;
    case "SAMPLE_WAS_REJECTED":
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">-</Badge>;
  }
};

const formatAge = (age: string | null, units: string | null) => {
  if (!age) return "Unknown";
  return units ? `${age} ${units}` : age;
};

export default function EIDResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch results using tRPC
  const { data: resultsData, isLoading, error, refetch } = api.eid.getResults.useQuery({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  });

  const results = resultsData?.samples || [];
  const totalCount = resultsData?.total || 0;

  // Filter results based on search term
  const filteredResults = results.filter(
    (result) =>
      result.infant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.mother_htsnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.mother_artnr?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading EID results</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link href="/eid">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <IconArrowLeft className="h-4 w-4" />
                <span>Back to EID</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <IconFileText className="h-8 w-8 text-blue-600" />
                <span>EID Test Results</span>
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage Early Infant Diagnosis test results
              </p>
            </div>
          </div>
          <Link href="/eid/new-request">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <IconBabyCarriage className="mr-2 h-4 w-4" />
              New EID Request
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Results</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-green-600">{totalCount}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Positive Results</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-red-600">
                      {results.filter(r => r.accepted_result === "POSITIVE").length}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Negative Results</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-green-600">
                      {results.filter(r => r.accepted_result === "NEGATIVE").length}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Invalid/Rejected</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-yellow-600">
                      {results.filter(r => r.accepted_result === "INVALID" || r.accepted_result === "SAMPLE_WAS_REJECTED").length}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <Input
          placeholder="Search by infant name, mother's HTS number, or ART number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>EID Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Infant Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Mother's Info</TableHead>
                  <TableHead>PCR Type</TableHead>
                  <TableHead>PCR Result</TableHead>
                  <TableHead>SCD Result</TableHead>
                  <TableHead>Test Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading EID results...
                    </TableCell>
                  </TableRow>
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div className="font-mono text-sm font-medium text-blue-600">
                          EID-{String(result.id).padStart(6, '0')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{result.infant_name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatAge(result.infant_age, "Unknown")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {result.mother_htsnr && (
                            <div>HTS: {result.mother_htsnr}</div>
                          )}
                          {result.mother_artnr && (
                            <div>ART: {result.mother_artnr}</div>
                          )}
                          {!result.mother_htsnr && !result.mother_artnr && (
                            <div className="text-gray-500">No info</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.pcr}</Badge>
                      </TableCell>
                      <TableCell>
                        {getResultBadge(result.accepted_result)}
                      </TableCell>
                      <TableCell>
                        {getSCDResultBadge(result.SCD_test_result)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {result.date_dbs_tested 
                              ? new Date(result.date_dbs_tested).toLocaleDateString()
                              : "Not recorded"
                            }
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {searchTerm ? "No results found matching your search." : "No EID results available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalCount > pagination.pageSize && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                disabled={pagination.pageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                disabled={(pagination.pageIndex + 1) * pagination.pageSize >= totalCount}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 