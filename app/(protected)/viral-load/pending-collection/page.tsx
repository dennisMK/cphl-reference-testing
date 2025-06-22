"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Search, TestTube, MoreVertical, Eye, Edit, Trash2, Plus, ClipboardCheck, MapPin, User, Phone, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// Mock data - in real app, this would come from an API
const mockRequests = [
  {
    id: "VL-001456",
    patientId: "P001234",
    patientName: "Jane Doe",
    age: "34 years",
    gender: "Female",
    facility: "Butabika Hospital",
    clinician: "Dr. Sarah Kato",
    clinicianPhone: "+256 700 123 456",
    requestDate: new Date(2024, 11, 15),
    indication: "Routine monitoring (6 months)",
    regimen: "TDF-3TC-DTG",
    status: "pending_collection",
    priority: "routine",
    dateCreated: new Date(2024, 11, 15),
    district: "Kampala",
    hub: "Kampala Hub"
  },
  {
    id: "VL-001457",
    patientId: "P001235",
    patientName: "John Mukasa",
    age: "28 years",
    gender: "Male",
    facility: "Butabika Hospital",
    clinician: "Dr. Michael Owens",
    clinicianPhone: "+256 700 987 654",
    requestDate: new Date(2024, 11, 14),
    indication: "Suspected treatment failure",
    regimen: "AZT-3TC-EFV",
    status: "pending_collection",
    priority: "urgent",
    dateCreated: new Date(2024, 11, 14),
    district: "Kampala",
    hub: "Kampala Hub"
  },
  {
    id: "VL-001458",
    patientId: "P001236",
    patientName: "Mary Nakato",
    age: "42 years",
    gender: "Female",
    facility: "Butabika Hospital",
    clinician: "Dr. Sarah Kato",
    clinicianPhone: "+256 700 123 456",
    requestDate: new Date(2024, 11, 13),
    indication: "Drug change/switch",
    regimen: "ABC-3TC-DTG",
    status: "pending_collection",
    priority: "routine",
    dateCreated: new Date(2024, 11, 13),
    district: "Kampala",
    hub: "Kampala Hub"
  }
];

export default function PendingCollectionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [requests, setRequests] = useState(mockRequests);

  const filteredRequests = requests.filter(request =>
    request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.clinician.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
    setDeleteDialogOpen(false);
    setRequestToDelete(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "routine":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_collection":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "collected":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-500 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pending Sample Collection</h1>
              <p className="text-gray-600 mt-1">Manage viral load requests awaiting specimen collection</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
              Step 2 of 3
            </Badge>
            <span className="text-sm text-gray-500">Sample Collection</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pending</p>
                  <p className="text-2xl font-bold text-red-600">{filteredRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Requests</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredRequests.filter(r => 
                      format(r.dateCreated, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TestTube className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Urgent Priority</p>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredRequests.filter(r => r.priority === 'urgent').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Patients</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Set(filteredRequests.map(r => r.patientId)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="border-red-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, ID, or clinician..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <Link href="/viral-load/new-request">
                <Button className="bg-red-600 text-white hover:bg-red-700 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="border-red-200 shadow-sm">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="text-red-800">Pending Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <TestTube className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? "No requests match your search criteria." : "All sample collections are up to date."}
                </p>
                {!searchTerm && (
                  <Link href="/viral-load/new-request">
                    <Button className="bg-red-600 text-white hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Request
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Request ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Patient</TableHead>
                      <TableHead className="font-semibold text-gray-700">Clinician</TableHead>
                      <TableHead className="font-semibold text-gray-700">Facility</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date Requested</TableHead>
                      <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50 border-b">
                        <TableCell>
                          <div className="font-medium text-red-600">{request.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{request.patientName}</div>
                            <div className="text-sm text-gray-500">
                              {request.patientId} • {request.age} • {request.gender}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{request.clinician}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {request.clinicianPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{request.facility}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {request.district}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {format(request.requestDate, "MMM dd, yyyy")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(request.requestDate, "h:mm a")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(request.priority)}
                          >
                            {request.priority === 'urgent' ? 'Urgent' : 'Routine'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(request.status)}
                          >
                            Pending Collection
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link href={`/viral-load/collect-sample?id=${request.id}`}>
                              <Button size="sm" className="bg-red-600 text-white hover:bg-red-700">
                                <TestTube className="h-3 w-3 mr-1" />
                                Collect
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem asChild>
                                  <Link 
                                    href={`/viral-load/view?id=${request.id}`}
                                    className="flex items-center w-full"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link 
                                    href={`/viral-load/edit?id=${request.id}`}
                                    className="flex items-center w-full"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Request
                                  </Link>
                                </DropdownMenuItem>
                                <Separator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setRequestToDelete(request.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Request
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <span>Delete Request</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this viral load request? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => requestToDelete && handleDelete(requestToDelete)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 