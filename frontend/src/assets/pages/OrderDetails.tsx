import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { paymentRepository } from "../../repositories/paymentRepositories";
import { useSelector } from "react-redux";

import type { IOrder } from "../../interfaces/IOrder";
import type { RootState } from "../../redux/stroe";
import targetLogo from "../images/target_3484438 (2).png";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
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
let imagePath = "https://via.placeholder.com/300x200";
  if (order && order.eventId.images.length > 0) {
    const img = order.eventId.images[0];
    const imageUrl = typeof img === "string" ? img : img.url;
    if (imageUrl.startsWith("http")) {
      imagePath = imageUrl;
    } else {
      imagePath = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
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

    //const order = orders.find((o) => o._id === orderId);
    if (!order) return;
    const logoBase64 = await getBase64FromImage(targetLogo);

    const doc = new jsPDF();

    for (let i = 0; i < tickets.length; i++) {
      const logoX = 70;
      const logoY = 20;
      const logoWidth = 15;
      const logoHeight = 15;

      // Draw logo
      doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);

      // Set font for title
      doc.setFontSize(18);
      doc.setTextColor(0);

      // Place event title to the right of logo
      const textX = logoX + logoWidth + 5; // 5 is padding between image and text
      const textY = logoY + logoHeight / 2 + 2; // vertically center align text with image
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
        image: getEventImage(order),
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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Order not found"}</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/my-bookings")}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Order Status Banner */}
          <div className={`p-4 ${getStatusBackgroundColor(order.status)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Order Status</p>
                <h2 className="text-2xl font-bold text-white">
                  {getStatusDisplay(order.status)}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">Order ID</p>
                <p className="text-lg font-mono text-white">{order.orderId}</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 border-b">
            <div className="flex items-start">
              <img
                src={getEventImage(order)}
                alt={
                  typeof order.eventId !== "string" ? order.eventId.title : ""
                }
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {typeof order.eventId !== "string" ? order.eventId.title : ""}
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>
                      {formatDate(
                        typeof order.eventId !== "string"
                          ? order.eventId.date.toString()
                          : ""
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>
                      {typeof order.eventId !== "string"
                        ? order.eventId.venue
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{order.ticketCount} tickets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 border-b">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Details
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium text-gray-900">Online Payment</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-medium text-gray-900">
                    {order.razorpayOrderId || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(order.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(order.createdAt.toString())}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 flex justify-end space-x-4">
            {order.status !== "paid" && (
              <button
                onClick={handleRepayment}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Retry Payment
              </button>
            )}
            {order.status === "paid" && (
              <button
                onClick={() => handleDownloadTicket(order._id)}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {/* <Download className="w-5 h-5 mr-2" />*/}
                Download Ticket
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStatusBackgroundColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-600";
    case "created":
      return "bg-yellow-600";
    case "failed":
      return "bg-red-600";
    default:
      return "bg-gray-600";
  }
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

const getEventImage = (order: IOrder) => {
  if (order.eventId) {
    const imagePath =
      typeof order.eventId != "string"
        ? order.eventId.images[0].replace(/\\/g, "/")
        : "";
    return `${imagePath}`;
  }
  return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&auto=format";
};

export default OrderDetailsPage;
