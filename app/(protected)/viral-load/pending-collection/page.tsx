"use client";

import * as React from "react"
import { api } from "@/trpc/react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Edit, Trash2, FileText, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export type ViralLoadSample = {
  id: number
  patientUniqueId: string | null
  vlSampleId: string | null
  formNumber: string | null
  dateCollected: Date | null
  dateReceived: Date | null
  sampleType: string | null
  createdAt: Date
  verified: number | null
  inWorksheet: number | null
}

const getStatusBadge = (sample: ViralLoadSample) => {
  if (!sample.dateReceived) {
    return <Badge variant="secondary" className="text-orange-600 bg-orange-50">Pending Collection</Badge>
  } else if (sample.dateCollected && !sample.dateReceived) {
    return <Badge variant="secondary" className="text-blue-600 bg-blue-50">Collected</Badge>
  } else if (sample.dateReceived && !sample.verified) {
    return <Badge variant="secondary" className="text-purple-600 bg-purple-50">Processing</Badge>
  } else if (sample.verified === 1) {
    return <Badge variant="secondary" className="text-green-600 bg-green-50">Completed</Badge>
  } else {
    return <Badge variant="outline">Unknown</Badge>
  }
}

const getSampleType = (type: string | null) => {
  switch (type) {
    case "P":
      return "Plasma"
    case "D":
      return "Dried Blood Spot"
    case "W":
      return "Whole Blood"
    default:
      return type || "Unknown"
  }
}

export const columns: ColumnDef<ViralLoadSample>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "patientUniqueId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Patient ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("patientUniqueId") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "vlSampleId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Sample ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("vlSampleId") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "sampleType",
    header: "Sample Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {getSampleType(row.getValue("sampleType"))}
      </Badge>
    ),
  },
  {
    accessorKey: "dateCollected",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Date Collected
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("dateCollected") as Date | null
      return <div className="text-sm">{date ? date.toLocaleDateString() : "Not collected"}</div>
    },
  },
  {
    accessorKey: "dateReceived",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Date Received
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("dateReceived") as Date | null
      return (
        <div className="text-sm">
          {date ? date.toLocaleDateString() : "Not received"}
        </div>
      )
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      return getStatusBadge(row.original)
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const sample = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(sample.vlSampleId)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Copy Sample ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={`/viral-load/${sample.vlSampleId}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </a>
            </DropdownMenuItem>
            {!sample.dateCollected && (
              <DropdownMenuItem asChild>
                <a href={`/viral-load/${sample.vlSampleId}/collect`}>
                  <Package className="mr-2 h-4 w-4" />
                  Collect Sample
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <a href={`/viral-load/${sample.vlSampleId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Sample
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Sample
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ViralLoadDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  // Fetch viral load requests from the API
  const { data: requestsData, isLoading, error } = api.viralLoad.getRequests.useQuery({
    limit: 50,
    offset: 0,
  })

  const data = React.useMemo(() => {
    if (!requestsData?.samples) return []
    if (statusFilter === "all") return requestsData.samples
    return requestsData.samples.filter((sample) => {
      if (statusFilter === "pending") return !sample.dateCollected
      if (statusFilter === "collected") return sample.dateCollected && !sample.dateReceived
      if (statusFilter === "processing") return sample.dateReceived && !sample.verified
      if (statusFilter === "completed") return sample.verified === 1
      return true
    })
  }, [requestsData?.samples, statusFilter])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filter by Sample ID..."
            value={(table.getColumn("vlSampleId")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("vlSampleId")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="collected">Collected</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function page() {
  // Fetch viral load requests from the API for stats
  const { data: requestsData } = api.viralLoad.getRequests.useQuery({
    limit: 100, // Get samples for stats
    offset: 0,
  })

  const samples = requestsData?.samples || []
  const pendingCount = samples.filter((sample) => !sample.date_received).length
  const collectedCount = samples.filter((sample) => sample.date_received && !sample.date_received).length
  const processingCount = samples.filter((sample) => sample.date_received && !sample.verified).length
  const completedCount = samples.filter((sample) => sample.date_received && sample.verified === 1).length

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Pending Collection</h1>
        <p className="text-muted-foreground">View and manage viral load test requests waiting for sample collection</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Samples awaiting collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Collected Samples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{collectedCount}</div>
            <p className="text-sm text-muted-foreground">Samples collected, ready for packaging</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{processingCount}</div>
            <p className="text-sm text-muted-foreground">Samples being processed</p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{completedCount}</div>
            <p className="text-sm text-muted-foreground">Results available</p>
          </CardContent>
        </Card>
      </div>

      <ViralLoadDataTable />
    </main>
  )
}
