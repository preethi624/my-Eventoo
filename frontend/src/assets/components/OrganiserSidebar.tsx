import React from "react";

import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaUsers,
  FaSignInAlt,
} from "react-icons/fa";

const links = [
  { to: "/organiserProfile", icon: <FaCalendarAlt />, label: "Profile" },

  { to: "/dashboard", icon: <FaCalendarAlt />, label: "Dashboard" },
  { to: "/orgEvents", icon: <FaCalendarAlt />, label: "Events" },
  { to: "/orgVenues", icon: <FaCalendarAlt />, label: "Venues" },

  { to: "/organiserBookings", icon: <FaTicketAlt />, label: "Bookings" },

  { to: "/organiserAttendees", icon: <FaUsers />, label: "Attendees" },

  { to: "/checkin", icon: <FaSignInAlt />, label: "Checkin" },
  { to: "/chat", icon: <FaUsers />, label: "Chat" },
<<<<<<< HEAD
  { to: "/orgNotifications", icon: <FaUsers />, label: "Notifications" },
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
];

const OrganiserSidebar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-[250px] bg-gray-800 text-white">
      <nav className="flex flex-col mt-0">
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 px-5 py-3 text-white hover:bg-gray-700 transition"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
export default OrganiserSidebar;
