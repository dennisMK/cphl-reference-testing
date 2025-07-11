"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TestTube, Clock, CheckCircle, FileText, Package } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const chartConfig = {
  total: {
    label: "Total Samples",
    color: "#6366f1", // indigo-500
  },
  pending: {
    label: "Pending Collection",
    color: "#ef4444", // red-500
  },
  collected: {
    label: "Collected Samples",
    color: "#3b82f6", // blue-500
  },
} satisfies ChartConfig;

const timeRanges = [
  { label: "15 Days", value: 15, key: "15d" },
  { label: "30 Days", value: 30, key: "30d" },
  { label: "3 Months", value: 90, key: "3m" },
  { label: "All Time", value: 999, key: "all" },
];

export default function EIDPage() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("total");
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(15);

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = api.eid.getDashboardStats.useQuery();

  // Fetch real analytics data from the API
  const { data: analyticsData, isLoading: analyticsLoading } = api.eid.getAnalytics.useQuery({
    days: selectedTimeRange,
  });

  const total = React.useMemo(
    () => {
      if (!analyticsData) {
        return { pending: 0, collected: 0, total: 0 };
      }
      
      // Get the latest values from the most recent date
      const latestData = analyticsData[analyticsData.length - 1];
      const pending = latestData?.pending || 0;
      const collected = latestData?.collected || 0;
      const totalSamples = pending + collected;
      
      return {
        pending,
        collected,
        total: totalSamples,
      };
    },
    [analyticsData]
  );

  const getSelectedTimeRangeLabel = () => {
    const range = timeRanges.find(r => r.value === selectedTimeRange);
    return range ? range.label.toLowerCase() : "15 days";
  };

  const actions = [
    { 
      title: "New Test Request", 
      icon: Plus, 
      href: "/eid/new-request", 
      action: "create",
      description: "Create a new EID test request for infant HIV diagnosis"
    },
    { 
      title: "Collect Sample", 
      icon: TestTube, 
      href: "/eid/collect-sample", 
      action: "view",
      description: "Collect and register biological samples for testing"
    }
  ];

  return (
    <main className="md:container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Early Infant Diagnosis (EID)</h1>
        <p className="text-muted-foreground">Request for EID testing and access results electronically for infant HIV diagnosis.</p>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8" style={{color: "#60a5fa"}} />
              <div>
                <p className="text-sm text-gray-600">Pending Collection</p>
                {analyticsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold" style={{color: "#2563eb"}}>{total.pending}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8" style={{color: "#2563eb"}} />
              <div>
                <p className="text-sm text-gray-600">Collected</p>
                {analyticsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold" style={{color: "#2563eb"}}>{total.collected}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8" style={{color: "#2563eb"}} />
              <div>
                <p className="text-sm text-gray-600">Total Samples</p>
                {analyticsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold" style={{color: "#2563eb"}}>{total.total}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <Link href={action.href}>
                  <Button
                  size={"lg"}
                    variant={action.action === "create" ? "default" : "outline"}
                    className={`cursor-pointer rounded-xl w-full ${action.action === "create" ? "bg-blue-600 hover:bg-blue-700" : ""}`}>
                    {action.action === "create" ? "Create" : "View"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

     

      {/* Analytics Charts */}
      <div className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">EID Testing Analytics</h2>
            <p className="text-muted-foreground">Track early infant diagnosis testing progress and workflow metrics</p>
          </div>
          
          {/* Time Range Filter */}
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.key}
                variant={selectedTimeRange === range.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "transition-all",
                  selectedTimeRange === range.value 
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                )}
                onClick={() => setSelectedTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        <Card className="py-0">
          <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
              <CardTitle>EID Testing Overview</CardTitle>
              <CardDescription>
                Showing testing workflow metrics for the {getSelectedTimeRangeLabel()}
              </CardDescription>
            </div>
            <div className="flex">
              {(["total", "pending", "collected"] as const).map((key) => {
                const chart = key as keyof typeof chartConfig;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-muted-foreground text-xs">
                      {chartConfig[chart].label}
                    </span>
                    <span className="text-lg leading-none font-bold sm:text-3xl">
                      {analyticsLoading ? (
                        <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        total[key].toLocaleString()
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            {analyticsLoading ? (
              <div className="h-[250px] w-full flex items-center justify-center">
                <div className="text-muted-foreground">Loading analytics...</div>
              </div>
            ) : !analyticsData || analyticsData.length === 0 ? (
              <div className="h-[250px] w-full flex items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={analyticsData?.map(item => ({
                    ...item,
                    total: (item.pending || 0) + (item.collected || 0)
                  }))}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="samples"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  {activeChart === "total" ? (
                    <>
                      <Bar dataKey="pending" fill={chartConfig.pending.color} name="Pending Collection" />
                      <Bar dataKey="collected" fill={chartConfig.collected.color} name="Collected Samples" />
                    </>
                  ) : (
                    <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
                  )}
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
