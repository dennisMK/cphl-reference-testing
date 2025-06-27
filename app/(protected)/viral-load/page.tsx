"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Package, FileText } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

const chartConfig = {
  pending: {
    label: "Pending Collections",
    color: "#ef4444", // red-500
  },
  packaged: {
    label: "Packaged Samples",
    color: "#f97316", // orange-500
  },
  results: {
    label: "Results Received",
    color: "#22c55e", // green-500
  },
} satisfies ChartConfig;

const timeRanges = [
  { label: "15 Days", value: 15, key: "15d" },
  { label: "30 Days", value: 30, key: "30d" },
  { label: "3 Months", value: 90, key: "3m" },
  { label: "1 Year", value: 365, key: "1y" },
  { label: "All Time", value: 999, key: "all" }, // We'll handle "all time" specially
];

export default function page() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("pending");
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(15);

  // Fetch real analytics data from the API
  const { data: analyticsData, isLoading } = api.viralLoad.getAnalytics.useQuery({
    days: selectedTimeRange,
  });

  const total = React.useMemo(
    () => {
      if (!analyticsData) {
        return { pending: 0, packaged: 0, results: 0 };
      }
      
      // Get the latest values from the most recent date
      const latestData = analyticsData[analyticsData.length - 1];
      return {
        pending: latestData?.pending || 0,
        packaged: latestData?.packaged || 0,
        results: latestData?.results || 0,
      };
    },
    [analyticsData]
  );

  const actions = [
    { 
      title: "New Test Request", 
      icon: Plus, 
      href: "/viral-load/new-request", 
      action: "create",
      description: "Create a new HIV viral load test request for a patient"
    },
    { 
      title: "Pending Sample Collection", 
      icon: Clock, 
      href: "/viral-load/pending-collection", 
      action: "view",
      description: "View and manage test requests waiting for sample collection"
    },
    { 
      title: "Package Samples", 
      icon: Package, 
      href: "/viral-load/package-samples", 
      action: "view",
      description: "Prepare and package collected samples for laboratory shipment"
    },
    { 
      title: "VL Results", 
      icon: FileText, 
      href: "/viral-load/results", 
      action: "view",
      description: "View and manage HIV viral load test results from the laboratory"
    }
  ];

  const getSelectedTimeRangeLabel = () => {
    const range = timeRanges.find(r => r.value === selectedTimeRange);
    return range ? range.label.toLowerCase() : "15 days";
  };

  return (
    <main className="md:container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">HIV Viral Load</h1>
        <p className="text-muted-foreground">Manage HIV viral load test requests, sample collection, and packaging for laboratory processing.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                    className={`cursor-pointer rounded-xl w-full ${action.action === "create" ? "bg-red-600 hover:bg-red-700" : ""}`}>
                    {action.action === "create" ? "Create" : "View"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Testing Analytics</h2>
            <p className="text-muted-foreground">Track viral load testing progress and workflow metrics</p>
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
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
              <CardTitle>Viral Load Testing Overview</CardTitle>
              <CardDescription>
                Showing testing workflow metrics for the {getSelectedTimeRangeLabel()}
              </CardDescription>
            </div>
            <div className="flex">
              {(["pending", "packaged", "results"] as const).map((key) => {
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
                      {isLoading ? (
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
            {isLoading ? (
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
                  data={analyticsData}
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
                  <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
