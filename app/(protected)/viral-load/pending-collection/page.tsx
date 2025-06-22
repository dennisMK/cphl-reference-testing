"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Eye, Edit, Trash2, Plus, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";

interface PendingRequest {
  id: string;
  patientId: string;
  clinicianName: string;
  facility: string;
  requestDate: string;
  status: 'pending' | 'collected' | 'packaged';
  gender: string;
  age: number;
  indication: string;
}

// Mock data
const mockRequests: PendingRequest[] = [
  {
    id: "VL-001456",
    patientId: "95/24",
    clinicianName: "Dr. Rita Zemeyi",
    facility: "Butabika Hospital",
    requestDate: "2025-06-17",
    status: "pending",
    gender: "Male",
    age: 36,
    indication: "Routine monitoring"
  },
  {
    id: "VL-001457",
    patientId: "96/24",
    clinicianName: "Dr. John Mugisha",
    facility: "Mulago Hospital",
    requestDate: "2025-06-16",
    status: "pending",
    gender: "Female",
    age: 28,
    indication: "Post treatment initiation"
  },
  {
    id: "VL-001458",
    patientId: "97/24",
    clinicianName: "Dr. Sarah Nambi",
    facility: "Mbarara Hospital",
    requestDate: "2025-06-15",
    status: "collected",
    gender: "Male",
    age: 42,
    indication: "Adherence concern"
  }
];

export default function PendingCollectionPage() {
  const { getColorsForType } = useTheme();
  const colors = getColorsForType('viral-load');
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState(mockRequests);

  const filteredRequests = requests.filter(request =>
    request.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.clinicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.facility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'collected':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Collected</Badge>;
      case 'packaged':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Packaged</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/viral-load">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pending Sample Collection</h1>
            <p className="text-gray-600">Manage and collect samples for requests</p>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by Patient ID, Clinician, or Facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-base"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-lg font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-lg font-bold text-blue-600">{requests.filter(r => r.status === 'collected').length}</div>
            <div className="text-sm text-gray-500">Collected</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-lg font-bold text-gray-600">{filteredRequests.length}</div>
            <div className="text-sm text-gray-500">Showing</div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{request.id}</h3>
                  <p className="text-sm text-gray-600">Patient ID: {request.patientId}</p>
                </div>
                {getStatusBadge(request.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{request.clinicianName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{request.requestDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{request.gender}, {request.age} years</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{request.facility}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Indication:</span> {request.indication}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Link href={`/viral-load/collect-sample?id=${request.id}`}>
                  <Button 
                    size="sm" 
                    className="text-white"
                    style={{ backgroundColor: colors.primary }}
                    disabled={request.status !== 'pending'}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Collect Sample
                  </Button>
                </Link>
                
                <Link href={`/viral-load/view?id=${request.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                
                <Link href={`/viral-load/edit?id=${request.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteRequest(request.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No requests found</h3>
                <p className="text-sm">Try adjusting your search terms or create a new request.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link href="/viral-load/new-request">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
} 