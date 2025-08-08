import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiSettings } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineReport } from 'react-icons/md';
import shieldIcon from '../../assets/images/logo.png'; // Adjust path if needed
import OfficerDashboardStats from './OfficerDashboardStats';

const OfficerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logout logic
    navigate('/login');
  };

  return (
    <div>
      {/* Top Officer Header */}
      <nav className="bg-white text-black border-b shadow-md border-gray-200 py-4 px-8 flex justify-between items-center">
        {/* Left: Logo + Title */}
        <div className="flex items-center space-x-4">
          <img
            src={shieldIcon}
            alt="Logo"
            className="h-10 w-10 cursor-pointer"
            onClick={() => navigate('/officer-dashboard')}
          />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wide text-blue-600">
              CyberSentinel
            </span>
            <span className="text-sm text-gray-400 -mt-1">
              Officer Investigation Panel
            </span>
          </div>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center space-x-8 text-xl">
          <Link to="/officer-rule-book" title="Rule Book" className="text-sm flex items-center space-x-1 hover:text-blue-600 transition">
            <HiOutlineDocumentText className="text-lg" />
            <span>Rule Book</span>
          </Link>

          <Link to="/officer-notifications" title="Notifications">
            <FiBell className="hover:text-blue-600 transition duration-150" />
          </Link>

          <Link to="/officer-settings" title="Settings">
            <FiSettings className="hover:text-blue-600 transition duration-150" />
          </Link>

          <button onClick={handleLogout} title="Logout">
            <FiLogOut className="hover:text-red-500 transition duration-150 cursor-pointer" />
          </button>
        </div>
      </nav>

      <OfficerDashboardStats />

    </div>
  );
};

export default OfficerNavbar;
