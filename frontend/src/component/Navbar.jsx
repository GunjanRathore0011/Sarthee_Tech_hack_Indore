// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import logoImage from '../assets/images/logo.png';
import { logout } from "@/ReduxSlice/user/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access user from Redux
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white text-black py-4 px-8 shadow-md flex justify-around items-center border-b border-gray-200">
      <div className="text-2xl font-extrabold tracking-wide">
        <Link to="/">
          <img src={logoImage} alt="Logo" className="h-10 w-auto mx-auto" />
        </Link>
      </div>

      <div className="space-x-6 font-medium">
        <Link
          to="/complaints"
          className="hover:text-blue-600 hover:underline hover:underline-offset-4 pb-1 transition-all duration-150"
        >
          File Complaint
        </Link>
        <Link
          to="/track-status"
          className="hover:text-blue-600 hover:underline hover:underline-offset-4 pb-1 transition-all duration-150"
        >
          Track Status
        </Link>
        <Link
          to="/awareness"
          className="hover:text-blue-600 hover:underline hover:underline-offset-4 pb-1 transition-all duration-150"
        >
          Awareness
        </Link>
        <Link
          to="/contact-us"
          className="hover:text-blue-600 hover:underline hover:underline-offset-4 pb-1 transition-all duration-150"
        >
          Contact Us
        </Link>
      </div>

      <div className="font-medium">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            {/* <span className="text-sm text-gray-600">Hi, {user?.name || user?.email}</span> */}
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline hover:underline-offset-4 pb-1 transition-all duration-150"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="hover:text-blue-600 hover:underline hover:underline-offset-4 pb-1 transition-all duration-150"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
