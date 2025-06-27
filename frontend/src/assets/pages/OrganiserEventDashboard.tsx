import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  BarChart3,
  TrendingUp,
  Clock,
  Tag,
  Camera,
  Edit,
  Trash2,
  Eye,
  Share2,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { organiserRepository } from '../../repositories/organiserRepositories';
import OrganiserLayout from '../components/OrganiserLayout';


const EventDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const response = await organiserRepository.getDashboard(id);
        if (response.success) {
          setEventData(response.event);
          setOrders(response.orders);
          setStats(response.stats);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (!eventData || !stats) return <div className="text-center py-10 text-red-600">No event found</div>;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const salesData = stats.salesTrend || [];
  const ticketStatusData = [
    { name: 'Sold', value: eventData.ticketsSold, color: '#10B981' },
    { name: 'Available', value: eventData.availableTickets, color: '#3B82F6' }
  ];
  const bookingStatusData = [
    { name: 'Confirmed', count: stats.confirmed },
    { name: 'Pending', count: stats.pending },
    { name: 'Cancelled', count: stats.cancelled }
  ];

  return (
    <OrganiserLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{eventData.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(eventData.status)}`}>
                  {eventData.status.charAt(0).toUpperCase() + eventData.status.slice(1)}
                </span>
                {eventData.isBlocked && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Blocked
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(eventData.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{eventData.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{eventData.venue}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{eventData.category}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        </div>

{/* === Replace this section dynamically === */}
<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-white p-6 rounded-lg shadow border">
    <h4 className="text-sm text-gray-500 mb-1">Confirmed Bookings</h4>
    <p className="text-2xl font-bold text-green-600">{stats?.confirmed ?? 0}</p>
  </div>
  <div className="bg-white p-6 rounded-lg shadow border">
    <h4 className="text-sm text-gray-500 mb-1">Pending Bookings</h4>
    <p className="text-2xl font-bold text-yellow-600">{stats?.pending ?? 0}</p>
  </div>
  <div className="bg-white p-6 rounded-lg shadow border">
    <h4 className="text-sm text-gray-500 mb-1">Cancelled Bookings</h4>
    <p className="text-2xl font-bold text-red-600">{stats?.cancelled ?? 0}</p>
  </div>
</div>

<div className="mt-8">
  <h3 className="text-lg font-semibold mb-3">Sales Trend</h3>
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={stats?.salesTrend || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
{/* === End dynamic section === */}




      </div>
     </OrganiserLayout> 
   
  );
};

export default EventDashboard;
