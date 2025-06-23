"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

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
    color: "hsl(var(--destructive))",
  },
  eid: {
    label: "Early Infant Diagnosis", 
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Laboratory Test Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily viral load and EID testing volume for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillViralLoad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-viralLoad)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-viralLoad)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEid" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-eid)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-eid)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="eid"
              type="natural"
              fill="url(#fillEid)"
              stroke="var(--color-eid)"
              stackId="a"
            />
            <Area
              dataKey="viralLoad"
              type="natural"
              fill="url(#fillViralLoad)"
              stroke="var(--color-viralLoad)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
