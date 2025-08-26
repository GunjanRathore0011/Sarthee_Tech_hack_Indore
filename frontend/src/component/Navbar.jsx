// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logoImage from "../assets/images/logo.png";
import { logout } from "@/ReduxSlice/user/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access user from Redux
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-[#0473fb] to-[#042c70] text-white py-4 px-8 shadow-md w-full z-50 border-b border-gray-200">

      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO + BRAND */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImage} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-white tracking-wide">
            CyberSentinel
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link
            to="/complaints"
            className="hover:underline transition-colors text-lg"
          >
            File Complaint
          </Link>
          <Link
            to="/track-status"
            className="hover:underline transition-colors text-lg"
          >
            Track Status
          </Link>
          <Link
            to="/awareness"
            className="hover:underline transition-colors text-lg"
          >
            Awareness
          </Link>
          <Link
            to="/contact-us"
            className="hover:underline transition-colors text-lg"
          >
            Contact Us
          </Link>
          <Link to="/scan" className="hover:underline transition-colors text-lg">
            Scan
          </Link>


          {/* AUTH BUTTONS */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className=" text-white underline px-4 py-2 rounded-full text-md font-semibold hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className=" text-white px-4 underline rounded-full text-xl font-semibold hover:opacity-90 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>


      </div>
    </nav>
  );
};

export default Navbar;
