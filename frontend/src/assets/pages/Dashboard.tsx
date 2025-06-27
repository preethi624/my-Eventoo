import React, { useEffect, useState, type FC } from 'react';
import { unparse } from 'papaparse';

import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
   PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Calendar, 
  Users, 
  
  TrendingUp, 
  MapPin, 
  Clock,
  
  Download,
  
  IndianRupee
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/stroe';
import type { CustomJwtPayload } from '../../interfaces/IUser';
import { organiserRepository } from '../../repositories/organiserRepositories';
import { eventRepository } from '../../repositories/eventRepositories';
import type { IEventDTO } from '../../interfaces/IEvent';
import OrganiserLayout from '../components/OrganiserLayout';
import type { IconType } from 'react-icons/lib';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType; 
}

const Dashboard = () => {
     const organiser= useSelector((state: RootState) => state.auth.organiser as CustomJwtPayload );
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [adminPercentage,setAdminPercentage]=useState(0)
  const[revenueData,setRevenueData]=useState([])
 const[organiserData,setOrganiserData]=useState({
     name:"",
     location:"",
     email:"",
     phone:0,
     aboutMe:""
 
 
   });
   const [organiserEarning,setOrganiserEarning]=useState(0);
   const[totalEvents,setTotalEvents]=useState(0);
   const [totalAttendees,setTotalAttendees]=useState(0)
   const [profileImage, setProfileImage] = useState(organiser?.profileImage || '');
   const [events, setEvents] = useState<IEventDTO[]>([]);
   const [topEvents,setTopEvents]=useState<IEventDTO[]>([]);
   const [upcomingEvents,setUpcomingEvents]=useState<IEventDTO[]>([])
  // Current organizer context (replace with actual user data from your auth system)

   const fetchOrganiser=async()=>{
    const response=await organiserRepository.getOrganiserById(organiser.id);
   
    
     setOrganiserData(response.result.result);
   setProfileImage(response.result.result.profileImage)

   }
   const fetchEvents=async(timeFrame:string)=>{
    const response=await eventRepository.getDashboardEvents(organiser.id,timeFrame);
    console.log("respoo",response);
    
 
    
    setEvents(response.data.events)
    setRevenueData(response.data.data);
    setOrganiserEarning(response.data.organiserEarning)
    setAdminPercentage(response.data.adminPercentage);
    setTotalEvents(response.data.totalEvents);
    setTotalAttendees(response.data.totalAttendees);
    setTopEvents(response.data.topEvents);
    setUpcomingEvents(response.data.upcomingEvents)


   }
   
   useEffect(()=>{
    fetchOrganiser()
    fetchEvents(selectedTimeframe);
   

   },[selectedTimeframe])
 
  
  
  

   const exportToCSV = (data: any[] ,filename: string) => {
  const csv = unparse(data); 
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.click();
};
 
 
  
  

 
  

  // Event type distribution for organizer's events
  const eventTypeCounts = events.reduce((acc: Record<string, number>, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  const eventTypeData = Object.entries(eventTypeCounts).map(([type, count], index) => ({
    name: type,
    value: Math.round((count / totalEvents) * 100),
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
  }));

  

  
  

 

  const StatCard:FC<StatCardProps> = ({ title, value,  icon: Icon }) => (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
         
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <OrganiserLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center">
            <img 
               src={profileImage?`http://localhost:3000/uploads/${profileImage}`: 'https://dummyimage.com/128x128/cccccc/ffffff&text=Organiser'} 

              alt={organiserData.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg mr-4"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">My Events Dashboard</h1>
              <p className="text-gray-600">Welcome back, {organiserData.name}! Here are your event insights.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Events Created</p>
              <p className="text-2xl font-bold text-blue-600">{totalEvents}</p>
            </div>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center" onClick={() => exportToCSV(revenueData, "dashboard_report")}>
              
              <Download size={16} className="mr-2" />
              Export My Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="My Total Events" 
            value={totalEvents.toString()} 
            
            icon={Calendar} 
            
          />
          <StatCard 
            title="Total Attendees" 
            value={totalAttendees.toLocaleString()} 
           
            icon={Users} 
        
          />
          <StatCard 
            title="My Revenue" 
            value={`₹${(organiserEarning ).toFixed(1)}`} 
           
            icon={IndianRupee} 
            
          />
          
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">My Revenue Overview</h3>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Revenue from my events</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Event Types */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">My Event Types</h3>
            {eventTypeData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {eventTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {eventTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No events created yet</p>
                  <p className="text-sm">Create your first event to see analytics</p>
                </div>
              </div>
            )}
          </div>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">My Upcoming Events</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar size={14} className="mr-1" />
                      <span>{event.date.toString()}</span>
                      <Clock size={14} className="ml-3 mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin size={14} className="mr-1" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    
                    <div className="text-sm text-green-600 font-medium">₹{(event.ticketPrice).toLocaleString()}</div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No upcoming events</p>
                  <p className="text-sm">Create your next event to see it here</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Performing Events */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">My Top Performing Events</h3>
            <div className="space-y-4">
              {topEvents.length > 0 ? topEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                     
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">₹{((event.ticketPrice*event.ticketsSold)-((event.ticketPrice*event.ticketsSold)*adminPercentage)/100).toLocaleString()}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No performance data yet</p>
                  <p className="text-sm">Host some events to see top performers</p>
                </div>
              )}
            </div>
          </div>    
        </div>

      
        
      </div>
    </div>
    </OrganiserLayout>
  );
};

export default Dashboard;