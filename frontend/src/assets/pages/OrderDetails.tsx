import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Ticket
} from "lucide-react";
import { paymentRepository } from "../../repositories/paymentRepositories";
import { useSelector } from "react-redux";

import type { IOrder } from "../../interfaces/IOrder";
import type { RootState } from "../../redux/stroe";
import targetLogo from "../images/target_3484438 (2).png";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import UserNavbar from "../components/UseNavbar";

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

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  let imageSrc = "https://via.placeholder.com/300x200";

  if (order && order.eventId && typeof order.eventId !== "string") {
    if (order.eventId.images.length > 0) {
      const img = order.eventId.images[0];

      if (typeof img === "string") {
        if (img.startsWith("http")) {
          imageSrc = img;
        } else {
          imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
        }
      } else if (typeof img === "object" && img.url) {
        imageSrc = img.url;
      }
    }
  }

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
          setError(
            "Razorpay SDK failed to load. Please check your connection."
          );
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const handleDownloadTicket = async (orderId: string) => {
    const response = await paymentRepository.getTickets(orderId);
    const tickets = response.result;
    if (!tickets || tickets.length === 0) return;

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
      doc.text(
        `Date: ${formatDate(order.eventDetails?.date.toString())}`,
        20,
        75
      );
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

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      if (!orderId || !user?.id) throw new Error("Invalid order or user ID");
      const response = await paymentRepository.getOrderDetails(
        orderId,
        user.id
      );

      if (!response.success) throw new Error("Failed to fetch order details");
      setOrder(response.order);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRepayment = async () => {
    try {
      if (!order || !user?.id || !order.razorpayOrderId) return;
      const options = {
        key: "rzp_test_4MBYamMKeUifHI",
        amount: order.amount,
        currency: "INR",
        name: typeof order.eventId !== "string" ? order.eventId.title : "Event",
        description: "Event Booking",
        image: imageSrc,
        order_id: order.razorpayOrderId,
        handler: async function (response: any) {
          const verificationResponse = await paymentRepository.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verificationResponse.success) {
            fetchOrderDetails();
          } else {
            setError("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      setError("Failed to initiate Razorpay payment");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-8 h-8" />;
      case "created":
        return <Clock className="w-8 h-8" />;
      case "failed":
        return <XCircle className="w-8 h-8" />;
      default:
        return <AlertCircle className="w-8 h-8" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "from-green-500 to-emerald-500";
      case "created":
        return "from-yellow-500 to-orange-500";
      case "failed":
        return "from-red-500 to-pink-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group max-w-md w-full"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 text-center shadow-2xl">
            <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-white mb-4">Error</h2>
            <p className="text-gray-400 text-lg mb-8">{error || "Order not found"}</p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-2xl shadow-purple-500/50"
            >
              Back to Orders
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <UserNavbar/>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/my-bookings")}
            className="flex items-center gap-3 text-gray-700 hover:text-gray-900 mb-8 transition-colors group px-6 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-gray-300 hover:border-purple-500/50"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-gray-900">Back to Orders</span>
          </motion.button>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>

            <div className="relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-2xl rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
              
              {/* Status Banner */}
              <div className={`relative p-8 bg-gradient-to-r ${getStatusColor(order.status)}`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">Order Status</p>
                      <h2 className="text-4xl font-black text-white mt-1">
                        {getStatusDisplay(order.status)}
                      </h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">Order ID</p>
                    <p className="text-xl font-mono text-white font-bold mt-1">{order.orderId}</p>
                  </div>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative group/img flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover/img:opacity-40 transition-opacity"></div>
                    <img
                      src={imageSrc}
                      alt={typeof order.eventId !== "string" ? order.eventId.title : ""}
                      className="relative w-full md:w-48 h-48 object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-3xl font-black text-gray-900">
                        {typeof order.eventId !== "string" ? order.eventId.title : ""}
                      </h3>
                      {order.selectedTicket?.type && (
                        <span className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg whitespace-nowrap">
                          {order.selectedTicket.type}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 backdrop-blur-xl rounded-xl border border-gray-200">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Date</p>
                          <span className="text-gray-900 font-semibold">
                            {formatDate(typeof order.eventId !== "string" ? order.eventId.date.toString() : "")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 backdrop-blur-xl rounded-xl border border-gray-200">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <MapPin className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Venue</p>
                          <span className="text-gray-900 font-semibold line-clamp-1">
                            {typeof order.eventId !== "string" ? order.eventId.venue : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 backdrop-blur-xl rounded-xl border border-gray-200">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                          <Users className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Tickets</p>
                          <span className="text-gray-900 font-semibold">{order.ticketCount} tickets</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 backdrop-blur-xl rounded-xl border border-gray-200">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Ticket className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Amount</p>
                          <span className="text-gray-900 font-semibold text-lg">
                            {formatCurrency(order.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-8 border-b border-gray-200">
                <h4 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  Payment Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-50 backdrop-blur-xl rounded-2xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">Payment Method</p>
                    <p className="font-bold text-gray-900 text-lg">Online Payment</p>
                  </div>
                  
                  <div className="p-5 bg-gray-50 backdrop-blur-xl rounded-2xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">Transaction ID</p>
                    <p className="font-mono text-gray-900 text-sm break-all">
                      {order.razorpayOrderId || "N/A"}
                    </p>
                  </div>
                  
                  <div className="p-5 bg-gray-50 backdrop-blur-xl rounded-2xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">Total Amount</p>
                    <p className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-2xl">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                  
                  <div className="p-5 bg-gray-50 backdrop-blur-xl rounded-2xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">Payment Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(order.createdAt.toString())}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 flex flex-col sm:flex-row justify-end gap-4">
                {order.status !== "paid" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRepayment}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-2xl shadow-green-500/50"
                  >
                    <CreditCard className="w-5 h-5" />
                    Retry Payment
                  </motion.button>
                )}
                {order.status === "paid" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadTicket(order._id)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-2xl shadow-purple-500/50"
                  >
                    <Download className="w-5 h-5" />
                    Download Ticket
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case "paid":
      return "Payment Confirmed";
    case "created":
      return "Payment Pending";
    case "failed":
      return "Payment Failed";
    default:
      return status;
  }
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount / 100);
};

export default OrderDetailsPage;