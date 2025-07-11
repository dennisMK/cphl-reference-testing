"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

// Sample data for the last 30 days
const viralLoadData = [
  { date: "2024-06-01", completed: 45, pending: 12 },
  { date: "2024-06-02", completed: 52, pending: 8 },
  { date: "2024-06-03", completed: 38, pending: 15 },
  { date: "2024-06-04", completed: 67, pending: 6 },
  { date: "2024-06-05", completed: 48, pending: 11 },
  { date: "2024-06-06", completed: 55, pending: 9 },
  { date: "2024-06-07", completed: 42, pending: 13 },
  { date: "2024-06-08", completed: 61, pending: 7 },
  { date: "2024-06-09", completed: 39, pending: 14 },
  { date: "2024-06-10", completed: 58, pending: 10 },
  { date: "2024-06-11", completed: 44, pending: 12 },
  { date: "2024-06-12", completed: 63, pending: 5 },
  { date: "2024-06-13", completed: 41, pending: 16 },
  { date: "2024-06-14", completed: 56, pending: 8 },
  { date: "2024-06-15", completed: 49, pending: 11 },
  { date: "2024-06-16", completed: 65, pending: 4 },
  { date: "2024-06-17", completed: 43, pending: 13 },
  { date: "2024-06-18", completed: 59, pending: 9 },
  { date: "2024-06-19", completed: 47, pending: 12 },
  { date: "2024-06-20", completed: 62, pending: 6 },
  { date: "2024-06-21", completed: 40, pending: 15 },
  { date: "2024-06-22", completed: 57, pending: 8 },
  { date: "2024-06-23", completed: 51, pending: 10 },
  { date: "2024-06-24", completed: 46, pending: 14 },
  { date: "2024-06-25", completed: 64, pending: 5 },
  { date: "2024-06-26", completed: 53, pending: 9 },
  { date: "2024-06-27", completed: 45, pending: 12 },
  { date: "2024-06-28", completed: 60, pending: 7 },
  { date: "2024-06-29", completed: 48, pending: 11 },
  { date: "2024-06-30", completed: 54, pending: 9 }
]

const eidData = [
  { date: "2024-06-01", completed: 18, pending: 4 },
  { date: "2024-06-02", completed: 22, pending: 2 },
  { date: "2024-06-03", completed: 15, pending: 6 },
  { date: "2024-06-04", completed: 27, pending: 1 },
  { date: "2024-06-05", completed: 19, pending: 4 },
  { date: "2024-06-06", completed: 23, pending: 3 },
  { date: "2024-06-07", completed: 17, pending: 5 },
  { date: "2024-06-08", completed: 25, pending: 2 },
  { date: "2024-06-09", completed: 14, pending: 6 },
  { date: "2024-06-10", completed: 21, pending: 3 },
  { date: "2024-06-11", completed: 16, pending: 5 },
  { date: "2024-06-12", completed: 26, pending: 1 },
  { date: "2024-06-13", completed: 20, pending: 4 },
  { date: "2024-06-14", completed: 24, pending: 2 },
  { date: "2024-06-15", completed: 18, pending: 5 },
  { date: "2024-06-16", completed: 28, pending: 1 },
  { date: "2024-06-17", completed: 16, pending: 6 },
  { date: "2024-06-18", completed: 23, pending: 3 },
  { date: "2024-06-19", completed: 19, pending: 4 },
  { date: "2024-06-20", completed: 25, pending: 2 },
  { date: "2024-06-21", completed: 17, pending: 5 },
  { date: "2024-06-22", completed: 22, pending: 3 },
  { date: "2024-06-23", completed: 20, pending: 4 },
  { date: "2024-06-24", completed: 15, pending: 6 },
  { date: "2024-06-25", completed: 26, pending: 1 },
  { date: "2024-06-26", completed: 21, pending: 3 },
  { date: "2024-06-27", completed: 18, pending: 5 },
  { date: "2024-06-28", completed: 24, pending: 2 },
  { date: "2024-06-29", completed: 19, pending: 4 },
  { date: "2024-06-30", completed: 23, pending: 3 }
]

const viralLoadChartConfig = {
  views: {
    label: "Test Results",
  },
  completed: {
    label: "Completed Tests",
    color: "var(--chart-1)",
  },
  pending: {
    label: "Pending Tests", 
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const eidChartConfig = {
  views: {
    label: "Test Results",
  },
  completed: {
    label: "Completed Tests",
    color: "var(--chart-3)",
  },
  pending: {
    label: "Pending Tests",
    color: "var(--chart-4)", 
  },
} satisfies ChartConfig

export function ViralLoadChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof viralLoadChartConfig>("completed")

  const total = React.useMemo(
    () => ({
      completed: viralLoadData.reduce((acc, curr) => acc + curr.completed, 0),
      pending: viralLoadData.reduce((acc, curr) => acc + curr.pending, 0),
    }),
    []
  )

  return (
    <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-6">
          <CardTitle className="text-red-800">Viral Load Testing Analytics</CardTitle>
          <CardDescription className="text-red-700">
            Daily test completions and pending requests - Last 30 days
          </CardDescription>
        </div>
        <div className="flex">
          {["completed", "pending"].map((key) => {
            const chart = key as keyof typeof viralLoadChartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-red-100 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 hover:bg-red-50 transition-colors"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-red-600 text-xs font-medium">
                  {viralLoadChartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl text-red-800">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={viralLoadChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={viralLoadData}
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
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function EIDChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof eidChartConfig>("completed")

  const total = React.useMemo(
    () => ({
      completed: eidData.reduce((acc, curr) => acc + curr.completed, 0),
      pending: eidData.reduce((acc, curr) => acc + curr.pending, 0),
    }),
    []
  )

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-6">
          <CardTitle className="text-blue-800">Early Infant Diagnosis Analytics</CardTitle>
          <CardDescription className="text-blue-700">
            Daily test completions and pending requests - Last 30 days
          </CardDescription>
        </div>
        <div className="flex">
          {["completed", "pending"].map((key) => {
            const chart = key as keyof typeof eidChartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-blue-100 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 hover:bg-blue-50 transition-colors"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-blue-600 text-xs font-medium">
                  {eidChartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl text-blue-800">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={eidChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={eidData}
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
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 