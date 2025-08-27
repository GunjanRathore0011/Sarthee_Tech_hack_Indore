import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { MdOutlineReport, MdOutlineAnalytics, MdOutlinePerson, MdOutlineMap, MdOutlineHandshake, MdFeedback } from 'react-icons/md';
import shieldIcon from '../../assets/images/logo.png';
import AdminDashboardStats from './AdminDashboardStats';
import AdminNotifications from './AdminNotifications';
import { RiMapPinLine } from 'react-icons/ri';
import { GiNetworkBars } from 'react-icons/gi';
import { logout } from '@/ReduxSlice/user/userSlice';
import { useDispatch } from 'react-redux';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Utility to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div>
         <div className="w-full bg-blue-900 text-white text-xs">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-1">
                    {/* Left: Govt Name */}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">मध्यप्रदेश शासन</span>
                        <span className="border-l border-white h-4"></span>
                        <span className="font-semibold">Government of Madhya Pradesh</span>
                    </div>

                </div>
            </div>
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
        <div className="bg-gradient-to-r from-[#0473fb] to-[#0b3f98] shadow-md text-white border-b border-gray-200 px-10 py-5 flex space-x-10">

          <Link
            to="/complaint-management"
            className={`flex items-center space-x-2 transition ${isActive('/complaint-management')
                ? ' font-semibold '
                : 'hover: hover:underline'
              }`}
          >
            <MdOutlineReport className="text-lg" />
            <span className='font-bold'>Complaints</span>
          </Link>

          <Link
            to="/admin-analytics"
            className={`flex items-center space-x-2 transition ${isActive('/admin-analytics')
                ? ' font-semibold '
                : 'hover: hover:underline'
              }`}
          >
            <MdOutlineAnalytics className="text-lg" />
            <span className='font-bold'>Analytics</span>
          </Link>

          <Link
            to="/officer-management"
            className={`flex items-center space-x-2 transition ${isActive('/officer-management')
                ? ' font-semibold '
                : 'hover: hover:underline'
              }`}
          >
            <MdOutlinePerson className="text-lg" />
            <span className='font-bold'>Officers</span>
          </Link>

          <Link
            to="/crime-map"
            className={`flex items-center space-x-2 transition ${isActive('/crime-map')
                ? ' font-semibold '
                : 'hover: hover:underline'
              }`}
          >
            <RiMapPinLine className="text-lg" />
            <span className='font-bold'> Crime Map</span>
          </Link>

          <Link
            to="/pattern-alert"
            className={`flex items-center space-x-2 transition ${isActive('/pattern-alert')
                ? ' font-semibold '
                : 'hover: hover:underline'
              }`}
          >
            <GiNetworkBars className="text-lg" />
            <span className='font-bold'>Pattern</span>
          </Link>

          <Link
            to="/feedback"
            className={`flex items-center space-x-2 transition  ${isActive('/feedback')
                ? ' font-semibold'
                : 'hover: hover:underline'
              }`}
          >
            <MdFeedback className="text-lg" />
            <span className='font-bold'>Feedback</span>
          </Link>

        </div>
      </div>

      <AdminDashboardStats />
    </>
  );
};

export default AdminNavbar;
