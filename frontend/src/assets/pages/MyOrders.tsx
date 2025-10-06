import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Search,
  Filter,
  Download,
  Eye,

  AlertCircle,
  
  XCircle,
  Bookmark,
  TrendingUp,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { paymentRepository } from "../../repositories/paymentRepositories";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import UserNavbar from "../components/UseNavbar";
import type { IGetOrdersResponse, IOrder } from "../../interfaces/IOrder";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import targetLogo from "../images/target_3484438 (2).png";
import Footer from "../components/Footer";

const getBase64FromImage = (imgUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context is null");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
  });
};

const MySwal = withReactContent(Swal);

const MyOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState(searchTerm);
  const [refundId, setRefundId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const user = useSelector((state: RootState) => state.auth.user);
  console.log(refundId);
  

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, debounceSearch, statusFilter]);

  const params = new URLSearchParams();
  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }
  if (statusFilter != "all") params.append("status", statusFilter);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = user?.id;
      if (!userId) {
        throw new Error("userId not present");
      }
      const response: IGetOrdersResponse = await paymentRepository.getOrders(
        userId,
        currentPage,
        limit,
        params.toString()
      );
      if (!response.success) {
        throw new Error("Failed to fetch orders");
      }
      if (response.order) {
        setOrders(response.order.orders);
        setTotalPages(response.order.totalPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30";
      case "pending":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30";
      case "cancelled":
        return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-white/5 text-gray-400 border border-white/10";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "paid":
        return "Confirmed";
      case "created":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const getBookingStatusDisplay = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const getEventImage = (order: IOrder) => {
    let imageSrc = "https://via.placeholder.com/300x200";
    if (order && order.eventDetails && order.eventDetails.images.length > 0) {
      const img = order.eventDetails.images[0];
      if (typeof img === "string") {
        if (img.startsWith("http")) {
          return (imageSrc = img);
        } else {
          return (imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`);
        }
      } else if (typeof img === "object" && img.url) {
        return (imageSrc = img.url);
      }
    }
    return imageSrc;
  };

  const handleCancelBooking = async (orderId: string) => {
    try {
      const result = await MySwal.fire({
        title: <p>Are you sure?</p>,
        html: <p>Do you really want to cancel this booking?</p>,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, cancel it!",
        cancelButtonText: "No, keep it",
      });

      if (result.isConfirmed) {
        const response = await paymentRepository.findOrder(orderId);
        if (response.success) {
          setRefundId(response.refund.response.refundId);
          fetchOrders();
          MySwal.fire(<p>Cancelled!</p>, <p>Your booking has been cancelled.</p>, "success");
        } else {
          MySwal.fire(<p>Failed</p>, <p>{response.message}</p>, "success");
        }
      } else {
        MySwal.fire(<p>Safe!</p>, <p>Your booking is not cancelled.</p>, "info");
      }
    } catch (error) {
      MySwal.fire(<p>Error</p>, <p>Something went wrong while cancelling the booking.</p>, "error");
    }
  };

  const handleDownloadTicket = async (orderId: string) => {
    const response = await paymentRepository.getTickets(orderId);
    const tickets = response.result;
    if (!tickets || tickets.length === 0) return;

    const order = orders.find((o) => o._id === orderId);
    if (!order) return;
    const logoBase64 = await getBase64FromImage(targetLogo);

    const doc = new jsPDF();

    for (let i = 0; i < tickets.length; i++) {
      const logoX = 70;
      const logoY = 20;
      const logoWidth = 15;
      const logoHeight = 15;

      doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);
      doc.setFontSize(18);
      doc.setTextColor(0);

      const textX = logoX + logoWidth + 5;
      const textY = logoY + logoHeight / 2 + 2;
      doc.text(`${order.eventTitle}`, textX, textY);

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(10, 55, 190, 65);
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "normal");
      doc.text(`Event: ${order.eventTitle}`, 20, 65);
      doc.text(`Date: ${formatDate(order.eventDetails?.date.toString())}`, 20, 75);
      doc.text(`Venue: ${order.eventDetails?.venue}`, 20, 85);
      doc.text(`Order ID: ${order.orderId}`, 20, 95);
      doc.text(`Tickets: ${order.ticketCount}`, 20, 105);
      doc.text(`Amount Paid: ${formatCurrency(order.amount)}`, 20, 115);
      const qrText = `https://myeventsite.com/verify/${tickets[i].qrToken}`;
      const qrImage = await QRCode.toDataURL(qrText);
      doc.addImage(qrImage, "PNG", 150, 70, 40, 40);
      doc.setFontSize(11);
      doc.setTextColor(80);
      doc.text("✨ Thank you for booking with EVENTOO ✨", 105, 130, {
        align: "center",
      });

      if (i !== tickets.length - 1) {
        doc.addPage();
      }
    }

    doc.save(`ticket_${order.eventTitle.replace(/\s+/g, "_")}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
          </div>
          <p className="text-gray-400 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Error Loading Orders</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/50 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <UserNavbar />
      
      {/* Hero Header */}
      <div className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Bookings</span>
          </h1>
          <p className="text-xl text-gray-400">Track and manage your event experiences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Search and Filter Bar */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
              <div className="relative flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by event name or order ID..."
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer hover:bg-white/10 transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="bg-black">All Status</option>
                <option value="confirmed" className="bg-black">Confirmed</option>
                <option value="pending" className="bg-black">Pending</option>
                <option value="cancelled" className="bg-black">Cancelled</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 flex items-center gap-2 text-white transition-all"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-purple-500/50 overflow-hidden transition-all duration-500 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Event Image */}
                  <div className="flex-shrink-0 relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition"></div>
                    <div className="relative">
                      <img
                        src={getEventImage(order)}
                        alt={order.eventTitle}
                        className="w-full lg:w-56 h-40 object-cover rounded-2xl"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&auto=format";
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-xl">
                        #{order.bookingNumber}
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                          {order.eventTitle}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <span className="text-purple-400">Order ID:</span> {order.orderId}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-blue-400">Razorpay:</span> {order.razorpayOrderId}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          {order.eventDetails?.date && (
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              {formatDate(order.eventDetails.date.toString())}
                            </div>
                          )}
                          {order.eventDetails?.venue && (
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                              <MapPin className="w-4 h-4 text-pink-400" />
                              <span className="truncate max-w-[200px]">{order.eventDetails.venue}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                            <Bookmark className="w-4 h-4 text-blue-400" />
                            {formatDate(order.createdAt.toString())}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getStatusColor(order.bookingStatus || "")}`}>
                          {getBookingStatusDisplay(order.bookingStatus || "")}
                        </span>
                      </div>
                    </div>

                    {/* Ticket Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                        <p className="font-semibold text-white flex items-center gap-2">
                          {order.status === "paid" && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {order.status === "created" && <Clock className="w-4 h-4 text-yellow-400" />}
                          {order.status === "failed" && <X className="w-4 h-4 text-red-400" />}
                          {getStatusDisplay(order.status)}
                        </p>
                        {order.status === "refunded" && (
                          <p className="text-xs text-gray-400 mt-1">Refund ID: {order.refundId}</p>
                        )}
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Tickets</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="font-semibold text-white">
                              {order.ticketCount} {order.ticketCount > 1 ? "Tickets" : "Ticket"}
                            </span>
                          </div>
                          {order.eventDetails.ticketTypes && order.selectedTicket?.type && (
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full shadow-md
                                ${order.selectedTicket.type === "VIP" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : ""}
                                ${order.selectedTicket.type === "Premium" ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white" : ""}
                                ${order.selectedTicket.type === "Economic" ? "bg-gradient-to-r from-green-500 to-lime-400 text-white" : ""}
                              `}
                            >
                              {order.selectedTicket.type}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                        <p className="font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {formatCurrency(order.amount, order.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                          <CreditCard className="w-4 h-4" />
                          <span>Razorpay</span>
                        </div>
                        {order.razorpayPaymentId && (
                          <span className="text-xs bg-white/5 px-3 py-2 rounded-lg">
                            ID: {order.razorpayPaymentId.slice(-8)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {order.status === "paid" && (
                          <button
                            onClick={() => handleCancelBooking(order._id)}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-xl font-semibold transition-all flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                        <Link
                          to={`/order/${order._id}`}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-purple-500/50 rounded-xl font-semibold transition-all flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </Link>
                        {order.status === "paid" && (
                          <button
                            onClick={() => handleDownloadTicket(order._id)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/50 transition-all flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <Calendar className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">No Orders Found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or browse events to make your first booking.
            </p>
            <Link
              to="/events"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/50 transition-all"
            >
              Browse Events
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentPage === 1
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-purple-500/50"
              }`}
            >
              Previous
            </button>
            <span className="px-6 py-3 bg-white/5 rounded-xl text-white font-semibold border border-white/10">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentPage === totalPages
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-purple-500/50"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Order Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {orders.length}
                </p>
                <p className="text-sm text-gray-400">Total Orders</p>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {orders.filter((o) => o.status === "paid").length}
                </p>
                <p className="text-sm text-gray-400">Confirmed</p>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {orders.filter((o) => o.status === "created").length}
                </p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {formatCurrency(
                    orders
                      .filter((o) => o.status === "paid")
                      .reduce((sum, order) => sum + order.amount, 0)
                  )}
                </p>
                <p className="text-sm text-gray-400">Total Spent</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default MyOrderPage;