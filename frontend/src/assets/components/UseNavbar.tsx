<<<<<<< HEAD
import React, { useRef, useState } from "react";
=======
import React, { useRef } from "react";
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../redux/slices/authSlices";
import type { AppDispatch, RootState } from "../../redux/stroe";
import targetLogo from "../images/target_3484438 (2).png";

<<<<<<< HEAD
=======

>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
export interface CustomJwtPayload {
  name?: string;
  email?: string;
}

const UserNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
<<<<<<< HEAD
  const [menuOpen, setMenuOpen] = useState(false);
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  const handleLogout = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch(logout());
    navigate("/login");
  };

  const user = useSelector(
    (state: RootState) => state.auth.user as CustomJwtPayload
  );
  const username = user?.name || user?.email;
  const isLoggedin = !!user;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
<<<<<<< HEAD
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <img src={targetLogo} alt="Logo" className="h-6 w-6" />
          EVENTOO
        </Link>

        {/* Hamburger for small screens */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Links */}
        <div
          className={`flex-col md:flex-row md:flex gap-4 items-center absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 transition-all duration-300 ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
=======
       <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
  <img src={targetLogo} alt="Logo" className="h-6 w-6" />
  EVENTOO
</Link>
        <div className="flex items-center gap-4">
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            About Us
          </Link>
<<<<<<< HEAD
=======
          
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

          {isLoggedin && (
            <>
              <Link
                to="/my-bookings"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                MyOrders
              </Link>
              <Link
                to="/shows"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Shows & Events
              </Link>
              <Link
                to="/home"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/userTickets"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Tickets
              </Link>
              <Link
                to="/userChat"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Chat
              </Link>
<<<<<<< HEAD
              <Link
                to="/userNotifications"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Notifications
              </Link>
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

              <Link to={`/userProfile`}>
                <span className="text-sm font-semibold text-gray-800">
                  👤 {username}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
