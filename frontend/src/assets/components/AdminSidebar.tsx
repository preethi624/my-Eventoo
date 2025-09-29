<<<<<<< HEAD

=======
import React from "react";
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
<<<<<<< HEAD
  
=======
  FaChartBar,
  FaUserCircle,
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
} from "react-icons/fa";

interface MenuItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { path: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/adminUser", icon: <FaUsers />, label: "Users" },
    { path: "/adminOrganiser", icon: <FaUserTie />, label: "Organisers" },
    { path: "/admin/events", icon: <FaCalendarAlt />, label: "Events" },
    { path: "/admin/venues", icon: <FaMapMarkerAlt />, label: "Venues" },
    { path: "/admin/bookings", icon: <FaTicketAlt />, label: "Bookings" },
<<<<<<< HEAD
    
  ];

  return (
    <div className=" min-h-screen w-64 bg-[#1a2634] text-white">
=======
    { path: "/admin/reports", icon: <FaChartBar />, label: "Reports" },
    { path: "/admin/profile", icon: <FaUserCircle />, label: "Profile" },
  ];

  return (
    <div className="min-h-screen w-64 bg-[#1a2634] text-white">
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      <nav className="flex flex-col py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-5 py-3 transition-all duration-300 ${
              location.pathname === item.path
                ? "bg-[#2c3e50]"
                : "hover:bg-[#2c3e50]"
            }`}
          >
            <div className="mr-3 text-xl">{item.icon}</div>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
