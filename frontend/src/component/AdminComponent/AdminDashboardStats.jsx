// src/components/AdminDashboardStats.jsx
import React, { useState } from 'react';
import { FaShieldAlt, FaCheckCircle, FaClock, FaExclamationTriangle, FaHourglassHalf } from 'react-icons/fa';

const AdminDashboardStats = () => {
  const [stats, setStats] = useState({
    totalComplaints: 156,
    resolvedCases: 124,
    pendingCases: 18,
    highPriority: 14,
    avgResolutionTime: '2d 6h',
  });

  const cardClass = "bg-white shadow-md border border-gray-200 rounded-lg p-6 flex items-center justify-between w-full sm:w-[17%]";

  const cards = [
    {
      label: "Total Complaints",
      value: stats.totalComplaints,
      icon: <FaShieldAlt className="text-blue-600 text-2xl" />,
    },
    {
      label: "Resolved Cases",
      value: stats.resolvedCases,
      icon: <FaCheckCircle className="text-green-600 text-2xl" />,
    },
    {
      label: "Pending Cases",
      value: stats.pendingCases,
      icon: <FaClock className="text-yellow-500 text-2xl" />,
    },
    {
      label: "High Priority",
      value: stats.highPriority,
      icon: <FaExclamationTriangle className="text-red-500 text-2xl" />,
    },
    {
      label: "Avg Resolution Time",
      value: stats.avgResolutionTime,
      icon: <FaHourglassHalf className="text-indigo-500 text-2xl" />,
    },
  ];

  return (
    <div className="w-full bg-gray-50 px-10 py-6">
      <div className="flex flex-wrap gap-6 justify-between">
        {cards.map((card, idx) => (
          <div key={idx} className={cardClass}>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium">{card.label}</span>
              <span className="text-2xl font-bold text-black">{card.value}</span>
            </div>
            <div className="p-3 bg-gray-100 rounded-md">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardStats;
