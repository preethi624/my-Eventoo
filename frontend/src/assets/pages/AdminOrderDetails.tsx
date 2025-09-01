import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminRepository } from "../../repositories/adminRepositories";
import AdminLayout from "../components/AdminLayout";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Ticket, 
  
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Building2,
  Mail,
  Hash
} from "lucide-react";

type OrderDetail = {
  _id: string;
  razorpayOrderId: string;
  createdAt: string;
  bookingStatus: string;
  ticketCount: number;
  amount: number;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventId:{
    venue:string;
    date:Date;
    organiser:{
        name:string
    };
    
  }
  
  userId:{
        email:string;
        name:string
    }
};

const AdminOrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("orderIDD",orderId);
  console.log("front order",orderId);
  

  useEffect(() => {
    if (orderId) fetchOrderDetails(orderId);
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await adminRepository.fetchOrderById(id);
      if (response) {
        setOrder(response.orders);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-600 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <XCircle className="w-16 h-16 text-red-400" />
            <div className="text-xl font-medium text-gray-700">Order not found</div>
            <p className="text-gray-500">The order you are looking for does not exist or has been removed.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -m-6 p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex items-center gap-3 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-md hover:border-gray-300 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-gray-900">Back</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1">Complete order information and payment details</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="font-mono text-sm text-gray-700">{order.razorpayOrderId}</span>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(order.bookingStatus)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.bookingStatus)}`}>
                    {order.bookingStatus.charAt(0).toUpperCase() + order.bookingStatus.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{(order.amount/100).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Event & Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Event Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{order.eventTitle}</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">
                        {new Date(order.eventId.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-gray-700">{order.eventId.venue}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Organized by</span>
                  <span className="font-semibold text-gray-900">{order.eventId.organiser.name}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-mono text-sm bg-white px-2 py-1 rounded border">{order.razorpayOrderId}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tickets Booked</span>
                    <span className="font-bold text-lg text-gray-900">{order.ticketCount}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Booking Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <span className="text-emerald-700 font-medium">Total Amount</span>
                    <span className="font-bold text-xl text-emerald-700">₹{(order.amount/100).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer & Payment Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Customer</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{order.userId.name}</p>
                    <p className="text-sm text-gray-500">Customer Name</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{order.userId.email}</p>
                    <p className="text-sm text-gray-500">Email Address</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Payment</h3>
              </div>
              
              {order.bookingStatus==="confirmed"?(<div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-violet-700 font-medium">Payment Method</span>
                    <span className="text-sm bg-violet-100 text-violet-800 px-2 py-1 rounded-full">Razorpay</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tickets × {order.ticketCount}</span>
                    <span className="font-medium">₹{(order.amount/100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-violet-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-violet-800">Total Paid</span>
                      <span className="font-bold text-lg text-violet-800">₹{(order.amount/100).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">
                    Transaction processed securely via Razorpay
                  </p>
                </div>
              </div>):(
    // ❌ Show fallback if NOT confirmed
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
      <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
      <p className="font-semibold text-red-700">
        Payment not completed
      </p>
      <p className="text-sm text-red-500">
        {order.bookingStatus === "pending"
          ? "Awaiting payment confirmation."
          : "This order was not paid or has been cancelled."}
      </p>
    </div>
  )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;