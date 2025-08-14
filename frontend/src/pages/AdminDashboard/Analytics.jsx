"use client";

import React, { useEffect, useState,useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  LineChart,
  Line,
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
  const [selectedYear, setSelectedYear] = useState("All");
   const years = useMemo(() => {
    const allYears = chartData.map(item =>
      new Date(item.date).getFullYear()
    );
    return ["All", ...new Set(allYears)];
  }, [chartData]);

   const filteredData = useMemo(() => {
    if (selectedYear === "All") return chartData;
    return chartData.filter(
      item => new Date(item.date).getFullYear() === Number(selectedYear)
    );
  }, [chartData, selectedYear]);
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
  const [selectedMonth, setSelectedMonth] = useState(""); // '' = all months

  const fetchFraudChartData = async () => {
    try {
      let url = "http://localhost:4000/api/v1/admin/subCategoryStats";
      if (selectedMonth) {
        url += `?month=${selectedMonth}`; // e.g. ?month=2025-08
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch chart data");

      const result = await response.json();
      const transformedFraudData = result.data
        .map(item => ({
          category: item.subCategory,
          cases: item.total,
        }))
        .sort((a, b) => b.cases - a.cases)
        .slice(0, 5);

      setFraudChartData(transformedFraudData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };
// re-fetch whenever month changes
useEffect(() => {
  fetchFraudChartData();
}, [selectedMonth]);

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
<Card className="w-[650px] rounded-xl shadow-md">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Complaint Statistics</CardTitle>
          <CardDescription>
            Month-wise trend of total complaints
          </CardDescription>
        </div>

        {/* Year Filter Dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer config={chartConfig}>
            {filteredData.length > 0 && (
              <LineChart
                data={filteredData}
                width={600}
                height={300}
                style={{
                  background: "linear-gradient(180deg, #f9fafb 0%, #eef2ff 100%)",
                  borderRadius: "12px",
                  padding: "10px",
                }}
              >
                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.total.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={chartConfig.total.color} stopOpacity={0} />
                  </linearGradient>

                  <pattern
                    id="gridPattern"
                    width="50"
                    height="50"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="50" height="50" fill="transparent" />
                    <line x1="0" y1="0" x2="0" y2="50" stroke="#d1d5db" strokeOpacity="0.15" />
                    <line x1="0" y1="0" x2="50" y2="0" stroke="#d1d5db" strokeOpacity="0.15" />
                  </pattern>
                </defs>

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short" })
                  }
                />
                <YAxis domain={[0, (dataMax) => dataMax + 4]} />
                <CartesianGrid stroke="url(#gridPattern)" />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ strokeDasharray: "4 4", stroke: chartConfig.total.color }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={chartConfig.total.color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: chartConfig.total.color }}
                  activeDot={{ r: 7, fill: chartConfig.total.color }}
                  fill="url(#totalGradient)"
                />
              </LineChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>


      <Card className="w-[650px] rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fraud Type Distribution</CardTitle>
            <CardDescription>Category-wise total fraud cases</CardDescription>
          </div>

          {/* Month-Year Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="">All Time</option>
              <option value="2025-08">August 2025</option>
              <option value="2025-07">July 2025</option>
              <option value="2025-06">June 2025</option>
              {/* add more months dynamically if needed */}
            </select>
            {selectedMonth && (
              <button
                onClick={() => setSelectedMonth("")}
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              >
                Reset
              </button>
            )}
          </div>
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


    </div>
  );
};

export default Analytics;
