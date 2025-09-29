<<<<<<< HEAD
import  { useState, useEffect } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  BarChart3,
  TrendingUp,
  Clock,
  Tag,
<<<<<<< HEAD
  
  CheckCircle,
  XCircle,
  AlertCircle,
 
=======
  Camera,
  Edit,
  Trash2,
  Eye,
  Share2,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
<<<<<<< HEAD
export interface IReview {
  _id: string;
  userId: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
  sentiment?:string
}
interface ticketTypeStats{
  count:number;
  tickets:number;
  revenue:number
}
interface Stats {
  salesTrend: { date: string; sales: number}[];
  pending:string,cancelled:string,confirmed:string ;
  ticketTypes:{ecnomic:ticketTypeStats;premium:ticketTypeStats;vip:ticketTypeStats}

}

import { organiserRepository } from "../../repositories/organiserRepositories";
import OrganiserLayout from "../components/OrganiserLayout";
import { reviewRepository } from "../../repositories/reviewRepositories";
import ReviewSentimentChart from "../components/ReviewSentimentChart";
import DataTable from "../components/DataTable";

const EventDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState<{status:string,isBlocked:boolean,category:string,title:string,date:string,time:string,venue:string,ticketsSold:number,availableTickets:number}|null>(null);
  const [stats, setStats] = useState<Stats|null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
=======
import { organiserRepository } from "../../repositories/organiserRepositories";
import OrganiserLayout from "../components/OrganiserLayout";

const EventDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

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
<<<<<<< HEAD
    fetchReviews()
    fetchOrders()
  }, [id]);

  const fetchOrders = async () => {
    try {
      if (!id) throw new Error("error in fetching id")
      const response = await organiserRepository.getEventOrders(id);
      console.log(response);
      if (response?.orders) {
        const formattedOrders = response.orders.map((order: any) => ({
          ...order,
          customerName: order.userId?.name,
          customerEmail: order.userId?.email,
          amount:order.amount/100
        }));

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchReviews = async () => {
    try {
      if (!id) throw new Error("id not found")
      const response = await reviewRepository.fetchReviews(id);
      setReviews(response.reviews)
    } catch (error) {
      console.log(error);
    }
  }

=======
  }, [id]);

>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  if (loading)
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (!eventData || !stats)
    return <div className="text-center py-10 text-red-600">No event found</div>;

<<<<<<< HEAD
  
=======
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

<<<<<<< HEAD
 
=======
  const getBookingStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

  const salesData = stats.salesTrend || [];
  const ticketStatusData = [
    { name: "Sold", value: eventData.ticketsSold, color: "#10B981" },
    { name: "Available", value: eventData.availableTickets, color: "#3B82F6" },
  ];
<<<<<<< HEAD
  
  const columns = [
    { header: "Order ID", accessor: "orderId" },
    { header: "Customer", accessor: "customerName" },
    { header: "Tickets", accessor: "ticketCount" },
    { header: "Amount", accessor: "amount" },
    { header: "Payment Status", accessor: "status" },
    { header: "Order Date", accessor:"createdAt"}
  ];
  const ticketTypeData = Object.entries(stats.ticketTypes || {}).map(
  ([type, data]: [string, any]) => ({
    name: type,         
    orders: data.count, 
    tickets: data.tickets,
    revenue: data.revenue / 100, 
  })
);


  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
=======
  const bookingStatusData = [
    { name: "Confirmed", count: stats.confirmed },
    { name: "Pending", count: stats.pending },
    { name: "Cancelled", count: stats.cancelled },
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
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                  <h1 className="text-3xl font-bold text-gray-900">
                    {eventData.title}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      eventData.status
                    )}`}
                  >
                    {eventData.status.charAt(0).toUpperCase() +
                      eventData.status.slice(1)}
                  </span>
                  {eventData.isBlocked && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Blocked
                    </span>
                  )}
                </div>
<<<<<<< HEAD
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-600">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{formatDate(eventData.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{eventData.time}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span className="font-medium">{eventData.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Tag className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">{eventData.category}</span>
=======
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
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
                  </div>
                </div>
              </div>
            </div>
          </div>
<<<<<<< HEAD

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-4 font-semibold text-sm transition-colors duration-200 border-b-2 ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Overview & Analytics
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-6 py-4 font-semibold text-sm transition-colors duration-200 border-b-2 ${
                    activeTab === "orders"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Orders & Reviews
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
  {stats.ticketTypes&&Object.keys(stats.ticketTypes).length > 0 &&<h3 className="text-xl font-semibold mb-4 text-gray-800">Ticket Type Breakdown</h3>}
  {stats.ticketTypes&&Object.keys(stats.ticketTypes).length > 0 &&<table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-gray-100 text-gray-600 text-sm">
        <th className="p-3">Type</th>
        <th className="p-3">Orders</th>
        <th className="p-3">Tickets</th>
        <th className="p-3">Revenue (₹)</th>
      </tr>
    </thead>
    <tbody>
      {ticketTypeData.map((t) => (
        <tr key={t.name} className="border-b">
          <td className="p-3 capitalize">{t.name}</td>
          <td className="p-3">{t.orders}</td>
          <td className="p-3">{t.tickets}</td>
          <td className="p-3">₹{t.revenue}</td>
        </tr>
      ))}
    </tbody>
  </table>}
</div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                      
                      <div className="flex items-center justify-between">
                        
                        <div>
                          <h4 className="text-sm font-medium opacity-90 mb-1">Confirmed Bookings</h4>
                          <p className="text-3xl font-bold">
                            {stats?.confirmed ?? 0}
                          </p>
                        </div>
                        <CheckCircle className="w-10 h-10 opacity-80" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium opacity-90 mb-1">Pending Bookings</h4>
                          <p className="text-3xl font-bold">
                            {stats?.pending ?? 0}
                          </p>
                        </div>
                        <AlertCircle className="w-10 h-10 opacity-80" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium opacity-90 mb-1">Cancelled Bookings</h4>
                          <p className="text-3xl font-bold">
                            {stats?.cancelled ?? 0}
                          </p>
                        </div>
                        <XCircle className="w-10 h-10 opacity-80" />
                      </div>
                    </div>
                  </div>

                  {/* Sales Trend Chart */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      Sales Trend
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(dateStr) =>
                              new Date(dateStr).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })
                            }
                            stroke="#666"
                          />
                          <YAxis stroke="#666" />
                          <Tooltip
                            labelFormatter={(value) =>
                              `Date: ${new Date(value).toLocaleDateString("en-IN")}`
                            }
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ r: 5, fill: "#3B82F6" }}
                            activeDot={{ r: 7, fill: "#1D4ED8" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ticket Category Breakdown */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Ticket Category Breakdown
                      </h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ticketStatusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                            />
                            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Ticket Distribution
                      </h3>
                      <div className="flex justify-center">
                        <PieChart width={300} height={280}>
                          <Pie
                            data={ticketStatusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} (${(percent * 100).toFixed(0)}%)`
                            }
                          >
                            {ticketStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-6">
                  {/* Orders Table - Only show if orders are available */}
                  {orders && orders.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                          <IndianRupee className="w-5 h-5 text-green-500" />
                          Order Management
                        </h3>
                        <p className="text-gray-600 mt-1">Track and manage all event orders</p>
                      </div>
                      <div className="p-6">
                        <DataTable data={orders} columns={columns} />
                      </div>
                    </div>
                  )}

                  {/* Reviews Chart - Only show if reviews are available */}
                  {reviews && reviews.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        Review Sentiment Analysis
                      </h3>
                      <ReviewSentimentChart reviews={reviews} />
                    </div>
                  )}

                  {/* Empty state when no orders and no reviews */}
                  {(!orders || orders.length === 0) && (!reviews || reviews.length === 0) && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Users className="w-16 h-16 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-700">No Data Available</h3>
                        <p className="text-gray-500 max-w-md">
                          There are currently no orders or reviews for this event. 
                          Once customers start booking tickets and leaving reviews, they will appear here.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Partial empty states */}
                  {(!orders || orders.length === 0) && reviews && reviews.length > 0 && (
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                      <div className="flex items-center gap-3">
                        <IndianRupee className="w-6 h-6 text-blue-500" />
                        <div>
                          <h4 className="font-semibold text-blue-800">No Orders Yet</h4>
                          <p className="text-blue-600 text-sm">Orders will appear here once customers start booking tickets.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {orders && orders.length > 0 && (!reviews || reviews.length === 0) && (
                    <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-purple-500" />
                        <div>
                          <h4 className="font-semibold text-purple-800">No Reviews Yet</h4>
                          <p className="text-purple-600 text-sm">Customer reviews and sentiment analysis will appear here once reviews are submitted.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
=======
        </div>

        {/* === Replace this section dynamically === */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h4 className="text-sm text-gray-500 mb-1">Confirmed Bookings</h4>
            <p className="text-2xl font-bold text-green-600">
              {stats?.confirmed ?? 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h4 className="text-sm text-gray-500 mb-1">Pending Bookings</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {stats?.pending ?? 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h4 className="text-sm text-gray-500 mb-1">Cancelled Bookings</h4>
            <p className="text-2xl font-bold text-red-600">
              {stats?.cancelled ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-8">
  <h3 className="text-lg font-semibold mb-3 text-gray-700">Sales Trend</h3>
  <div className="h-72 bg-white p-4 rounded-lg shadow border">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(dateStr) =>
            new Date(dateStr).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })
          }
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) =>
            `Date: ${new Date(value).toLocaleDateString("en-IN")}`
          }
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
<h3 className="text-lg font-semibold mt-10 mb-3 text-gray-700">
  Ticket Category Breakdown
</h3>
<div className="h-72 bg-white p-4 rounded-lg shadow border">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={ticketStatusData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#10B981" />
    </BarChart>
  </ResponsiveContainer>
</div>
<PieChart width={300} height={250}>
  <Pie
    data={ticketStatusData}
    cx="50%"
    cy="50%"
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
    label={({ name, percent }) =>
      `${name} (${(percent * 100).toFixed(0)}%)`
    }
  >
    {ticketStatusData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
</PieChart>

        {/* === End dynamic section === */}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      </div>
    </OrganiserLayout>
  );
};

<<<<<<< HEAD
export default EventDashboard;
=======
export default EventDashboard;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
