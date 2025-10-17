import { useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/adminSlices";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminLogin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <AdminNavbar
        email="admin@gmail.com"
        onLogout={handleLogout}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 transition-all duration-300 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
