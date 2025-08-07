"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const Analytics = () => {
  // Time-based chart data (month-wise)
  const [chartData] = useState([
    { date: "2024-01-01", total: 40, resolved: 20 },
    { date: "2024-02-01", total: 55, resolved: 30 },
    { date: "2024-03-01", total: 60, resolved: 50 },
    { date: "2024-04-01", total: 80, resolved: 65 },
    { date: "2024-05-01", total: 90, resolved: 70 },
    { date: "2024-06-01", total: 100, resolved: 85 },
    { date: "2024-07-01", total: 120, resolved: 100 },
    { date: "2024-08-01", total: 95, resolved: 80 },
    { date: "2024-09-01", total: 85, resolved: 60 },
    { date: "2024-10-01", total: 75, resolved: 55 },
  ]);

  const chartConfig = {
    total: {
      label: "Total Cases",
      color: "#f97316", // orange
    },
    resolved: {
      label: "Resolved Cases",
      color: "#10b981", // green
    },
  };

  // Category-wise fraud data
  const fraudChartData = [
    { category: "Banking Fraud", cases: 120 },
    { category: "UPI / Wallet Fraud", cases: 90 },
    { category: "Loan Fraud", cases: 70 },
    { category: "Investment Scam", cases: 50 },
    { category: "Online Shopping Fraud", cases: 60 },
  ];

  const fraudChartConfig = {
    cases: {
      label: "Cases",
      color: "#3b82f6", // blue
    },
  };

  return (
    <div className="flex flex-wrap justify-between gap-6 px-10">
      {/* Time-based complaint statistics */}
      <Card className="w-[650px] rounded-xl shadow-md">
        <CardHeader>
          <CardTitle>Complaint Statistics</CardTitle>
          <CardDescription>
            Month-wise comparison of total vs resolved complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData} width={600} height={300}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                    })
                  }
                />
                <Bar
                  dataKey="total"
                  stackId="a"
                  fill={chartConfig.total.color}
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="resolved"
                  stackId="a"
                  fill={chartConfig.resolved.color}
                  radius={[4, 4, 0, 0]}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                  defaultIndex={0}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category-wise fraud distribution */}
      <Card className="w-[650px] rounded-xl shadow-md">
        <CardHeader>
          <CardTitle>Fraud Type Distribution</CardTitle>
          <CardDescription>Category-wise total fraud cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <ChartContainer config={fraudChartConfig}>
              <BarChart
                data={fraudChartData}
                layout="vertical"
                width={600}
                height={300}
                margin={{ top: 30, right: 30, bottom: 30, left: 20 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis dataKey="cases" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="cases"
                  fill={fraudChartConfig.cases.color}
                  radius={4}
                >
                  <LabelList
                    dataKey="category"
                    position="insideLeft"
                    offset={12}
                    className="fill-white"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="cases"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground">
            Showing fraud category trends with sample data
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Analytics;
