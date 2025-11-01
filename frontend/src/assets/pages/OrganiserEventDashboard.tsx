import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  Ticket,
  Download,
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
import moment from "moment";

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
    ticketTypes?: {
      type: string;
      price: number;
      capacity: number;
      sold: number;
    }[];
  } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  console.log("orders", orders);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const response = await organiserRepository.getDashboard(id);
        console.log("eventData", response);

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
    {
      header: "Order Date",
      accessor: "createdAt",
      render: (row: any) => moment(row.createdAt).format("DD MMM YYYY, hh:mm A"),
    },
  ];

  const ticketTypeData = Object.entries(stats.ticketTypes || {}).map(
    ([type, data]: [string, any]) => ({
      name: type,
      orders: data.count,
      tickets: data.tickets,
      revenue: data.revenue / 100,
    })
  );

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    if (!eventData) return;
    const ticketTypeData = Object.entries(stats.ticketTypes || {}).map(
      ([type, data]: [string, any]) => ({
        name: type,
        orders: data.count,
        tickets: data.tickets,
        revenue: data.revenue / 100,
      })
    );

    doc.setFontSize(18);
    doc.text(eventData?.title + " - Event Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`Date: ${formatDate(eventData?.date)}`, 14, 32);
    doc.text(`Venue: ${eventData?.venue}`, 14, 38);
    doc.text(`Category: ${eventData?.category}`, 14, 44);
    doc.text(`Status: ${eventData?.status}`, 14, 50);

    doc.text("Ticket Summary:", 14, 65);
    // @ts-ignore
    autoTable(doc, {
      startY: 70,
      head: [["Type", "Orders", "Tickets", "Revenue (₹)"]],
      body: ticketTypeData.map((t) => [t.name, t.orders, t.tickets, t.revenue.toFixed(2)]),
    });

    doc.text("Booking Stats:", 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Confirmed: ${stats?.confirmed}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Pending: ${stats?.pending}`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`Cancelled: ${stats?.cancelled}`, 14, doc.lastAutoTable.finalY + 28);

    doc.save(`${eventData.title}_Report.pdf`);
  };

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/50 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words">
                    {eventData.title}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                        eventData.status
                      )}`}
                    >
                      {eventData.status.charAt(0).toUpperCase() + eventData.status.slice(1)}
                    </span>
                    {eventData.isBlocked && (
                      <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-700/50 rounded-xl sm:rounded-2xl border border-slate-600/50">
                    <div className="p-2 bg-blue-600 rounded-xl flex-shrink-0">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm truncate">
                      {formatDate(eventData.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-700/50 rounded-xl sm:rounded-2xl border border-slate-600/50">
                    <div className="p-2 bg-green-600 rounded-xl flex-shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm">{eventData.time}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-700/50 rounded-xl sm:rounded-2xl border border-slate-600/50">
                    <div className="p-2 bg-red-600 rounded-xl flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm truncate">{eventData.venue}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-700/50 rounded-xl sm:rounded-2xl border border-slate-600/50">
                    <div className="p-2 bg-purple-600 rounded-xl flex-shrink-0">
                      <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm truncate">{eventData.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="border-b border-slate-700/50 overflow-x-auto">
              <nav className="flex min-w-max">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-colors duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Overview & Analytics</span>
                    <span className="sm:hidden">Overview</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-colors duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === "orders"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Orders & Reviews</span>
                    <span className="sm:hidden">Orders</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4 md:p-6">
              {activeTab === "overview" && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Ticket Type Breakdown */}
                  <div className="bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-600/30 p-4 sm:p-6">
                    {stats.ticketTypes && Object.keys(stats.ticketTypes).length > 0 && (
                      <>
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="text-white" size={16} />
                          </div>
                          <span className="text-sm sm:text-xl">Ticket Type Breakdown</span>
                        </h3>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
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
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3">
                          {ticketTypeData.map((t) => (
                            <div
                              key={t.name}
                              className="bg-slate-800/60 rounded-xl p-4 border border-slate-600/30"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span className="capitalize text-white font-semibold text-base">
                                  {t.name}
                                </span>
                                <span className="text-green-400 font-bold">₹{t.revenue}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-400">Orders</p>
                                  <p className="text-white font-medium">{t.orders}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Tickets</p>
                                  <p className="text-white font-medium">{t.tickets}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Remaining Tickets by Type */}
                  <div className="bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-600/30 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Ticket className="text-white" size={16} />
                      </div>
                      <span className="text-sm sm:text-xl">Remaining Tickets</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {eventData?.ticketTypes?.map((t) => {
                        const remaining = t.capacity - t.sold;
                        const percentLeft = ((remaining / t.capacity) * 100).toFixed(0);
                        return (
                          <div
                            key={t.type}
                            className="p-4 sm:p-5 bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-600/30 shadow-md flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="capitalize text-white text-base sm:text-lg font-semibold">
                                {t.type}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-400">₹{t.price}</span>
                            </div>

                            <div className="h-2 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="bg-green-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${percentLeft}%` }}
                              ></div>
                            </div>

                            <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                              <span>{remaining} left</span>
                              <span>{t.capacity} total</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Download Report Button */}
                  {eventData.status === "completed" && (
                    <button
                      onClick={handleDownloadReport}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Report</span>
                    </button>
                  )}

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium opacity-90 mb-1">
                            Confirmed Bookings
                          </h4>
                          <p className="text-2xl sm:text-3xl font-bold">{stats?.confirmed ?? 0}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium opacity-90 mb-1">
                            Pending Bookings
                          </h4>
                          <p className="text-2xl sm:text-3xl font-bold">{stats?.pending ?? 0}</p>
                        </div>
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg text-white sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium opacity-90 mb-1">
                            Cancelled Bookings
                          </h4>
                          <p className="text-2xl sm:text-3xl font-bold">{stats?.cancelled ?? 0}</p>
                        </div>
                        <XCircle className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
                      </div>
                    </div>
                  </div>

                  {/* Sales Trend Chart */}
                  <div className="bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-600/30 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="text-white" size={16} />
                      </div>
                      <span className="text-sm sm:text-xl">Sales Trend</span>
                    </h3>
                    <div className="h-64 sm:h-80">
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
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                          <Tooltip
                            labelFormatter={(value) =>
                              `Date: ${new Date(value).toLocaleDateString("en-IN")}`
                            }
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #475569",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#3B82F6" }}
                            activeDot={{ r: 6, fill: "#1D4ED8" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Ticket Category Breakdown */}
                    <div className="bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-600/30 p-4 sm:p-6">
                      <h3 className="text-base sm:text-xl font-semibold mb-4 text-white">
                        Ticket Category Breakdown
                      </h3>
                      <div className="h-64 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ticketStatusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #475569",
                                borderRadius: "8px",
                                fontSize: "12px",
                              }}
                            />
                            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-600/30 p-4 sm:p-6">
                      <h3 className="text-base sm:text-xl font-semibold mb-4 text-white">
                        Ticket Distribution
                      </h3>
                      <div className="flex justify-center">
                        <PieChart width={280} height={260}>
                          <Pie
                            data={ticketStatusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
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
                <div className="space-y-4 sm:space-y-6">
                  {/* Orders Table */}
                  {orders && orders.length > 0 && (
                    <div className="bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-600/30">
                      <div className="p-4 sm:p-6 border-b border-slate-600/30">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                          Order Management
                        </h3>
                        <p className="text-gray-400 mt-1 text-xs sm:text-sm">
                          Track and manage all event orders
                        </p>
                      </div>
                      <div className="p-3 sm:p-6 overflow-x-auto">
                        <DataTable data={orders} columns={columns} />
                      </div>
                    </div>
                  )}

                  {/* Reviews Chart */}
                  {reviews && reviews.length > 0 && (
                    <div className="bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-600/30 p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white flex items-center gap-2">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                        Review Sentiment Analysis
                      </h3>
                      <ReviewSentimentChart reviews={reviews} />
                    </div>
                  )}

                  {/* Empty state when no orders and no reviews */}
                  {(!orders || orders.length === 0) && (!reviews || reviews.length === 0) && (
                    <div className="bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-600/30 p-8 sm:p-12 text-center">
                      <div className="flex flex-col items-center gap-3 sm:gap-4">
                        <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" />
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          No Data Available
                        </h3>
                        <p className="text-gray-400 max-w-md text-sm sm:text-base">
                          There are currently no orders or reviews for this event. Once
                          customers start booking tickets and leaving reviews, they will
                          appear here.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Partial empty states */}
                  {(!orders || orders.length === 0) && reviews && reviews.length > 0 && (
                    <div className="bg-blue-500/10 rounded-xl sm:rounded-2xl border border-blue-500/30 p-4 sm:p-6">
                      <div className="flex items-center gap-3">
                        <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-300 text-sm sm:text-base">
                            No Orders Yet
                          </h4>
                          <p className="text-blue-400 text-xs sm:text-sm">
                            Orders will appear here once customers start booking tickets.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {orders && orders.length > 0 && (!reviews || reviews.length === 0) && (
                    <div className="bg-purple-500/10 rounded-xl sm:rounded-2xl border border-purple-500/30 p-4 sm:p-6">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-purple-300 text-sm sm:text-base">
                            No Reviews Yet
                          </h4>
                          <p className="text-purple-400 text-xs sm:text-sm">
                            Customer reviews and sentiment analysis will appear here once
                            reviews are submitted.
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
      <OrganiserFooter />
    </OrganiserLayout>
  );
};

export default EventDashboard;