import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiSettings } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineReport } from 'react-icons/md';
import shieldIcon from '../../assets/images/logo.png'; // Adjust path if needed
import OfficerDashboardStats from './OfficerDashboardStats';
import OfficerNotifications from './OfficerNotifications';

const OfficerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logout logic
    navigate('/login');
  };
  const isActive = (path) => location.pathname === path;

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
            onClick={() => navigate('officer-complaint-management')}
          />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wide text-blue=600">
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

          <OfficerNotifications/>

          <Link to="/officer-settings" title="Settings">
            <FiSettings className="hover:text-blue-600 transition duration-150" />
          </Link>

          <button onClick={handleLogout} title="Logout">
            <FiLogOut className="hover:text-red-500 transition duration-150 cursor-pointer" />
          </button>
        </div>
      </nav>

      {/* Bottom Navigation Menu */}
              <div className="bg-white shadow-md text-black border-b border-gray-200 px-10 py-5 flex space-x-10">
                
      
                <Link
                  to="/officer-complaint-management"
                  className={`flex items-center space-x-2 transition ${
                    isActive('/officer-complaint-management') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
                  }`}
                >
                  <span>Cases</span>
                </Link>
      
                <Link
                  to='/platform-coordination'
                  className={`flex items-center space-x-2 transition ${
                    isActive('/platform-coordination') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
                  }`}
                >
                  <span>Platform Coordination</span>
                </Link>
      
                <Link
                  to="/suspect-tracker"
                  className={`flex items-center space-x-2 transition ${
                    isActive('/suspect-tracker') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
                  }`}
                >
                  <span>Suspect Tracker</span>
                </Link>
      
              </div>

      <OfficerDashboardStats />

    </div>
  );
};

export default OfficerNavbar;
