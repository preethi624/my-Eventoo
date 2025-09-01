import React, { useState, useEffect } from "react";
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
  Download,
  Share2,
  Clock,
  CheckCircle,
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
  const [refundId,setRefundId]=useState("")

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
      setOrder(response.order);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancel=async(orderId:string)=>{
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
      if(result.isConfirmed){
        const response=await organiserRepository.cancelOrder(orderId);
        setRefundId(response.refundId);
       fetchOrderDetails()

      }else{
         MySwal.fire(
          <p>Safe!</p>,
          <p>Your booking is not cancelled.</p>,
          "info"
        );
      }

      
    } catch (error) {
      console.log(error);
      MySwal.fire(
        <p>Error</p>,
        <p>Something went wrong while cancelling the booking.</p>,
        "error"
      );
      
    }
   
  }

  if (loading) {
    return (
      <OrganiserLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading order details...</p>
          </div>
        </div>
      </OrganiserLayout>
    );
  }

  if (error || !order) {
    return (
      <OrganiserLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md w-full">
            <div className="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/organiserBookings")}
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Orders
      </button>

      {/* Cancel Button */}
      {order.bookingStatus === "confirmed" && (
        <button
         onClick={()=>handleCancel(order._id)}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md"
        >
          Cancel Ticket
        </button>
      )}
    </div>
  </div>
</div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
<div
  className={`rounded-2xl p-6 mb-8 text-white shadow-lg ${
    order.bookingStatus === "confirmed"
      ? "bg-gradient-to-r from-green-500 to-emerald-500"
      : order.bookingStatus === "cancelled"
      ? "bg-gradient-to-r from-red-500 to-rose-500"
      : "bg-gradient-to-r from-yellow-400 to-yellow-300"
  }`}
>
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div
        className={`rounded-full p-2 ${
          order.bookingStatus === "confirmed"
            ? "bg-white/20"
            : order.bookingStatus === "cancelled"
            ? "bg-white/30"
            : "bg-white/20"
        }`}
      >
        <CheckCircle className="w-6 h-6" />
      </div>

      {order.bookingStatus === "confirmed" ? (
        <div>
          <h2 className="text-xl font-bold">Order Confirmed</h2>
          <p className="text-green-100">
            Payment successful • Order ID: #{orderId}
          </p>
        </div>
      ) : order.bookingStatus === "cancelled" ? (
        <div>
          <h2 className="text-xl font-bold">Order Cancelled</h2>
          <p className="text-red-100">
            Refund successful • Refund ID: {order.refundId}
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold">Order Pending</h2>
          <p className="text-yellow-100">Waiting for payment confirmation</p>
        </div>
      )}
    </div>

    <div className="text-right">
      <p className="text-white/80 text-sm">Total Amount</p>
      <p className="text-2xl font-bold">₹{order.amount / 100}</p>
    </div>
  </div>
</div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={getEventImage(order)}
                    alt={typeof order.eventId !== "string" ? order.eventId.title : ""}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                      {typeof order.eventId !== "string" ? order.eventId.title : ""}
                    </h1>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-600">Date & Time</p>
                          <p className="text-gray-900 font-semibold">
                            {formatDate(
                              typeof order.eventId !== "string" ? order.eventId.date.toString() : ""
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl">
                        <div className="bg-purple-100 rounded-lg p-2">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-600">Venue</p>
                          <p className="text-gray-900 font-semibold">
                            {typeof order.eventId !== "string" ? order.eventId.venue : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                        <div className="bg-green-100 rounded-lg p-2">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600">Tickets</p>
                          <p className="text-gray-900 font-semibold">{order.ticketCount} tickets</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-xl">
                        <div className="bg-orange-100 rounded-lg p-2">
                          <CreditCard className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-600">Amount Paid</p>
                          <p className="text-gray-900 font-semibold">₹{order.amount / 100}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Details
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {typeof order.userId !== "string" ? order.userId.name : ""}
                    </h4>
                    <p className="text-gray-500">Customer</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {typeof order.userId !== "string" ? order.userId.email : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="bg-green-100 rounded-lg p-2">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {typeof order.userId !== "string" ? order.userId.phone : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                        <p className="text-sm font-medium text-gray-900">
                          {typeof order.userId !== "string" ? order.userId.location : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              
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
  if (order&&order.eventId) {
    const img = order.eventId.images[0]; 

    
    if (typeof img === "string") {
      if (img.startsWith("http")) {
        return imageSrc = img; 
      } else {
        // Local stored image (uploads/myimage.jpg)
        return imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
      }
    } else if (typeof img === "object" && img.url) {
      // Case 2: if Mongo stores { url: "..." }
      return imageSrc = img.url;
    }
  }
};

export default OrgOrderDetailsPage;