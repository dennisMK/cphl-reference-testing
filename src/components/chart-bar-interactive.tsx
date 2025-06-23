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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
  { date: "2024-04-01", viralLoad: 45, eid: 12 },
  { date: "2024-04-02", viralLoad: 38, eid: 18 },
  { date: "2024-04-03", viralLoad: 52, eid: 15 },
  { date: "2024-04-04", viralLoad: 61, eid: 22 },
  { date: "2024-04-05", viralLoad: 73, eid: 28 },
  { date: "2024-04-06", viralLoad: 68, eid: 31 },
  { date: "2024-04-07", viralLoad: 42, eid: 19 },
  { date: "2024-04-08", viralLoad: 79, eid: 35 },
  { date: "2024-04-09", viralLoad: 35, eid: 14 },
  { date: "2024-04-10", viralLoad: 58, eid: 21 },
  { date: "2024-04-11", viralLoad: 67, eid: 33 },
  { date: "2024-04-12", viralLoad: 54, eid: 24 },
  { date: "2024-04-13", viralLoad: 71, eid: 29 },
  { date: "2024-04-14", viralLoad: 43, eid: 17 },
  { date: "2024-04-15", viralLoad: 39, eid: 16 },
  { date: "2024-04-16", viralLoad: 47, eid: 20 },
  { date: "2024-04-17", viralLoad: 82, eid: 38 },
  { date: "2024-04-18", viralLoad: 76, eid: 34 },
  { date: "2024-04-19", viralLoad: 51, eid: 23 },
  { date: "2024-04-20", viralLoad: 36, eid: 15 },
  { date: "2024-04-21", viralLoad: 44, eid: 18 },
  { date: "2024-04-22", viralLoad: 56, eid: 25 },
  { date: "2024-04-23", viralLoad: 48, eid: 21 },
  { date: "2024-04-24", viralLoad: 78, eid: 32 },
  { date: "2024-04-25", viralLoad: 63, eid: 27 },
  { date: "2024-04-26", viralLoad: 32, eid: 13 },
  { date: "2024-04-27", viralLoad: 81, eid: 37 },
  { date: "2024-04-28", viralLoad: 41, eid: 16 },
  { date: "2024-04-29", viralLoad: 69, eid: 30 },
  { date: "2024-04-30", viralLoad: 87, eid: 39 },
  { date: "2024-05-01", viralLoad: 49, eid: 22 },
  { date: "2024-05-02", viralLoad: 74, eid: 31 },
  { date: "2024-05-03", viralLoad: 55, eid: 26 },
  { date: "2024-05-04", viralLoad: 83, eid: 36 },
  { date: "2024-05-05", viralLoad: 91, eid: 42 },
  { date: "2024-05-06", viralLoad: 95, eid: 45 },
  { date: "2024-05-07", viralLoad: 77, eid: 33 },
  { date: "2024-05-08", viralLoad: 46, eid: 19 },
  { date: "2024-05-09", viralLoad: 53, eid: 24 },
  { date: "2024-05-10", viralLoad: 72, eid: 29 },
  { date: "2024-05-11", viralLoad: 65, eid: 28 },
  { date: "2024-05-12", viralLoad: 50, eid: 23 },
  { date: "2024-05-13", viralLoad: 47, eid: 20 },
  { date: "2024-05-14", viralLoad: 89, eid: 41 },
  { date: "2024-05-15", viralLoad: 86, eid: 38 },
  { date: "2024-05-16", viralLoad: 70, eid: 32 },
  { date: "2024-05-17", viralLoad: 93, eid: 43 },
  { date: "2024-05-18", viralLoad: 66, eid: 30 },
  { date: "2024-05-19", viralLoad: 52, eid: 25 },
  { date: "2024-05-20", viralLoad: 43, eid: 18 },
  { date: "2024-05-21", viralLoad: 37, eid: 15 },
  { date: "2024-05-22", viralLoad: 35, eid: 14 },
  { date: "2024-05-23", viralLoad: 59, eid: 27 },
  { date: "2024-05-24", viralLoad: 64, eid: 28 },
  { date: "2024-05-25", viralLoad: 48, eid: 21 },
  { date: "2024-05-26", viralLoad: 51, eid: 24 },
  { date: "2024-05-27", viralLoad: 85, eid: 37 },
  { date: "2024-05-28", viralLoad: 54, eid: 25 },
  { date: "2024-05-29", viralLoad: 33, eid: 12 },
  { date: "2024-05-30", viralLoad: 75, eid: 34 },
  { date: "2024-05-31", viralLoad: 45, eid: 19 },
  { date: "2024-06-01", viralLoad: 44, eid: 18 },
  { date: "2024-06-02", viralLoad: 88, eid: 40 },
  { date: "2024-06-03", viralLoad: 38, eid: 16 },
  { date: "2024-06-04", viralLoad: 84, eid: 35 },
  { date: "2024-06-05", viralLoad: 34, eid: 13 },
  { date: "2024-06-06", viralLoad: 62, eid: 26 },
  { date: "2024-06-07", viralLoad: 68, eid: 31 },
  { date: "2024-06-08", viralLoad: 77, eid: 33 },
  { date: "2024-06-09", viralLoad: 90, eid: 41 },
  { date: "2024-06-10", viralLoad: 46, eid: 20 },
  { date: "2024-06-11", viralLoad: 36, eid: 15 },
  { date: "2024-06-12", viralLoad: 94, eid: 44 },
  { date: "2024-06-13", viralLoad: 32, eid: 12 },
  { date: "2024-06-14", viralLoad: 82, eid: 36 },
  { date: "2024-06-15", viralLoad: 67, eid: 30 },
  { date: "2024-06-16", viralLoad: 73, eid: 32 },
  { date: "2024-06-17", viralLoad: 96, eid: 46 },
  { date: "2024-06-18", viralLoad: 40, eid: 17 },
  { date: "2024-06-19", viralLoad: 71, eid: 31 },
  { date: "2024-06-20", viralLoad: 85, eid: 38 },
  { date: "2024-06-21", viralLoad: 49, eid: 22 },
  { date: "2024-06-22", viralLoad: 65, eid: 29 },
  { date: "2024-06-23", viralLoad: 92, eid: 42 },
  { date: "2024-06-24", viralLoad: 41, eid: 18 },
  { date: "2024-06-25", viralLoad: 43, eid: 19 },
  { date: "2024-06-26", viralLoad: 86, eid: 37 },
  { date: "2024-06-27", viralLoad: 89, eid: 40 },
  { date: "2024-06-28", viralLoad: 47, eid: 21 },
  { date: "2024-06-29", viralLoad: 39, eid: 16 },
  { date: "2024-06-30", viralLoad: 91, eid: 41 },
]

const chartConfig = {
  tests: {
    label: "Laboratory Tests",
  },
  viralLoad: {
    label: "Viral Load",
    color: "hsl(0 72% 51%)", // Red color
  },
  eid: {
    label: "Early Infant Diagnosis",
    color: "hsl(221 83% 53%)", // Blue color
  },
} satisfies ChartConfig

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("viralLoad")

  const total = React.useMemo(
    () => ({
      viralLoad: chartData.reduce((acc, curr) => acc + curr.viralLoad, 0),
      eid: chartData.reduce((acc, curr) => acc + curr.eid, 0),
    }),
    []
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Laboratory Test Volume</CardTitle>
          <CardDescription>
            Daily testing volume comparison for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["viralLoad", "eid"].map((key) => {
            const chart = key as keyof typeof chartConfig
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
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
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
                  nameKey="tests"
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