"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { IconBabyCarriage, IconArrowLeft, IconTestPipe, IconCheck } from '@tabler/icons-react'
import Link from 'next/link'

// Mock data for the EID request (in real app this would come from params.id)
const mockEidRequest = {
  id: "EID-001234",
  facilityName: "Mulago Hospital",
  facilityCode: "MUL001",
  district: "Kampala", 
  region: "central",
  infantId: "INF-001234",
  infantName: "Baby Nakato",
  dateOfBirth: "2023-11-20",
  gender: "female",
  weight: "4.2",
  feeding: "breastfeeding",
  motherName: "Sarah Nakato",
  motherAge: "28",
  motherArtStatus: "on-art",
  motherVlStatus: "suppressed",
  testType: "initial",
  sampleType: "dbs",
  priority: "routine",
  requestDate: "2024-01-15",
  clinicalNotes: "First test for this infant. Mother has been on ART for 2 years.",
  status: "Pending Collection",
  age: "8 weeks"
}

interface User {
  id: number;
  username: string;
  name: string;
  email: string | null;
  facility_id: number | null;
  facility_name: string | null;
  hub_id: number | null;
  hub_name: string | null;
}

interface EditEidRequestPageProps {
  params: {
    id: string
  }
}

export default function EditEidRequestPage({ params }: EditEidRequestPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isCollecting, setIsCollecting] = useState(false)
  const [collectionData, setCollectionData] = useState({
    sampleCollected: false,
    collectionDate: "",
    collectedBy: "",
    sampleQuality: "",
    volumeCollected: "",
    collectionNotes: ""
  })

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted')
  }

  const handleSampleCollection = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Sample collection submitted', collectionData)
    // Update status to "Sample Collected" or similar
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyle = (status: string) => {
      switch (status) {
        case "Pending Collection":
          return "bg-orange-100 text-orange-800"
        case "Sample Collected":
          return "bg-green-100 text-green-800"
        case "In Transit":
          return "bg-blue-100 text-blue-800"
        case "Completed":
          return "bg-green-100 text-green-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    return (
      <Badge className={`${getStatusStyle(status)} text-sm`}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-blue-500 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/eid" 
              className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
            >
              <IconArrowLeft size={20} />
              <span>Back to EID</span>
            </Link>
            <div className="h-6 w-px bg-blue-300 hidden sm:block"></div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <IconBabyCarriage size={24} />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold">Edit EID Request</h1>
                <p className="text-blue-100 text-sm">Update request details for {mockEidRequest.id}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {mockEidRequest.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-8">
          {/* Request Details Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Facility Information - Display Only */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Facility Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Facility Name</Label>
                    <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                      {user?.facility_name || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">District</Label>
                    <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                      {user?.hub_name ? user.hub_name.split(' ')[0] : "Not specified"}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Hub</Label>
                    <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                      {user?.hub_name || "Not specified"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Infant Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Infant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="infantId">Infant ID</Label>
                    <Input id="infantId" defaultValue={mockEidRequest.infantId} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="infantName">Infant Name</Label>
                    <Input id="infantName" defaultValue={mockEidRequest.infantName} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" defaultValue={mockEidRequest.dateOfBirth} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select defaultValue={mockEidRequest.gender}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" defaultValue={mockEidRequest.weight} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="feeding">Feeding Method</Label>
                    <Select defaultValue={mockEidRequest.feeding}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breastfeeding">Breastfeeding</SelectItem>
                        <SelectItem value="formula">Formula</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="space-y-4">
                <Label htmlFor="clinicalNotes">Clinical Notes</Label>
                <Textarea 
                  id="clinicalNotes" 
                  defaultValue={mockEidRequest.clinicalNotes}
                  className="min-h-[100px]"
                />
              </div>

              {/* Update Button */}
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Update Request
                </Button>
              </div>
            </form>
          </div>

          {/* Sample Collection Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500">
                <IconTestPipe className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Sample Collection</h2>
            </div>

            <form onSubmit={handleSampleCollection} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="collectionDate">Collection Date</Label>
                  <Input 
                    id="collectionDate" 
                    type="date" 
                    value={collectionData.collectionDate}
                    onChange={(e) => setCollectionData({...collectionData, collectionDate: e.target.value})}
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="collectedBy">Collected By</Label>
                  <Input 
                    id="collectedBy" 
                    placeholder="Enter collector name"
                    value={collectionData.collectedBy}
                    onChange={(e) => setCollectionData({...collectionData, collectedBy: e.target.value})}
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="sampleQuality">Sample Quality</Label>
                  <Select 
                    value={collectionData.sampleQuality} 
                    onValueChange={(value) => setCollectionData({...collectionData, sampleQuality: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="volumeCollected">Volume Collected (μL)</Label>
                  <Input 
                    id="volumeCollected" 
                    placeholder="Enter volume"
                    value={collectionData.volumeCollected}
                    onChange={(e) => setCollectionData({...collectionData, volumeCollected: e.target.value})}
                    className="mt-2" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="collectionNotes">Collection Notes</Label>
                <Textarea 
                  id="collectionNotes" 
                  placeholder="Enter any collection notes..."
                  value={collectionData.collectionNotes}
                  onChange={(e) => setCollectionData({...collectionData, collectionNotes: e.target.value})}
                  className="mt-2 min-h-[80px]"
                />
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!collectionData.collectionDate || !collectionData.collectedBy}
                >
                  <IconCheck className="h-4 w-4 mr-2" />
                  Mark as Collected
                </Button>
                <span className="text-sm text-gray-500">
                  This will update the request status to "Sample Collected"
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 