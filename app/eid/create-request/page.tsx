"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { IconBabyCarriage, IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

export default function CreateRequestPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/eid">
            <Button variant="ghost" size="sm" className="p-2">
              <IconArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500">
              <IconBabyCarriage className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create EID Request</h1>
              <p className="text-gray-600">Early Infant Diagnosis test request</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Facility Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Facility Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="facilityName">Facility Name</Label>
                <Input id="facilityName" placeholder="Enter facility name" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="facilityCode">Facility Code</Label>
                <Input id="facilityCode" placeholder="Enter facility code" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input id="district" placeholder="Enter district" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="eastern">Eastern</SelectItem>
                    <SelectItem value="northern">Northern</SelectItem>
                    <SelectItem value="western">Western</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Infant Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Infant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="infantId">Infant ID</Label>
                <Input id="infantId" placeholder="Enter infant ID" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="infantName">Infant Name</Label>
                <Input id="infantName" placeholder="Enter infant name" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" placeholder="Enter weight" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="feeding">Feeding Method</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select feeding method" />
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

          {/* Mother Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Mother Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input id="motherName" placeholder="Enter mother's name" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="motherAge">Mother's Age</Label>
                <Input id="motherAge" placeholder="Enter mother's age" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="motherArtStatus">Mother's ART Status</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select ART status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-art">On ART</SelectItem>
                    <SelectItem value="not-on-art">Not on ART</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="motherVlStatus">Mother's Viral Load Status</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select VL status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suppressed">Suppressed</SelectItem>
                    <SelectItem value="not-suppressed">Not Suppressed</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Test Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Test Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="testType">Test Type</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Initial Test (6 weeks)</SelectItem>
                    <SelectItem value="confirmatory">Confirmatory Test (14-18 months)</SelectItem>
                    <SelectItem value="follow-up">Follow-up Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sampleType">Sample Type</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select sample type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dbs">DBS (Dried Blood Spot)</SelectItem>
                    <SelectItem value="plasma">Plasma</SelectItem>
                    <SelectItem value="whole-blood">Whole Blood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="stat">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="requestDate">Request Date</Label>
                <Input id="requestDate" type="date" className="mt-2" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="space-y-4">
            <Label htmlFor="clinicalNotes">Clinical Notes</Label>
            <Textarea 
              id="clinicalNotes" 
              placeholder="Enter any additional clinical information..."
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Link href="/eid">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create EID Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 