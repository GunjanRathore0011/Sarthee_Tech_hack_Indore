"use client";

import React, { useEffect, useState } from "react";
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
  // ✅ Initialize as empty array to prevent "data is not iterable" error
  const [chartData, setChartData] = useState([]);
  const [fraudChartData, setFraudChartData] = useState([]); // Initialize as empty array

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/admin/monthly-complaint-stats"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const result = await response.json();
      console.log("Fetched chart data:", result.data);
      // ✅ Ensure data is array before setting
      if (Array.isArray(result.data)) {
        setChartData(result.data);
      } else {
        console.error("Invalid chart data format:", data);
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };


  // Fetch officer data (can be replaced with API later)
  const fetchFraudChartData = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/admin/subCategoryStats"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const result = await response.json();
      console.log("Fetched fraud chart data:", result.data);
      // ✅ Ensure data is array before setting
      const transformedFraudData = result.data.map(item => ({
        category: item.subCategory,
        cases: item.total,
      })).sort((a, b) => b.cases - a.cases) // sort by cases descending
        .slice(0, 5); // take top 5 entries;

      console.log("Transformed fraud data:", transformedFraudData);
      if (Array.isArray(transformedFraudData)) {
        setFraudChartData(transformedFraudData);
      } else {
        console.error("Invalid chart data format:", data);
        setFraudChartData([]);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
    fetchFraudChartData();
    // ✅ Add empty dependency array to run only once on mount
  }, []);

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


  const fraudChartConfig = {
    cases: {
      label: "Cases",
      color: "#3b82f6", // blue
    },
  };

  return (
    <div className="flex flex-wrap justify-between gap-6 px-10">
      {/* Complaint Statistics */}
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
              {/* ✅ Only render chart if data is available */}
              {chartData.length > 0 && (
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
                  <YAxis />
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
              )}
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Type Distribution */}
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
