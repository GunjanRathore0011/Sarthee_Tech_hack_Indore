import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { MdOutlineReport, MdOutlineAnalytics, MdOutlinePerson, MdOutlineMap, MdOutlineHandshake } from 'react-icons/md';
import shieldIcon from '../../assets/images/logo.png';
import AdminDashboardStats from './AdminDashboardStats';
import AdminNotifications from './AdminNotifications';
import { RiMapPinLine } from 'react-icons/ri';
import { GiNetworkBars } from 'react-icons/gi';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  // Utility to check active route
  const isActive = (path) => location.pathname === path;
 
  return (
    <>
      <div>
        {/* Top Admin Header */}
        <nav className="bg-white text-black border-b shadow-md border-gray-200 py-4 px-8 flex justify-between items-center">
          {/* Left: Logo + Title */}
          <div className="flex items-center space-x-4">
            <img
              src={shieldIcon}
              alt="Logo"
              className="h-10 w-10 cursor-pointer"
              onClick={() => navigate('/complaint-management')}
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wide text-blue-600">
                CyberSentinel
              </span>
              <span className="text-sm text-gray-400 -mt-1">
                Admin Control Panel
              </span>
            </div>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center space-x-8 text-xl">
            <AdminNotifications />
            <Link to="/admin-profile" title="Profile">
              <FiUser className="hover:text-blue-600 transition duration-150" />
            </Link>
            <button onClick={handleLogout} title="Logout">
              <FiLogOut className="hover:text-red-500 transition duration-150 cursor-pointer" />
            </button>
          </div>
        </nav>

        {/* Bottom Navigation Menu */}
        <div className="bg-white shadow-md text-black border-b border-gray-200 px-10 py-5 flex space-x-10">
          <Link
            to="/complaint-management"
            className={`flex items-center  space-x-2 transition ${
              isActive('/complaint-management') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }`}
          >
            <MdOutlineReport className="text-lg" />
            <span>Complaints</span>
          </Link>

          <Link
            to="/admin-analytics"
            className={`flex items-center space-x-2 transition ${
              isActive('/admin-analytics') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }`}
          >
            <MdOutlineAnalytics className="text-lg" />
            <span>Analytics</span>
          </Link>

          <Link
            to="/officer-management"
            className={`flex items-center space-x-2 transition ${
              isActive('/officer-management') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }`}
          >
            <MdOutlinePerson className="text-lg" />
            <span>Officers</span>
          </Link>

          <Link
            to="/crime-map"
            className={`flex items-center space-x-2 transition ${
              isActive('/crime-map') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }`}
          >
            <RiMapPinLine className="text-lg" />
            <span>Crime Map</span>
          </Link>

          <Link
            to="/pattern-alert"
            className={`flex items-center space-x-2 transition ${
              isActive('/pattern-alert') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }`}
          >
            <GiNetworkBars className="text-lg" />
            <span>Pattern</span>
          </Link>

          <Link
            to="/admin/platform-coordination"
            className={`flex items-center space-x-2 transition ${
              isActive('/admin/platform-coordination') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }`}
          >
            <MdOutlineHandshake className="text-lg" />
            <span>Platform Coordination</span>
          </Link>
        </div>
      </div>

      <AdminDashboardStats />
    </>
  );
};

export default AdminNavbar;
