import React, { useState } from "react";
import FindUsingIP from "../OfficerDashboard/FindUsingIP";
import FindUsingNo from "../OfficerDashboard/FindUsingNo";
import ScamDetector from "@/component/ScamDetector";
import Scanlink from "./Scanlink";

function FindDetailsPage() {
  const [activeTab, setActiveTab] = useState("phone"); // phone | ip

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        Find Details Quickly
      </h1>

      {/* Tab Switcher */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("phone")}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === "phone"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
        >
          📱 Phone Number
        </button>
        <button
          onClick={() => setActiveTab("ip")}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === "ip"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
        >
          🌐 IP Address
        </button>
         <button
          onClick={() => setActiveTab("scan")}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === "scan"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
        >
          🔗Scan link
           </button>
      </div>

      {/* Render Component Based on Tab */}
      <div className="w-full">
        {activeTab === "phone" && <FindUsingNo /> }
        {activeTab ==="ip" && <FindUsingIP />}
        {activeTab==="scan" && <Scanlink/>}

      </div>
    </div>
  );
}

export default FindDetailsPage;
