import React from 'react';
import { FaUsers, FaUserTie, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';


interface DashboardStats {
  totalUsers: number;
  totalOrganisers: number;
  totalEvents: number;
  totalBookings: number;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode
  color: string;
}

const AdminDashboard: React.FC = () => {
  const stats: DashboardStats = {
  totalUsers: 0,
  totalOrganisers: 0,
  totalEvents: 0,
  totalBookings: 0,
};


  

  const statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers />,
      color: 'text-blue-500',
    },
    {
      title: 'Total Organisers',
      value: stats.totalOrganisers,
      icon: <FaUserTie />,
      color: 'text-green-500',
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: <FaCalendarAlt />,
      color: 'text-red-500',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaTicketAlt />,
      color: 'text-yellow-500',
    },
  ];

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:-translate-y-1 transition-transform"
          >
            <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
            <div className="text-right">
              <h3 className="text-2xl font-semibold">{stat.value}</h3>
              <p className="text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Recent Events</h4>
          {/* Content goes here */}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Latest Bookings</h4>
          {/* Content goes here */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
