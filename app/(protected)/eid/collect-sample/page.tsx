"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  ChevronDown,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Package,
  Baby,
} from "lucide-react";
import { IconArrowLeft, IconTestPipe } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export type EIDRequest = {
  id: number;
  infant_name: string;
  infant_exp_id: string | null;
  infant_gender: "MALE" | "FEMALE" | "NOT_RECORDED";
  infant_age: string | null;
  infant_age_units: string | null;
  infant_dob: Date | null;
  infant_is_breast_feeding: string | null;
  infant_contact_phone: string | null;
  mother_htsnr: string | null;
  mother_artnr: string | null;
  date_dbs_taken: Date | null;
  testing_completed: string | null;
  accepted_result: string | null;
  created_at: Date;
  batch_id: number;
  pcr: "FIRST" | "SECOND" | "NON_ROUTINE" | "UNKNOWN" | "THIRD";
  test_type: string | null;
  date_rcvd_by_cphl: Date | null;
  facility_name: string | null;
  facility_district: string | null;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending Collection":
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending</Badge>;
    case "Collected":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Collected</Badge>;
    case "Completed":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
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
      );
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-blue-600">
        EID-{String(row.getValue("id")).padStart(6, "0")}
      </div>
    ),
  },
  {
    accessorKey: "infant_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Infant Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.getValue("infant_name")}</div>
    ),
  },
  {
    accessorKey: "mother_htsnr",
    header: "Mother's HTS Number",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.getValue("mother_htsnr") || "Not provided"}
      </div>
    ),
  },
  {
    accessorKey: "facility_name",
    header: "Facility",
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{row.getValue("facility_name")}</div>
        <div className="text-gray-500">{row.original.facility_district}</div>
      </div>
    ),
  },
  {
    accessorKey: "test_type",
    header: "Test Type",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.getValue("test_type") || "Standard EID"}
      </div>
    ),
  },
  {
    accessorKey: "pcr",
    header: "PCR Type",
    cell: ({ row }) => getPriorityBadge(row.getValue("pcr")),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Request Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div className="text-sm text-gray-600">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const request = row.original;
      if (request.date_dbs_taken) {
        return getStatusBadge("Collected");
      } else {
        return getStatusBadge("Pending Collection");
      }
    },
  },
  {
    accessorKey: "infant_age",
    header: "Age",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {formatAge(row.getValue("infant_age"), row.original.infant_age_units)}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const request = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  `EID-${String(request.id).padStart(6, "0")}`
                )
              }
            >
              Copy Request ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/eid/${request.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/eid/${request.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Request
              </Link>
            </DropdownMenuItem>
            {!request.date_dbs_taken && (
              <DropdownMenuItem asChild>
                <Link href={`/eid/${request.id}/collect`} className="text-green-600 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Collect Sample
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function EIDDataTable() {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [activeTab, setActiveTab] = React.useState<"pending" | "collected">("pending");

  // Fetch samples based on active tab
  const { data: pendingData, isLoading: pendingLoading, error: pendingError, refetch: refetchPending } = api.eid.getPendingCollections.useQuery({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  }, { enabled: activeTab === "pending" });

  const { data: collectedData, isLoading: collectedLoading, error: collectedError, refetch: refetchCollected } = api.eid.getRequests.useQuery({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    status: "collected",
  }, { enabled: activeTab === "collected" });

  const collectSampleMutation = api.eid.collectSample.useMutation({
    onSuccess: () => {
      toast.success("Sample collected successfully!");
      refetchPending();
      refetchCollected();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to collect sample");
    },
  });

  // Determine which data to use based on active tab
  const isLoading = activeTab === "pending" ? pendingLoading : collectedLoading;
  const error = activeTab === "pending" ? pendingError : collectedError;
  const data = activeTab === "pending" ? pendingData : collectedData;
  const requests = data?.samples || [];
  const totalCount = data?.total || 0;

  const table = useReactTable({
    data: requests as EIDRequest[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleCollectSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error("Please select samples to collect");
      return;
    }

    try {
      for (const row of selectedRows) {
        await collectSampleMutation.mutateAsync({ id: row.original.id });
      }
      setRowSelection({});
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading EID requests</p>
          <Button onClick={() => activeTab === "pending" ? refetchPending() : refetchCollected()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="mb-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "pending"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Pending Collection ({pendingData?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab("collected")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "collected"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Collected Samples
          </button>
        </div>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter requests..."
          value={(table.getColumn("infant_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("infant_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center space-x-2">
          {activeTab === "pending" && table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              onClick={handleCollectSelected}
              className="bg-green-600 hover:bg-green-700"
              disabled={collectSampleMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Collect Selected ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
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
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading EID requests...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {activeTab === "pending" 
                    ? "No EID requests pending collection." 
                    : "No collected samples found."
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CollectSamplePage() {
  // Fetch dashboard statistics
  const { data: dashboardStats, isLoading: statsLoading } = api.eid.getDashboardStats.useQuery();

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
                <Baby className="h-8 w-8 text-blue-600" />
                <span>Collect EID Samples</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and collect DBS samples for Early Infant Diagnosis testing
              </p>
            </div>
          </div>
          <Link href="/eid/new-request">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <IconTestPipe className="mr-2 h-4 w-4" />
              New EID Request
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Pending Collection</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {statsLoading ? "..." : dashboardStats?.pendingSamples || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Collected</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {statsLoading ? "..." : dashboardStats?.collectedSamples || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Baby className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Samples</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {statsLoading ? "..." : dashboardStats?.totalSamples || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <EIDDataTable />
        </CardContent>
      </Card>
    </div>
  );
} 