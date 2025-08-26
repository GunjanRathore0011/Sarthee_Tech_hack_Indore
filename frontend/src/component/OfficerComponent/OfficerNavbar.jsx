import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiSettings } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineReport } from 'react-icons/md';
import shieldIcon from '../../assets/images/logo.png';
import OfficerNotifications from './OfficerNotifications';
import { logout } from '@/ReduxSlice/user/userSlice';
import { useDispatch } from 'react-redux';

const OfficerNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    // Logout logic
    dispatch(logout());

    navigate('/login');
  };
  const isActive = (path) => location.pathname === path;

  return (
    <div>

       <div className="w-full bg-blue-900 text-white text-xs">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-1">
                    {/* Left: Govt Name */}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">मध्यप्रदेश शासन</span>
                        <span className="border-l border-white h-4"></span>
                        <span className="font-semibold">Government of Madhya Pradesh</span>
                    </div>

                    {/* Right utilities (language / accessibility / login) */}
                    <div className="flex gap-4 items-center">
                        <button className="hover:underline">हिन्दी</button>
                        <button className="hover:underline">English</button>

                    </div>
                </div>
            </div>
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
          <a
            href="https://res.cloudinary.com/dqamfp6o9/image/upload/v1755624416/evidence/complaint_report_1755624414763.pdf" // <-- your Cloudinary link here
            target="_blank"
            rel="noopener noreferrer"
            title="Rule Book"
            className="text-sm flex items-center space-x-1 hover:text-blue-600 transition"
          >
            <HiOutlineDocumentText className="text-lg" />
            <span>Rule Book</span>
          </a>


          <OfficerNotifications />

          <Link to="/officer-settings" title="Settings">
            <FiSettings className="hover:text-blue-600 transition duration-150" />
          </Link>

          <button onClick={handleLogout} title="Logout">
            <FiLogOut className="hover:text-red-500 transition duration-150 cursor-pointer" />
          </button>
        </div>
      </nav>

      {/* Bottom Navigation Menu */}
      <div className="bg-gradient-to-r from-[#0473fb] to-[#0b3f98] shadow-md text-white border-b border-gray-200 px-10 py-5 flex space-x-10">

        <Link
          to="/officer-complaint-management"
          className={`flex items-center space-x-2 transition ${isActive('/officer-complaint-management')
              ? ' font-semibold underline'   // active link style
              : 'hover:text-yellow-300 hover:underline'     // hover style
            }`}
        >
          <span className='font-bold'>Cases</span>
        </Link>

        <Link
          to="/suspect-tracker"
          className={`flex items-center space-x-2 transition ${isActive('/suspect-tracker')
              ? ' font-semibold underline'
              : 'hover:text-yellow-300 hover:underline'
            }`}
        >
          <span className='font-bold'>Suspect Tracker</span>
        </Link>

        <Link
          to="/findUsing"
          className={`flex items-center space-x-2 transition ${isActive('/findUsing')
              ? ' font-semibold underline'
              : 'hover:text-yellow-300 hover:underline'
            }`}
        >
          <span className='font-bold'>FindUsing</span>
        </Link>

      </div>


    </div>
  );
};

export default OfficerNavbar;
