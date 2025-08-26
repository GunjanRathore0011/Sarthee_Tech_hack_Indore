"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
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

import axios from "axios";
import { Tooltip } from "react-leaflet";
import { Legend } from "chart.js";

// ✨ Framer Motion import
import { motion } from "framer-motion";

const Analytics = () => {
  const [chartData, setChartData] = useState([]);
  const [fraudChartData, setFraudChartData] = useState([]);
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
      if (Array.isArray(result.data)) {
        setChartData(result.data);
      } else {
        console.error("Invalid chart data format");
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const [selectedMonth, setSelectedMonth] = useState("");

  const fetchFraudChartData = async () => {
    try {
      let url = "http://localhost:4000/api/v1/admin/subCategoryStats";
      if (selectedMonth) {
        url += `?month=${selectedMonth}`;
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

  const chartConfig = {
    total: { label: "Total Cases", color: "#0473fb" },
    resolved: { label: "Resolved Cases", color: "#042c70" },
  };

  const fraudChartConfig = {
    cases: { label: "Cases", color: "#3b82f6" },
  };

  const [pieChartData, setPieChartData] = useState([]);
  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/admin/moneyLostRecovered"
      );
      if (response.status === 200) {
        const { success, data } = response.data;
        if (success && data) {
          const transformedData = [
            { name: "Pending", value: data.totalLost },
            { name: "Recovered", value: data.totalRecovered },
          ];
          setPieChartData(transformedData);
        }
      } else {
        console.error("Failed to fetch pie chart data");
      }
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
    fetchFraudChartData();
    fetchPieChartData();
  }, []);

  useEffect(() => {
    fetchFraudChartData();
  }, [selectedMonth]);

  const COLORS = ["#0473fb", "#042c70"];


  return (
    <div className="flex flex-wrap justify-between gap-18 px-10 py-16">
      {/* Line Chart */}
      <Card className="w-[650px] rounded-xl shadow-md ">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className='text-gray-800 font-semibold text-lg'>Complaint Statistics</CardTitle>
            <CardDescription className='text-gray-500 text-sm'>
              Month-wise trend of total complaints
            </CardDescription>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <ChartContainer config={chartConfig}>
              {filteredData.length > 0 && (
                <motion.div
                  key={filteredData.length}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <LineChart data={filteredData} width={600} height={300}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short" })
                      }
                    />
                    <YAxis />
                    <CartesianGrid />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke={'#0473fb'}
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#042c70' }}
                      activeDot={{ r: 7, fill: '#042c70' }}
                    />
                  </LineChart>
                </motion.div>
              )}
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Distribution */}
      <Card className="w-[650px] rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className='text-gray-800 font-semibold text-lg'>Fraud Type Distribution</CardTitle>
            <CardDescription className='text-gray-500 text-sm'>Category-wise total fraud cases</CardDescription>
          </div>
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
              <motion.div
                key={fraudChartData.length}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ transformOrigin: "bottom" }}
              >
                <BarChart data={fraudChartData} layout="vertical" width={600} height={300}>
                  <CartesianGrid horizontal={false} />
                  <XAxis dataKey="cases" type="number" hide />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Bar dataKey="cases" fill={'#0473fb'} radius={4}>
                    <LabelList dataKey="category" position="insideLeft" offset={12} className="fill-white" fontSize={12} />
                    <LabelList dataKey="cases" position="right" offset={8} className="fill-foreground" fontSize={12} />
                  </Bar>
                </BarChart>
              </motion.div>
            </ChartContainer>
          </div>
        </CardContent>
        
      </Card>

      {/* Complaint Statistics Bar */}
      <Card className="w-[650px] rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className='text-gray-800 font-semibold text-lg'>Complaint Statistics</CardTitle>
          <CardDescription className='text-gray-500 text-sm'>
            Month-wise comparison of total vs resolved complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <ChartContainer config={chartConfig}>
              {chartData.length > 0 && (
                <motion.div
                  key={chartData.length}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  style={{ transformOrigin: "bottom" }}
                >
                  <BarChart data={chartData} width={600} height={300}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short" })
                      }
                    />
                    <YAxis />
                    <Bar dataKey="total" stackId="a" fill={'#0473fb'} />
                    <Bar dataKey="resolved" stackId="a" fill={'#042c70'} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </motion.div>
              )}
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="w-[650px] rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className='text-gray-800 font-semibold text-lg'>Pending vs Recovery Amount</CardTitle>
          <CardDescription className='text-gray-500 text-sm'>Financial Impact of Fraud Cases</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {pieChartData.length > 0 ? (
            <motion.div
              key={pieChartData.length}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    startAngle={90}
                    endAngle={-270}
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ₹${value} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 py-10">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
