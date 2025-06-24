"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Edit, Trash2, FileText, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, Baby } from "lucide-react";
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
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
import { IconTestPipe, IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

// EID requests data structure
export type EIDRequest = {
  id: string
  infantName: string
  mothersName: string
  facility: string
  district: string
  testType: "Initial Test" | "Follow-up" | "Confirmatory"
  priority: "STAT" | "Urgent" | "Routine"
  requestDate: string
  status: "Pending Collection" | "Ready for Collection" | "Collected" | "Processing"
  age: string
}

// Sample data for EID requests pending collection
const eidRequests: EIDRequest[] = [
  {
    id: "EID-001234",
    infantName: "Baby Nakato",
    mothersName: "Sarah Nakato",
    facility: "Mulago Hospital",
    district: "Kampala",
    testType: "Initial Test",
    priority: "Routine",
    requestDate: "2024-01-15",
    status: "Pending Collection",
    age: "8 weeks"
  },
  {
    id: "EID-001235", 
    infantName: "Baby Okello",
    mothersName: "Grace Okello",
    facility: "Gulu Hospital",
    district: "Gulu",
    testType: "Follow-up",
    priority: "Urgent",
    requestDate: "2024-01-14",
    status: "Pending Collection",
    age: "16 weeks"
  },
  {
    id: "EID-001236",
    infantName: "Baby Nabirye",
    mothersName: "Ruth Nabirye", 
    facility: "Mbale Hospital",
    district: "Mbale",
    testType: "Confirmatory",
    priority: "Routine",
    requestDate: "2024-01-13",
    status: "Pending Collection",
    age: "15 months"
  },
  {
    id: "EID-001237",
    infantName: "Baby Musoke",
    mothersName: "Jane Musoke",
    facility: "Mbarara Hospital",
    district: "Mbarara", 
    testType: "Initial Test",
    priority: "STAT",
    requestDate: "2024-01-12",
    status: "Pending Collection",
    age: "6 weeks"
  },
  {
    id: "EID-001238",
    infantName: "Baby Lwanga",
    mothersName: "Mary Lwanga",
    facility: "Butabika Hospital",
    district: "Kampala",
    testType: "Follow-up",
    priority: "Routine",
    requestDate: "2024-01-11",
    status: "Ready for Collection",
    age: "12 weeks"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending Collection":
      return <Badge variant="secondary" className="text-orange-600 bg-orange-50">Pending Collection</Badge>
    case "Ready for Collection":
      return <Badge variant="secondary" className="text-green-600 bg-green-50">Ready for Collection</Badge>
    case "Collected":
      return <Badge variant="secondary" className="text-blue-600 bg-blue-50">Collected</Badge>
    case "Processing":
      return <Badge variant="secondary" className="text-purple-600 bg-purple-50">Processing</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "STAT":
      return <Badge className="bg-red-500 text-white">STAT</Badge>
    case "Urgent":
      return <Badge className="bg-orange-500 text-white">Urgent</Badge>
    case "Routine":
      return <Badge className="bg-blue-500 text-white">Routine</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

export const columns: ColumnDef<EIDRequest>[] = [
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
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Request ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-blue-600">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "infantName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Infant Details
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.getValue("infantName")}</div>
        <div className="text-sm text-gray-500">Age: {row.original.age}</div>
      </div>
    ),
  },
  {
    accessorKey: "mothersName",
    header: "Mother's Name",
    cell: ({ row }) => (
      <div className="text-gray-900">{row.getValue("mothersName")}</div>
    ),
  },
  {
    accessorKey: "facility",
    header: "Facility",
    cell: ({ row }) => (
      <div>
        <div className="text-gray-900">{row.getValue("facility")}</div>
        <div className="text-sm text-gray-500">{row.original.district}</div>
      </div>
    ),
  },
  {
    accessorKey: "testType",
    header: "Test Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.getValue("testType")}
      </Badge>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      return getPriorityBadge(row.getValue("priority"))
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return getStatusBadge(row.getValue("status"))
    },
  },
  {
    accessorKey: "requestDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("requestDate"))
      return <div className="text-sm">{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const request = row.original

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
              onClick={() => navigator.clipboard.writeText(request.id)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Copy Request ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={`/eid/${request.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </a>
            </DropdownMenuItem>
            {request.status === "Pending Collection" && (
              <DropdownMenuItem asChild>
                <Link href={`/eid/${request.id}/collect`}>
                  <Package className="mr-2 h-4 w-4" />
                  Collect Sample
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <a href={`/eid/${request.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Request
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Request
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function EIDDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const data = React.useMemo(() => {
    if (statusFilter === "all") return eidRequests
    return eidRequests.filter(request => request.status === statusFilter)
  }, [statusFilter])

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
            placeholder="Filter by Request ID..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending Collection">Pending Collection</SelectItem>
              <SelectItem value="Ready for Collection">Ready for Collection</SelectItem>
              <SelectItem value="Collected">Collected</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
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

export default function CollectSamplePage() {
  const pendingCount = eidRequests.filter(request => request.status === "Pending Collection").length
  const readyCount = eidRequests.filter(request => request.status === "Ready for Collection").length

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/eid">
            <Button variant="ghost" size="sm" className="p-2">
              <IconArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500">
              <IconTestPipe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Collect Samples</h1>
              <p className="text-gray-600">EID requests ready for sample collection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
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
              <CheckCircle className="h-5 w-5 text-green-500" />
              Ready for Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{readyCount}</div>
            <p className="text-sm text-muted-foreground">Samples ready for collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-blue-500" />
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{eidRequests.length}</div>
            <p className="text-sm text-muted-foreground">Total EID requests</p>
          </CardContent>
        </Card>
      </div>

      <EIDDataTable />
    </div>
  )
} 