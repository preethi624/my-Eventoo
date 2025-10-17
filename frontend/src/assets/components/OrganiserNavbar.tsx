// OrganiserNavbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices";
import targetLogo from "../images/target_3484438 (2).png";
import { FaBars } from "react-icons/fa";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

const OrganiserNavbar: React.FC<NavbarProps> = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const organiserName = localStorage.getItem("organiserName");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 flex justify-between items-center z-50">
      {/* Hamburger menu for small screens */}
      <button
        className="md:hidden text-gray-700 mr-2"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars size={24} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={targetLogo} alt="Logo" className="h-6 w-6" />
        <span className="text-xl font-bold text-gray-800">EVENTOO</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600 hidden sm:inline">{organiserName}</span>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline hover:text-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default OrganiserNavbar;
