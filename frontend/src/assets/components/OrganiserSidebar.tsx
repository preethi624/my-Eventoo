// OrganiserSidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaTicketAlt, FaUsers, FaSignInAlt, FaTimes } from "react-icons/fa";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const links = [
  { to: "/organiserProfile", icon: <FaCalendarAlt />, label: "Profile" },
  { to: "/dashboard", icon: <FaCalendarAlt />, label: "Dashboard" },
  { to: "/orgEvents", icon: <FaCalendarAlt />, label: "Events" },
  { to: "/orgVenues", icon: <FaCalendarAlt />, label: "Venues" },
  { to: "/organiserBookings", icon: <FaTicketAlt />, label: "Bookings" },
  { to: "/organiserAttendees", icon: <FaUsers />, label: "Attendees" },
  { to: "/checkin", icon: <FaSignInAlt />, label: "Checkin" },
  { to: "/chat", icon: <FaUsers />, label: "Chat" },
  { to: "/orgNotifications", icon: <FaUsers />, label: "Notifications" },
];

const OrganiserSidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white z-50 transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        {/* Close button for mobile */}
        <div className="flex justify-end md:hidden p-4">
          <button onClick={() => setOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="flex flex-col mt-10">
          {links.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-5 py-3 text-white hover:bg-gray-700 transition"
              onClick={() => setOpen(false)} // close on link click in mobile
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default OrganiserSidebar;
