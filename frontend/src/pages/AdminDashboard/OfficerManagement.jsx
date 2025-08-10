"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mail, Briefcase, Users, Star, Activity } from "lucide-react";
import { AddOfficerModal } from "@/component/OfficerComponent/AddOfficerModal";
import axios from "axios";

const OfficerManagement = () => {
  const [officers, setOfficers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch officer data from backend

  const fetchOfficerData = async () => {
    try {
      console.log("Fetching officer data...");

      const response = await axios.get("http://localhost:4000/api/v1/admin/suggestInvestigator");

      console.log("Fetched officer data:", response.data.data);

      // ✅ Ensure data is array before setting
      if (Array.isArray(response.data.data)) {
          setOfficers(response.data.data);
        }

      else {
        console.error("Invalid officer data format:", response.data.data);
        setOfficers([]);
      }
    } catch (error) {
      console.error("Error fetching officer data:", error);
    }
  };


  useEffect(() => {
    fetchOfficerData();
  }, []);

  // Add new officer to the list
  const handleAddOfficer = (officer) => {
    const newOfficer = {
      id: Date.now(), // or generate some temporary ID
      name: officer.name,
      email: officer.email,
      status: officer.availability,
      activeCases: officer.activeCases,
      performance: officer.performanceScore,
      specializations: officer.specialistIn || [],
    };
    setOfficers((prev) => [newOfficer, ...prev]);
  };

  const totalOfficers = officers.length;
  const available = officers.filter((o) => o.status === "Free").length;
  const totalActiveCases = officers.reduce((sum, o) => sum + o.activeCases, 0);
  const avgPerformance =
    totalOfficers > 0
      ? Math.round(officers.reduce((sum, o) => sum + o.performance, 0) / totalOfficers)
      : 0;

  const statusColor = {
    Free: "bg-green-500 text-black",
    Busy: "bg-yellow-400 text-black",
  };

  return (
    <>
      <div className="p-6 space-y-6 text-black">
        {/* Top Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bf border">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-800">
                <span>Total Officers</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-semibold text-black">{totalOfficers}</div>
            </CardContent>
          </Card>

          <Card className="bf border">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Available</span>
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-semibold text-green-400">{available}</div>
            </CardContent>
          </Card>

          <Card className="bf border">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Active Cases</span>
                <Briefcase className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="text-2xl font-semibold text-yellow-300">{totalActiveCases}</div>
            </CardContent>
          </Card>

          <Card className="bf border">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Avg Performance</span>
                <Star className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-semibold text-blue-400">{avgPerformance}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Directory Header */}
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-xl font-semibold">Officer Directory</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-black"
          >
            👤 Add Officer
          </Button>
        </div>

        {/* Officer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officers.map((officer) => (
            <Card key={officer.id} className="shadow-md border border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {officer.name ? officer.name.split(" ").map(n => n[0]).join("").slice(0,3).toUpperCase() : ""}

                  </div>
                  <div>
                    <div>{officer.name}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {officer.email}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>
                    Status:{" "}
                    <Badge className={statusColor[officer.status] || "bg-gray-300"}>
                      {officer.status}
                    </Badge>
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    Active Cases: {officer.activeCases}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span>Performance Score</span>
                    <span className="text-blue-600 font-medium">
                      {officer.performance}%{" "}
                      <span className="text-xs text-gray-500">
                        ({officer.performance >= 90 ? "Excellent" : "Good"})
                      </span>
                    </span>
                  </div>
                  <Progress value={officer.performance} className="h-2 mt-1" />
                </div>

                <div className="text-sm">
                  <span className="block font-medium mb-1">Specializations:</span>
                  <div className="flex flex-wrap gap-2">
                    {officer.specializations?.map((spec, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Officer Modal */}
      <AddOfficerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddOfficer={handleAddOfficer}
      />
    </>
  );
};

export default OfficerManagement;
