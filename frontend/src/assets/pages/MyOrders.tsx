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
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,

  ChevronDown,
  ChevronUp,
 
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
  const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
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
      console.log("orders",response);
      
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
      case "paid":
      case "captured":
        return "bg-green-100 text-green-700 border border-green-300";
      case "pending":
      case "created":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700 border border-red-300";
      case "refunded":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "paid":
      case "captured":
        return "Confirmed";
      case "created":
        return "Pending";
      case "failed":
        return "Failed";
      case "refunded":
        return "Refunded";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const toggleExpandPayment = (orderId: string) => {
    setExpandedPayment(expandedPayment === orderId ? null : orderId);
  };

  const calculatePaymentStats = () => {
    const totalPaid = orders
      .filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + o.amount, 0);

    const totalRefunded = orders
      .filter((o) => o.status === "refunded")
      .reduce((sum, o) => sum + o.amount, 0);

    const successfulPayments = orders.filter((o) => o.status === "paid").length;
    const failedPayments = orders.filter((o) => o.status === "failed").length;

    return { totalPaid, totalRefunded, successfulPayments, failedPayments };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-300">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Orders</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-md transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const paymentStats = calculatePaymentStats();

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />

      {/* Hero Header */}
      <div className="relative pt-24 pb-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My <span className="text-red-500">Orders</span>
          </h1>
          <p className="text-lg text-gray-600">Track bookings and payment transactions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-2 mb-6 shadow-sm flex gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "orders"
                ? "bg-red-500 text-white shadow-md"
                : "bg-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Bookmark className="w-5 h-5" />
            My Orders
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "payments"
                ? "bg-red-500 text-white shadow-md"
                : "bg-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            
            Payment History
          </button>
        </div>

        {/* Orders Tab Content */}
        {activeTab === "orders" && (
          <>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="flex items-center bg-gray-50 rounded-xl border border-gray-300 overflow-hidden">
                    <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by event name or order ID..."
                      className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    className="px-6 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none cursor-pointer hover:bg-gray-100 transition-all text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-6 py-3 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 flex items-center gap-2 text-gray-700 transition-all text-sm"
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {orders.map((order, _) => (
                <div
                  key={order._id}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Event Image */}
                      <div className="flex-shrink-0 relative">
                        <div className="relative">
                          <img
                            src={getEventImage(order)}
                            alt={order.eventTitle}
                            className="w-full lg:w-56 h-40 object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&auto=format";
                            }}
                          />
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                            #{order.bookingNumber}
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                          <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                              {order.eventTitle}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">Order ID:</span> {order.orderId}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">Razorpay:</span> {order.razorpayOrderId}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              {order.eventDetails?.date && (
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                  <Calendar className="w-4 h-4 text-red-500" />
                                  {formatDate(order.eventDetails.date.toString())}
                                </div>
                              )}
                              {order.eventDetails?.venue && (
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                  <MapPin className="w-4 h-4 text-red-500" />
                                  <span className="truncate max-w-[200px]">{order.eventDetails.venue}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                <Bookmark className="w-4 h-4 text-red-500" />
                                {formatDate(order.createdAt.toString())}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(order.bookingStatus || "")}`}>
                              {getBookingStatusDisplay(order.bookingStatus || "")}
                            </span>
                          </div>
                        </div>

                        {/* Ticket Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1 font-semibold">Payment Status</p>
                            <p className="font-semibold text-gray-900 flex items-center gap-2">
                              {order.status === "paid" && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {order.status === "created" && <Clock className="w-4 h-4 text-yellow-500" />}
                              {order.status === "failed" && <X className="w-4 h-4 text-red-500" />}
                              {getStatusDisplay(order.status)}
                            </p>
                            {order.status === "refunded" && (
                              <p className="text-xs text-gray-500 mt-1">Refund ID: {order.refundId}</p>
                            )}
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1 font-semibold">Tickets</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-red-500" />
                                <span className="font-semibold text-gray-900">
                                  {order.ticketCount} {order.ticketCount > 1 ? "Tickets" : "Ticket"}
                                </span>
                              </div>
                              {order.eventDetails.ticketTypes && order.selectedTicket?.type && (
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                                  {order.selectedTicket.type}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
  <div className="flex justify-between items-center">
    <div>
      <p className="text-xs text-gray-500 font-semibold">Total Amount</p>
      <p className="font-bold text-xl text-green-600">
        {formatCurrency(order.finalAmount*100, order.currency)}
      </p>
    </div>

    <div className="text-right">
      <p className="text-xs text-gray-500 font-semibold">Offer Applied</p>
      <p className="font-bold text-xl text-red-500">
        -{formatCurrency(order.offerAmount, order.currency)}
      </p>
    </div>
  </div>
</div>

                          
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                              <CreditCard className="w-4 h-4" />
                              <span>Razorpay</span>
                            </div>
                            {order.razorpayPaymentId && (
                              <span className="text-xs bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                ID: {order.razorpayPaymentId.slice(-8)}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            {order.status === "paid" && (
                              <button
                                onClick={() => handleCancelBooking(order._id)}
                                className="w-full sm:w-auto px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Cancel
                              </button>
                            )}
                            <Link
                              to={`/order/${order._id}`}
                              className="w-full sm:w-auto px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Details
                            </Link>
                            {order.status === "paid" && (
                              <button
                                onClick={() => handleDownloadTicket(order._id)}
                                className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2"
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

            {/* Summary Stats */}
            {orders.length > 0 && (
              <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-red-500" />
                  Order Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-4xl font-black text-red-500 mb-2">
                      {orders.length}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Total Orders</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-4xl font-black text-green-600 mb-2">
                      {orders.filter((o) => o.status === "paid").length}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Confirmed</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-4xl font-black text-yellow-600 mb-2">
                      {orders.filter((o) => o.status === "created").length}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Pending</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-4xl font-black text-gray-900 mb-2">
                      {formatCurrency(
                        orders
                          .filter((o) => o.status === "paid")
                          .reduce((sum, order) => sum + order.amount, 0)
                      )}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Total Spent</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Payment History Tab Content */}
        {activeTab === "payments" && (
          <>
            {/* Financial Overview Dashboard */}
            {orders.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold opacity-90">Total Spent</p>
                      <ArrowUpRight className="w-5 h-5 opacity-80" />
                    </div>
                    <p className="text-3xl font-black mb-1">
                      {formatCurrency(paymentStats.totalPaid)}
                    </p>
                    <p className="text-xs opacity-80">
                      {paymentStats.successfulPayments} successful transactions
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold opacity-90">Money Back</p>
                      <ArrowDownRight className="w-5 h-5 opacity-80" />
                    </div>
                    <p className="text-3xl font-black mb-1">
                      {formatCurrency(paymentStats.totalRefunded)}
                    </p>
                    <p className="text-xs opacity-80">
                      From {orders.filter((o) => o.status === "refunded").length} cancelled bookings
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold opacity-90">Avg. Order Value</p>
                      <TrendingUp className="w-5 h-5 opacity-80" />
                    </div>
                    <p className="text-3xl font-black mb-1">
                      {paymentStats.successfulPayments > 0
                        ? formatCurrency(Math.floor(paymentStats.totalPaid / paymentStats.successfulPayments))
                        : formatCurrency(0)}
                    </p>
                    <p className="text-xs opacity-80">Per successful booking</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold opacity-90">Net Spent</p>
                      <DollarSign className="w-5 h-5 opacity-80" />
                    </div>
                    <p className="text-3xl font-black mb-1">
                      {formatCurrency(paymentStats.totalPaid - paymentStats.totalRefunded)}
                    </p>
                    <p className="text-xs opacity-80">After refunds</p>
                  </div>
                </div>

                {/* Payment Timeline / Monthly Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    Payment Activity
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-2xl font-bold text-green-600">
                        {orders.filter((o) => o.status === "paid").length}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Successful</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-2xl font-bold text-yellow-600">
                        {orders.filter((o) => o.status === "created").length}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-2xl font-bold text-red-600">
                        {orders.filter((o) => o.status === "failed").length}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Failed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-2xl font-bold text-blue-600">
                        {orders.filter((o) => o.status === "refunded").length}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Refunded</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-2xl font-bold text-purple-600">
                        {orders.length > 0
                          ? Math.round((paymentStats.successfulPayments / orders.length) * 100)
                          : 0}%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Success Rate</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Simplified Transaction List - Financial Focus Only */}
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    {/* Left: Transaction Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            order.status === "paid"
                              ? "bg-green-100"
                              : order.status === "refunded"
                              ? "bg-blue-100"
                              : order.status === "failed"
                              ? "bg-red-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          {order.status === "paid" && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {order.status === "refunded" && <RefreshCw className="w-5 h-5 text-blue-600" />}
                          {order.status === "failed" && <X className="w-5 h-5 text-red-600" />}
                          {order.status === "created" && <Clock className="w-5 h-5 text-yellow-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{order.eventTitle}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(order.createdAt.toString())} • Order #{order.bookingNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Center: Payment Details */}
                    <div className="hidden md:flex items-center gap-6 mx-6">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Method</p>
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                          <CreditCard className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">Card</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Tickets</p>
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">{order.ticketCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Status */}
                    <div className="text-right">
                      <p
                        className={`text-2xl font-black mb-1 ${
                          order.status === "paid"
                            ? "text-green-600"
                            : order.status === "refunded"
                            ? "text-blue-600"
                            : order.status === "failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.status === "refunded" ? "+" : "-"}
                        {formatCurrency(order.finalAmount*100, order.currency)}
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusDisplay(order.status)}
                        </span>
                        <button
                          onClick={() => toggleExpandPayment(order._id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedPayment === order._id ? (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Financial Details */}
                  {expandedPayment === order._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                          <p className="text-xs font-mono text-gray-900 break-all">
                            {order.razorpayPaymentId?.slice(-12) || "Pending"}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Gateway Order</p>
                          <p className="text-xs font-mono text-gray-900 break-all">
                            {order.razorpayOrderId.slice(-12)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Currency</p>
                          <p className="text-sm font-bold text-gray-900">{order.currency}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
  <p className="text-xs text-gray-500 mb-1">Amount Breakdown</p>
  <p className="text-xs text-gray-900">
    {order.ticketCount}x tickets = {formatCurrency(order.amount, order.currency)}
  </p>
  {order.offerAmount > 0 && (
    <p className="text-xs text-green-600 font-medium">
      Offer Discount: -{formatCurrency(order.offerAmount, order.currency)}
    </p>
  )}
  <p className="text-xs font-semibold text-gray-900">
    Final Paid: {formatCurrency((order.finalAmount??order.amount)*100, order.currency)}
  </p>
</div>

                      </div>

                      {order.refundId && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <RefreshCw className="w-4 h-4 text-blue-600" />
                            <p className="text-sm font-bold text-blue-900">Refund Information</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="text-blue-600 mb-1">Refund ID</p>
                              <p className="font-mono text-blue-900">{order.refundId}</p>
                            </div>
                            <div>
                              <p className="text-blue-600 mb-1">Refund Amount</p>
                              <p className="font-bold text-blue-900">
                                {formatCurrency((order.finalAmount)*100, order.currency)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                        >
                          View Full Order Details
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {orders.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              {activeTab === "orders" ? (
                <Calendar className="w-16 h-16 text-gray-400" />
              ) : (
                <CreditCard className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {activeTab === "orders" ? "No Orders Found" : "No Payment History"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {activeTab === "orders"
                ? "Try adjusting your search criteria or browse events to make your first booking."
                : "You haven't made any payments yet. Start booking events to see your payment history here."}
            </p>
            <Link
              to="/events"
              className="inline-block px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-md transition-all"
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
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
              }`}
            >
              Previous
            </button>
            <span className="px-6 py-3 bg-white rounded-xl text-gray-900 font-semibold border border-gray-200 shadow-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrderPage;