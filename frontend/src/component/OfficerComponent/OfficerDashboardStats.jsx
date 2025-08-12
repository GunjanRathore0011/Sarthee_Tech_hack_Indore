import React, { useEffect } from 'react';
import { FaSuitcase, FaPlay, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';

const OfficerDashboardStats = () => {

  const currentUser = useSelector((state) => state.user);
  const investigatorId = currentUser.user.additionDetails;
  const [activeCases, setActiveCases] = useState();
  const [resolvedCases, setResolvedCases] = useState();

    const fetchAssignedCases = async () => {
        try {
            
            const res = await fetch(`http://localhost:4000/api/v1/investigator/allAssignedCases/${investigatorId}`);
            const result = await res.json();
            // console.log('Assigned Cases Response:', result.activeCases);

            if (result.success) {
                setActiveCases(result.activeCases.length);
                setResolvedCases(result.resolvedCases.length);
            }
        } catch (error) {
            toast.error('Error fetching assigned cases:', error);
        }
    };

    useEffect(() => {
        fetchAssignedCases();
    }, []);

  const stats = [
    {
      label: "Active Cases",
      value: activeCases,
      icon: <FaSuitcase className="text-blue-600 text-2xl" />,
    },
    {
      label: "Investigating",
      value: 1,
      icon: <FaPlay className="text-yellow-500 text-2xl" />,
    },
    {
      label: "Resolved",
      value: resolvedCases,
      icon: <FaCheckCircle className="text-green-600 text-2xl" />,
    },
    {
      label: "Pending Actions",
      value: 0,
      icon: <FaClock className="text-red-500 text-2xl" />,
    },
  ];

  const cardClass =
    "bg-white shadow-md border border-gray-200 rounded-lg p-6 flex items-center justify-between w-full sm:w-[22%]";

  return (
    <div className="w-full bg-gray-100 px-10 py-6">
      <div className="flex flex-wrap gap-6 justify-between">
        {stats.map((stat, idx) => (
          <div key={idx} className={cardClass}>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
              <span className="text-2xl font-bold text-black">{stat.value}</span>
            </div>
            <div className="p-3 bg-gray-100 rounded-md">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficerDashboardStats;
