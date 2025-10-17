import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTimes,
} from "react-icons/fa";

interface MenuItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { path: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/adminUser", icon: <FaUsers />, label: "Users" },
    { path: "/adminOrganiser", icon: <FaUserTie />, label: "Organisers" },
    { path: "/admin/events", icon: <FaCalendarAlt />, label: "Events" },
    { path: "/admin/venues", icon: <FaMapMarkerAlt />, label: "Venues" },
    { path: "/admin/bookings", icon: <FaTicketAlt />, label: "Bookings" },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex fixed min-h-screen w-64 bg-[#1a2634] text-white overflow-y-auto flex-col transition-all duration-300">
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

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a2634] text-white z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-lg font-semibold">Admin Menu</span>
          <button onClick={onClose} className="text-white text-2xl">
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
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

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
