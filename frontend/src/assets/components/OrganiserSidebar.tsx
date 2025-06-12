import React from 'react';

import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
 
  FaTicketAlt,
  FaChartBar,
  FaUsers,
  FaCog,
} from 'react-icons/fa';

const links = [
   { to: '/organiserProfile', icon: <FaCalendarAlt />, label: 'Profile' },

  { to: '/dashboard', icon: <FaCalendarAlt />, label: 'Dashboard' },
  { to: '/orgEvents', icon: <FaCalendarAlt />, label: 'Events' },
 
  { to: '/tickets', icon: <FaTicketAlt />, label: 'Tickets' },
   { to: '/organiserBookings', icon: <FaTicketAlt />, label: 'Bookings' },

  { to: '/analytics', icon: <FaChartBar />, label: 'Analytics' },
  { to: '/attendees', icon: <FaUsers />, label: 'Attendees' },
  { to: '/settings', icon: <FaCog />, label: 'Settings' },
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
