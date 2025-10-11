import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  AlertCircle,
  User,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import type { IOrder } from "../../interfaces/IOrder";

import { organiserRepository } from "../../repositories/organiserRepositories";
import OrganiserLayout from "../components/OrganiserLayout";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const OrgOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const MySwal = withReactContent(Swal);
  const [refundId, setRefundId] = useState("");
  console.log(refundId);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      if (!orderId) throw new Error("Invalid order or user ID");
      const response = await organiserRepository.getOrderDetails(orderId);
      console.log("respooo", response);

      if (!response.success) throw new Error("Failed to fetch order details");
      setOrder(response.order ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
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
        const response = await organiserRepository.cancelOrder(orderId);

        setRefundId(response.refund);
        fetchOrderDetails();
      } else {
        MySwal.fire(<p>Safe!</p>, <p>Your booking is not cancelled.</p>, "info");
      }
    } catch (error) {
      console.log(error);
      MySwal.fire(
        <p>Error</p>,
        <p>Something went wrong while cancelling the booking.</p>,
        "error"
      );
    }
  };

  if (loading) {
    return (
      <OrganiserLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="text-gray-300 text-lg font-medium">Loading order details...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
          </div>
        </div>
      </OrganiserLayout>
    );
  }

  if (error || !order) {
    return (
      <OrganiserLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-500/20 max-w-md w-full">
            <div className="bg-red-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-red-500/30">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Oops! Something went wrong</h2>
            <p className="text-gray-400 mb-6">{error || "Order not found"}</p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </OrganiserLayout>
    );
  }

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Back Button */}
                <button
                  onClick={() => navigate("/organiserBookings")}
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Orders</span>
                </button>

                {/* Cancel Button */}
                {order.bookingStatus === "confirmed" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-red-500/50"
                  >
                    Cancel Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Banner */}
          <div
            className={`rounded-2xl p-6 mb-8 text-white shadow-2xl border ${
              order.bookingStatus === "confirmed"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 border-green-500/30"
                : order.bookingStatus === "cancelled"
                ? "bg-gradient-to-r from-red-600 to-rose-600 border-red-500/30"
                : "bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`rounded-full p-3 ${
                    order.bookingStatus === "confirmed"
                      ? "bg-white/20"
                      : order.bookingStatus === "cancelled"
                      ? "bg-white/30"
                      : "bg-white/20"
                  }`}
                >
                  {order.bookingStatus === "confirmed" ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : order.bookingStatus === "cancelled" ? (
                    <XCircle className="w-7 h-7" />
                  ) : (
                    <Clock className="w-7 h-7" />
                  )}
                </div>

                {order.bookingStatus === "confirmed" ? (
                  <div>
                    <h2 className="text-2xl font-bold">Order Confirmed</h2>
                    <p className="text-green-100 mt-1">
                      Payment successful • Order ID: #{orderId}
                    </p>
                  </div>
                ) : order.bookingStatus === "cancelled" ? (
                  <div>
                    <h2 className="text-2xl font-bold">Order Cancelled</h2>
                    <p className="text-red-100 mt-1">
                      Refund successful • Refund ID: {order.refundId}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold">Order Pending</h2>
                    <p className="text-yellow-100 mt-1">Waiting for payment confirmation</p>
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="text-white/80 text-sm font-medium">Total Amount</p>
                <p className="text-3xl font-bold mt-1">₹{order.amount / 100}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 hover:shadow-blue-500/10 transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={getEventImage(order)}
                    alt={typeof order.eventId !== "string" ? order.eventId.title : ""}
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                      {typeof order.eventId !== "string" ? order.eventId.title : ""}
                    </h1>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <div className="bg-blue-500/20 rounded-lg p-2.5">
                          <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-400 mb-1">Date & Time</p>
                          <p className="text-gray-200 font-semibold">
                            {formatDate(
                              typeof order.eventId !== "string" ? order.eventId.date.toString() : ""
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <div className="bg-purple-500/20 rounded-lg p-2.5">
                          <MapPin className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-400 mb-1">Venue</p>
                          <p className="text-gray-200 font-semibold">
                            {typeof order.eventId !== "string" ? order.eventId.venue : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                        <div className="bg-green-500/20 rounded-lg p-2.5">
                          <Users className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-400 mb-1">Tickets</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-gray-200 font-semibold">{order.ticketCount} tickets</p>
                            {order.selectedTicket && (
                              <span
                                className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-md
                                  ${
                                    order?.selectedTicket?.type === "VIP"
                                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-400"
                                      : ""
                                  }
                                  ${
                                    order?.selectedTicket?.type === "Premium"
                                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border border-blue-400"
                                      : ""
                                  }
                                  ${
                                    order?.selectedTicket?.type === "Economic"
                                      ? "bg-gradient-to-r from-green-500 to-lime-400 text-white border border-green-400"
                                      : ""
                                  }
                                `}
                              >
                                {order.selectedTicket.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <div className="bg-orange-500/20 rounded-lg p-2.5">
                          <CreditCard className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-400 mb-1">Amount Paid</p>
                          <p className="text-gray-200 font-semibold text-lg">₹{order.amount / 100}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Details
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <User className="w-9 h-9 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      {typeof order.userId !== "string" ? order.userId.name : ""}
                    </h4>
                    <p className="text-gray-400 mt-1">Customer</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                      <div className="bg-blue-500/20 rounded-lg p-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Email</p>
                        <p className="text-sm font-medium text-gray-200 truncate mt-1">
                          {typeof order.userId !== "string" ? order.userId.email : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                      <div className="bg-green-500/20 rounded-lg p-2">
                        <Phone className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Phone</p>
                        <p className="text-sm font-medium text-gray-200 mt-1">
                          {typeof order.userId !== "string" ? order.userId.phone : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                      <div className="bg-purple-500/20 rounded-lg p-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Location</p>
                        <p className="text-sm font-medium text-gray-200 mt-1">
                          {typeof order.userId !== "string" ? order.userId.location : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrganiserLayout>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEventImage = (order: IOrder) => {
  let imageSrc = "https://via.placeholder.com/300x200";
  if (order && typeof order.eventId !== "string") {
    const img = order.eventId.images[0];

    if (typeof img === "string") {
      if (img.startsWith("http")) {
        return (imageSrc = img);
      } else {
        return (imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`);
      }
    } else if (typeof img === "object" && img.url) {
      return (imageSrc = img.url);
    }
    return imageSrc;
  }
};

export default OrgOrderDetailsPage;