import React from 'react';
import type { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/adminSlices';
import { useNavigate } from 'react-router-dom';


import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/adminLogin');
  };

  return (
    <div>
      <AdminNavbar email="admin@gmail.com" onLogout={handleLogout} />
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
