// src/components/AdminNavbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { MdOutlineReport, MdOutlineAnalytics, MdOutlinePerson, MdOutlineMap } from 'react-icons/md';
import shieldIcon from '../../assets/images/logo.png'; // Adjust path as needed
import AdminDashboardStats from './AdminDashboardStats';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  return (
    <>
    
    <div>
      {/* Top Admin Header */}
      <nav className="bg-white text-black border-b shadow-md border-gray-200  py-4 px-8 flex justify-between items-center">
        {/* Left: Logo + Title */}
        <div className="flex items-center space-x-4">
          <img
            src={shieldIcon}
            alt="Logo"
            className="h-10 w-10 cursor-pointer"
            onClick={() => navigate('/admin-dashboard')}
          />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wide text-blue=600 ">
              CyberSentinel
            </span>
            <span className="text-sm text-gray-400 -mt-1">
              Admin Control Panel
            </span>
          </div>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center space-x-8 text-xl">
          <Link to="/notifications" title="Notifications">
            <FiBell className="hover:text-blue-600 transition duration-150" />
          </Link>
          <Link to="/admin-profile" title="Profile">
            <FiUser className="hover:text-blue-600 transition duration-150" />
          </Link>
          <button onClick={handleLogout} title="Logout">
            <FiLogOut className="hover:text-red-500 transition duration-150 cursor-pointer" />
          </button>
        </div>
      </nav>

      {/* Bottom Navigation Menu */}
      <div className="bg-white shadow-md text-black border-b border-gray-200 px-10 py-3 flex space-x-10 ">
        <Link
          to="/complaint-management"
          className="flex items-center space-x-2 hover:text-blue-600 transition"
        >
          <MdOutlineReport className="text-lg" />
          <span>Complaints</span>
        </Link>

        <Link
          to="/admin-analytics"
          className="flex items-center space-x-2 hover:text-blue-600 transition"
        >
          <MdOutlineAnalytics className="text-lg" />
          <span>Analytics</span>
        </Link>

        <Link
          to="/officer-management"
          className="flex items-center space-x-2 hover:text-blue-600 transition"
        >
          <MdOutlinePerson className="text-lg" />
          <span>Officers</span>
        </Link>

        <Link
          to="/crime-map"
          className="flex items-center space-x-2 hover:text-blue-600 transition"
        >
          <MdOutlineMap className="text-lg" />
          <span>Crime Map</span>
        </Link>
      </div>
    </div>

    <AdminDashboardStats></AdminDashboardStats>
    </>
  );
};

export default AdminNavbar;
