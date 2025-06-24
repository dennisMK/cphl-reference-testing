"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package, CheckCircle, ArrowUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

// Mock data for samples pending packaging
const pendingSamples = [
  {
    id: "VL001",
    artNumber: "IDC 24-00036",
    sampleId: "2414571241",
    sampleType: "Plasma",
    dateCollected: "2025-06-23",
    facility: "Mulago Hospital",
    status: "collected"
  },
  {
    id: "VL002",
    artNumber: "18-00297",
    sampleId: "2414571239",
    sampleType: "Plasma", 
    dateCollected: "2025-06-20",
    facility: "Butabika Hospital",
    status: "collected"
  },
  {
    id: "VL003",
    artNumber: "IDC 21-00138",
    sampleId: "2414571240",
    sampleType: "Plasma",
    dateCollected: "2025-06-20",
    facility: "Kiruddu Hospital", 
    status: "collected"
  },
  {
    id: "VL004",
    artNumber: "IDC 16-00190",
    sampleId: "2414571238",
    sampleType: "Plasma",
    dateCollected: "2025-06-19",
    facility: "Nakasero Hospital",
    status: "collected"
  },
  {
    id: "VL005",
    artNumber: "IDC 18-00306",
    sampleId: "2414571237", 
    sampleType: "Plasma",
    dateCollected: "2025-06-19",
    facility: "Mulago Hospital",
    status: "collected"
  },
  {
    id: "VL006",
    artNumber: "IDC 19-00275",
    sampleId: "2414571235",
    sampleType: "Plasma",
    dateCollected: "2025-06-19",
    facility: "Butabika Hospital",
    status: "collected"
  },
  {
    id: "VL007", 
    artNumber: "IDC 24-00183",
    sampleId: "2414571236",
    sampleType: "Plasma",
    dateCollected: "2025-06-19",
    facility: "Kiruddu Hospital",
    status: "collected"
  }
]

export default function PackageSamplesPage() {
  const router = useRouter()
  const [packageIdentifier, setPackageIdentifier] = React.useState("")
  const [selectedSamples, setSelectedSamples] = React.useState<string[]>([])
  const [pageSize, setPageSize] = React.useState(50)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Calculate pagination
  const totalPages = Math.ceil(pendingSamples.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentSamples = pendingSamples.slice(startIndex, endIndex)

  const handleSelectAll = () => {
    if (selectedSamples.length === currentSamples.length) {
      setSelectedSamples([])
    } else {
      setSelectedSamples(currentSamples.map(sample => sample.id))
    }
  }

  const handleSelectSample = (sampleId: string) => {
    setSelectedSamples(prev => 
      prev.includes(sampleId) 
        ? prev.filter(id => id !== sampleId)
        : [...prev, sampleId]
    )
  }

  const handleSubmit = async () => {
    if (!packageIdentifier.trim()) {
      toast.error("Please enter a package identifier")
      return
    }

    if (selectedSamples.length === 0) {
      toast.error("Please select at least one sample to package")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast.success(`Successfully packaged ${selectedSamples.length} samples with identifier: ${packageIdentifier}`)
    
    // Reset form
    setPackageIdentifier("")
    setSelectedSamples([])
    setIsSubmitting(false)
  }

  return (
    <div className="">
      {/* Header with title and actions */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Package Samples
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Group collected samples for packaging and shipment
            </p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Link href="/viral-load" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-6 text-sm">
                Back to Viral Load
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Package Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 mb-6">
        <div className="pb-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Package Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="package-identifier" className="text-sm font-medium text-gray-700">
              Package Identifier *
            </Label>
            <Input
              id="package-identifier"
              value={packageIdentifier}
              onChange={(e) => setPackageIdentifier(e.target.value)}
              placeholder="Enter package identifier (e.g., PKG-2025-001)"
              className="mt-2 h-10"
              required
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Selected Samples
            </Label>
            <div className="mt-2 h-10 flex items-center">
              <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                {selectedSamples.length} sample{selectedSamples.length !== 1 ? 's' : ''} selected
              </Badge>
            </div>
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedSamples.length === 0 || !packageIdentifier.trim()}
              className="bg-red-600 hover:bg-red-700 h-10 px-8 w-full"
            >
              {isSubmitting ? "Packaging..." : "Submit Package"}
            </Button>
          </div>
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Samples Pending Packaging
          </h2>
        </div>

        {/* Table Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium text-gray-700">Show</Label>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <Label className="text-sm font-medium text-gray-700">rows</Label>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSamples.length === currentSamples.length && currentSamples.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all samples"
                  />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-8 px-2">
                    Art Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-8 px-2">
                    Sample Id
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Sample Type</TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-8 px-2">
                    Date Collected
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSamples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSamples.includes(sample.id)}
                      onCheckedChange={() => handleSelectSample(sample.id)}
                      aria-label={`Select sample ${sample.sampleId}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{sample.artNumber}</TableCell>
                  <TableCell className="font-mono text-sm">{sample.sampleId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {sample.sampleType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(sample.dateCollected).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{sample.facility}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Collected
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            {startIndex + 1} to {Math.min(endIndex, pendingSamples.length)} of {pendingSamples.length}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-blue-600 bg-blue-50">
              {selectedSamples.length} sample{selectedSamples.length !== 1 ? 's' : ''} selected
            </Badge>
            <div className="text-sm text-gray-600">
              Ready to package {selectedSamples.length} selected sample{selectedSamples.length !== 1 ? 's' : ''}
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedSamples.length === 0 || !packageIdentifier.trim()}
            className="bg-red-600 hover:bg-red-700 h-10 px-8"
          >
            {isSubmitting ? "Packaging..." : "Submit Package"}
          </Button>
        </div>
      </div>
    </div>
  )
}
