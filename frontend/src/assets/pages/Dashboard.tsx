import React from 'react';
import { FaCalendarAlt, FaTicketAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import OrganiserLayout from '../components/OrganiserLayout';


const Dashboard: React.FC = () => {
  return (
    <OrganiserLayout>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-4 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">12</h2>
              <p className="text-gray-500">Total Events</p>
            </div>
            <FaCalendarAlt className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">458</h2>
              <p className="text-gray-500">Tickets Sold</p>
            </div>
            <FaTicketAlt className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">289</h2>
              <p className="text-gray-500">Total Attendees</p>
            </div>
            <FaUsers className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">₹45K</h2>
              <p className="text-gray-500">Revenue</p>
            </div>
            <FaChartLine className="text-blue-600 text-3xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 md:col-span-2">
          <h4 className="text-lg font-semibold mb-2">Upcoming Events</h4>
          {/* Add upcoming events table or list here */}
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h4 className="text-lg font-semibold mb-2">Recent Activity</h4>
          {/* Add recent activity list here */}
        </div>
      </div>
      </OrganiserLayout>
   
  );
};

export default Dashboard;
