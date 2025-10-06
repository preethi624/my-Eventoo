import { useState, useEffect } from "react";
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
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
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

export interface IReview {
  _id: string;
  userId: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
  sentiment?: string;
}

interface ticketTypeStats {
  count: number;
  tickets: number;
  revenue: number;
}

interface Stats {
  salesTrend: { date: string; sales: number }[];
  pending: string;
  cancelled: string;
  confirmed: string;
  ticketTypes: { ecnomic: ticketTypeStats; premium: ticketTypeStats; vip: ticketTypeStats };
}

import { organiserRepository } from "../../repositories/organiserRepositories";
import OrganiserLayout from "../components/OrganiserLayout";
import { reviewRepository } from "../../repositories/reviewRepositories";
import ReviewSentimentChart from "../components/ReviewSentimentChart";
import DataTable from "../components/DataTable";
import OrganiserFooter from "../components/OrganiserFooter";

const EventDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState<{
    status: string;
    isBlocked: boolean;
    category: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    ticketsSold: number;
    availableTickets: number;
  } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

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
    fetchReviews();
    fetchOrders();
  }, [id]);

  const fetchOrders = async () => {
    try {
      if (!id) throw new Error("error in fetching id");
      const response = await organiserRepository.getEventOrders(id);
      console.log(response);
      if (response?.orders) {
        const formattedOrders = response.orders.map((order: any) => ({
          ...order,
          customerName: order.userId?.name,
          customerEmail: order.userId?.email,
          amount: order.amount / 100,
        }));

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReviews = async () => {
    try {
      if (!id) throw new Error("id not found");
      const response = await reviewRepository.fetchReviews(id);
      setReviews(response.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  if (!eventData || !stats)
    return <div className="text-center py-10 text-red-400">No event found</div>;

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

  const salesData = stats.salesTrend || [];
  const ticketStatusData = [
    { name: "Sold", value: eventData.ticketsSold, color: "#10B981" },
    { name: "Available", value: eventData.availableTickets, color: "#3B82F6" },
  ];

  const columns = [
    { header: "Order ID", accessor: "orderId" },
    { header: "Customer", accessor: "customerName" },
    { header: "Tickets", accessor: "ticketCount" },
    { header: "Amount", accessor: "amount" },
    { header: "Payment Status", accessor: "status" },
    { header: "Order Date", accessor: "createdAt" },
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-white">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-2xl border border-slate-600/50">
                    <div className="p-2 bg-blue-600 rounded-xl">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{formatDate(eventData.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-2xl border border-slate-600/50">
                    <div className="p-2 bg-green-600 rounded-xl">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{eventData.time}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-2xl border border-slate-600/50">
                    <div className="p-2 bg-red-600 rounded-xl">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{eventData.venue}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-2xl border border-slate-600/50">
                    <div className="p-2 bg-purple-600 rounded-xl">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{eventData.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50">
            <div className="border-b border-slate-700/50">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-4 font-semibold text-sm transition-colors duration-200 border-b-2 ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
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
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
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
                  <div className="bg-slate-700/30 rounded-2xl border border-slate-600/30 p-6">
                    {stats.ticketTypes && Object.keys(stats.ticketTypes).length > 0 && (
                      <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Sparkles className="text-white" size={20} />
                        </div>
                        Ticket Type Breakdown
                      </h3>
                    )}
                    {stats.ticketTypes && Object.keys(stats.ticketTypes).length > 0 && (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-600/50">
                            <th className="p-3 text-gray-400 text-sm">Type</th>
                            <th className="p-3 text-gray-400 text-sm">Orders</th>
                            <th className="p-3 text-gray-400 text-sm">Tickets</th>
                            <th className="p-3 text-gray-400 text-sm">Revenue (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ticketTypeData.map((t) => (
                            <tr key={t.name} className="border-b border-slate-700/30">
                              <td className="p-3 capitalize text-white">{t.name}</td>
                              <td className="p-3 text-gray-300">{t.orders}</td>
                              <td className="p-3 text-gray-300">{t.tickets}</td>
                              <td className="p-3 text-green-400">₹{t.revenue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium opacity-90 mb-1">
                            Confirmed Bookings
                          </h4>
                          <p className="text-3xl font-bold">{stats?.confirmed ?? 0}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 opacity-80" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-2xl shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium opacity-90 mb-1">
                            Pending Bookings
                          </h4>
                          <p className="text-3xl font-bold">{stats?.pending ?? 0}</p>
                        </div>
                        <AlertCircle className="w-10 h-10 opacity-80" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium opacity-90 mb-1">
                            Cancelled Bookings
                          </h4>
                          <p className="text-3xl font-bold">{stats?.cancelled ?? 0}</p>
                        </div>
                        <XCircle className="w-10 h-10 opacity-80" />
                      </div>
                    </div>
                  </div>

                  {/* Sales Trend Chart */}
                  <div className="bg-slate-700/30 rounded-2xl border border-slate-600/30 p-6">
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-white" size={20} />
                      </div>
                      Sales Trend
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(dateStr) =>
                              new Date(dateStr).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })
                            }
                            stroke="#94a3b8"
                          />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            labelFormatter={(value) =>
                              `Date: ${new Date(value).toLocaleDateString("en-IN")}`
                            }
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "8px",
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
                    <div className="bg-slate-700/30 rounded-2xl border border-slate-600/30 p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">
                        Ticket Category Breakdown
                      </h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ticketStatusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #475569",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-slate-700/30 rounded-2xl border border-slate-600/30 p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">
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
                    <div className="bg-slate-700/30 rounded-2xl border border-slate-600/30">
                      <div className="p-6 border-b border-slate-600/30">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                          <IndianRupee className="w-5 h-5 text-green-400" />
                          Order Management
                        </h3>
                        <p className="text-gray-400 mt-1">
                          Track and manage all event orders
                        </p>
                      </div>
                      <div className="p-6">
                        <DataTable data={orders} columns={columns} />
                      </div>
                    </div>
                  )}

                  {/* Reviews Chart - Only show if reviews are available */}
                  {reviews && reviews.length > 0 && (
                    <div className="bg-slate-700/30 rounded-2xl border border-slate-600/30 p-6">
                      <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        Review Sentiment Analysis
                      </h3>
                      <ReviewSentimentChart reviews={reviews} />
                    </div>
                  )}

                  {/* Empty state when no orders and no reviews */}
                  {(!orders || orders.length === 0) &&
                    (!reviews || reviews.length === 0) && (
                      <div className="bg-slate-700/30 rounded-2xl border border-slate-600/30 p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Users className="w-16 h-16 text-gray-500" />
                          <h3 className="text-xl font-semibold text-white">
                            No Data Available
                          </h3>
                          <p className="text-gray-400 max-w-md">
                            There are currently no orders or reviews for this event.
                            Once customers start booking tickets and leaving reviews,
                            they will appear here.
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Partial empty states */}
                  {(!orders || orders.length === 0) &&
                    reviews &&
                    reviews.length > 0 && (
                      <div className="bg-blue-500/10 rounded-2xl border border-blue-500/30 p-6">
                        <div className="flex items-center gap-3">
                          <IndianRupee className="w-6 h-6 text-blue-400" />
                          <div>
                            <h4 className="font-semibold text-blue-300">No Orders Yet</h4>
                            <p className="text-blue-400 text-sm">
                              Orders will appear here once customers start booking
                              tickets.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {orders &&
                    orders.length > 0 &&
                    (!reviews || reviews.length === 0) && (
                      <div className="bg-purple-500/10 rounded-2xl border border-purple-500/30 p-6">
                        <div className="flex items-center gap-3">
                          <Users className="w-6 h-6 text-purple-400" />
                          <div>
                            <h4 className="font-semibold text-purple-300">
                              No Reviews Yet
                            </h4>
                            <p className="text-purple-400 text-sm">
                              Customer reviews and sentiment analysis will appear here
                              once reviews are submitted.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <OrganiserFooter/>
    </OrganiserLayout>
  );
};

export default EventDashboard;