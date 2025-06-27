import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, Calendar, DollarSign, TrendingUp, Activity, Eye, UserCheck, AlertTriangle } from 'lucide-react';
import { adminRepository } from '../../repositories/adminRepositories';
import AdminLayout from '../components/AdminLayout';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [monthlyRevenue,setMonthlyRevenue]=useState<{
  month: number;
  revenue: number;
  events: number;
}[]>([])
const [topEvents,setTopEvents]=useState<{title:string;
  revenue:number;
  ticketsSold:number
}[]>([])
  useEffect(()=>{
    fetchEvents()

  },[])
  const fetchEvents=async()=>{
    const response=await adminRepository.getDashboard();
    if(!response||!response.monthlyRevenue||!response.topEvents){
      throw new Error("monthly revenue not present")
    }
    console.log("reee",response);
    

   
    setMonthlyRevenue(response.monthlyRevenue);
    setTopEvents(response.topEvents

    )
  
    
    
  }

 
 
  

  const eventCategories = [
    { name: 'Music', value: 35, color: '#8B5CF6' },
    { name: 'Sports', value: 25, color: '#06B6D4' },
    { name: 'Technology', value: 20, color: '#10B981' },
    { name: 'Food', value: 12, color: '#F59E0B' },
    { name: 'Arts', value: 8, color: '#EF4444' }
  ];

  const userGrowth = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1500 },
    { month: 'Mar', users: 1800 },
    { month: 'Apr', users: 2200 },
    { month: 'May', users: 2800 },
    { month: 'Jun', users: 3200 }
  ];

  const recentTransactions = [
    { id: '001', user: 'John Doe', event: 'Tech Conference 2024', amount: 150, status: 'Completed' },
    { id: '002', user: 'Sarah Smith', event: 'Music Festival', amount: 85, status: 'Pending' },
    { id: '003', user: 'Mike Johnson', event: 'Food Fair', amount: 45, status: 'Completed' },
    { id: '004', user: 'Emily Brown', event: 'Art Exhibition', amount: 25, status: 'Failed' },
    { id: '005', user: 'David Wilson', event: 'Sports Tournament', amount: 120, status: 'Completed' }
  ];

  /*const topEvents = [
    { name: 'Tech Conference 2024', tickets: 450, revenue: 67500 },
    { name: 'Summer Music Festival', tickets: 320, revenue: 27200 },
    { name: 'Food & Wine Expo', tickets: 280, revenue: 12600 },
    { name: 'Digital Marketing Summit', tickets: 195, revenue: 29250 },
    { name: 'Startup Pitch Night', tickets: 150, revenue: 7500 }
  ];*/

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$123,500" icon={DollarSign} trend={12.5} color="green" />
        <StatCard title="Active Events" value="156" icon={Calendar} trend={8.2} color="blue" />
        <StatCard title="Total Users" value="3,247" icon={Users} trend={15.3} color="purple" />
        <StatCard title="Monthly Growth" value="24.8%" icon={TrendingUp} trend={5.1} color="orange" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue & Events</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.event}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      {/* Top Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Events</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">#{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{event.name}</h4>
                    <p className="text-sm text-gray-500">{event.tickets} tickets sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${event.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Performance Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEvents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="tickets" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
    <AdminLayout>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Event Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 bg-white rounded-t-xl mt-6">
          <nav className="-mb-px flex space-x-8 px-6">
            {['overview', 'transactions', 'events'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 border-t-0 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'transactions' && renderTransactions()}
          {activeTab === 'events' && renderEvents()}
        </div>
      </div>
      </AdminLayout>
    </div>
  );
};

export default AdminDashboard;