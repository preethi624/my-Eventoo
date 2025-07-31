import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CreditCard, Search, Filter, Download, Eye, MoreVertical, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { paymentRepository } from '../../repositories/paymentRepositories';

import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/stroe';
import UserNavbar from '../components/UseNavbar';
import { Bookmark } from "lucide-react";
import type { IGetOrdersResponse, IOrder } from '../../interfaces/IOrder';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { jsPDF } from "jspdf";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);









const MyOrderPage: React.FC = () => {

  
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [debounceSearch,setDebounceSearch]=useState(searchTerm);
  const [refundId,setRefundId]=useState('');
  
  const [currentPage,setCurrentPage]=useState(1);
    const [totalPages,setTotalPages]=useState(1)
    const limit=5;
  
const user=useSelector((state:RootState)=>state.auth.user);
useEffect(()=>{
  const handler=setTimeout(()=>{
    setDebounceSearch(searchTerm)

  },500)
  return () => clearTimeout(handler);

},[searchTerm])
 
 

  useEffect(() => {
   

       fetchOrders();

   
   
  }, [currentPage,debounceSearch,statusFilter]);
     
      const params=new URLSearchParams();
  if(searchTerm){
  
   
    
    params.append('searchTerm',searchTerm);}
  if(statusFilter!='all')params.append('status',statusFilter)
    
  


  const fetchOrders = async () => {
    try {
   
      
    

      
 
 setLoading(true);
     
      const userId=user?.id
     
      if(!userId){
        throw new Error("userId not present")
      }
     
      
      
      const response:IGetOrdersResponse=await paymentRepository.getOrders(userId,currentPage,limit,params.toString());
      console.log("response",response);
      
     
      
     
      

      if (!response.success) {
        throw new Error('Failed to fetch orders');
      }
      
     if(response.order){
      
      setOrders(response.order.orders);
      setTotalPages(response.order.totalPages);
     
      
      
      
    
      

     }
     
     
    
       
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
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
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
     
    }
  }


  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'paid': return 'Confirmed';
      case 'created': return 'Pending';
      case 'failed': return 'Failed';
      default: return status;
    }
  };
   const getBookingStatusDisplay = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'cancelled';
      default: return status;
    }
  };
  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount/100);
  };

  const getEventImage = (order: IOrder) => {
    // Priority: eventDetails.image > eventDetails.images[0] > default placeholder
    
    if (order.eventDetails?.images && order.eventDetails.images.length > 0) {
      const imagePath=order.eventDetails.images[0].replace(/\\/g, '/');
      return `http://localhost:3000/${imagePath}`; 
    }
    // Default placeholder image
    return `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&auto=format`;
  };
 
 const handleCancelBooking = async (orderId: string) => {
  try {
    const result = await MySwal.fire({
      title: <p>Are you sure?</p>,
      html: <p>Do you really want to cancel this booking?</p>,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      const response = await paymentRepository.findOrder(orderId);
     if(response.success){
       setRefundId(response.refund.response.refundId);
      fetchOrders();

      MySwal.fire(<p>Cancelled!</p>, <p>Your booking has been cancelled.</p>, 'success');

     }else{
       MySwal.fire(<p>Failed</p>, <p>{response.message}</p>, 'success');

     }

     
    } else {
      MySwal.fire(<p>Safe!</p>, <p>Your booking is not cancelled.</p>, 'info');
    }
  } catch (error) {
    console.log(error);
    MySwal.fire(<p>Error</p>, <p>Something went wrong while cancelling the booking.</p>, 'error');
  }
};
  console.log("refundid",refundId);
  

  
  /*const handleDownloadTicket = async (orderId: string) => {
    
const response=await paymentRepository.getTickets(orderId);
const tickets=response.result;
if (!tickets || tickets.length === 0) return;

  const order = orders.find(o => o._id === orderId);
  if (!order) return;

  const doc = new jsPDF();
   for (let i = 0; i < tickets.length; i++) {
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    doc.text("🧭 EVENTOO", 105, 25, { align: "center" });
    const qrText = `https://myeventsite.com/verify/${response.result.qrToken}`; 
    const qrImage = await QRCode.toDataURL(qrText);
   doc.text(`Ticket Confirmation`, 10, 10);
  doc.text(`Event: ${order.eventTitle}`, 10, 20);
  doc.text(`Date: ${formatDate(order.eventDetails?.date.toString())}`, 10, 30);
  doc.text(`Venue: ${order.eventDetails?.venue}`, 10, 40);
  doc.text(`Order ID: ${order.orderId}`, 10, 50);
  doc.text(`Tickets: ${order.ticketCount}`, 10, 60);
  doc.text(`Amount Paid: ${formatCurrency(order.amount)}`, 10, 70);

  
  doc.addImage(qrImage, 'PNG', 10, 80, 50, 50);
   if (i !== tickets.length - 1) {
      doc.addPage();
    }
  }

  doc.save(`ticket_${order.eventTitle.replace(/\s+/g, '_')}.pdf`);
};*/
const handleDownloadTicket = async (orderId: string) => {
  const response = await paymentRepository.getTickets(orderId);
  const tickets = response.result;
  if (!tickets || tickets.length === 0) return;

  const order = orders.find(o => o._id === orderId);
  if (!order) return;

  const doc = new jsPDF();

  for (let i = 0; i < tickets.length; i++) {
   
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(" Ticket Confirmation ", 105, 45, { align: "center" });
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
    doc.text("✨ Thank you for booking with EVENTOO ✨", 105, 130, { align: "center" });

    if (i !== tickets.length - 1) {
      doc.addPage();
    }
  }

  doc.save(`ticket_${order.eventTitle.replace(/\s+/g, "_")}.pdf`);
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
 

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 ">
      <UserNavbar/>
      <div className="mb-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your event bookings</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by event name or order ID..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
          
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Event Image */}
                <div className="flex-shrink-0">
                  <img
                    src={getEventImage(order)}
                    alt={order.eventTitle}
                    className="w-full lg:w-48 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&auto=format';
                    }}
                  />
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{order.eventTitle}</h3>
                      <p className="text-sm text-gray-500 mb-2">Order ID: {order.orderId}</p>
                      <p className="text-sm text-gray-500 mb-2">Razorpay ID: {order.razorpayOrderId}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {order.eventDetails?.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.eventDetails.date.toString())}
                          </div>
                        )}
                        {order.eventDetails?.venue && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.eventDetails.venue}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                         <Bookmark className="w-4 h-4" />
                           {formatDate(order.createdAt.toString())}
                        </div>

                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.bookingStatus||'')}`}>
                        {getBookingStatusDisplay(order.bookingStatus||'')}
                      </span>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Ticket Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className="font-medium">{getStatusDisplay(order.status)}</p>
                      
                    </div>
                    {order.status === 'refunded' && (
  <p>Refund ID: {order.refundId}</p>
)}

                    
                    <div>
                      <p className="text-sm text-gray-500">Tickets</p>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{order.ticketCount} ticket{order.ticketCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-semibold text-lg text-green-600">{formatCurrency(order.amount, order.currency)}</p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        Razorpay
                      </div>
                      
                      {order.razorpayPaymentId && (
                        <span className="text-xs">Payment ID: {order.razorpayPaymentId.slice(-8)}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                     {order.status ==='paid' && (
        <button
  onClick={() => handleCancelBooking(order._id)}
  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center gap-2 text-sm"
>
  <XCircle className="w-4 h-4" />
  Cancel Booking
</button>

      )} 
  <Link
    to={`/order/${order._id}`}
    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2 text-sm"
  >
    <Eye className="w-4 h-4" />
    View Details
  </Link>

  {order.status === 'paid' && (
    <button 
      onClick={() => handleDownloadTicket(order._id)}
      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm"
    >
      <Download className="w-4 h-4" />
      Download Ticket
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
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse events to make your first booking.</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Events
          </button>
        </div>

      )}
      {/* Pagination Controls */}
{totalPages > 1 && (
  <div className="flex justify-center items-center mt-6 gap-4">
    <button
      onClick={handlePrevPage}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded ${
        currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      Previous
    </button>
    
    <span className="text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    
    <button
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded ${
        currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      Next
    </button>
  </div>
)}


      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'paid').length}
              </p>
              <p className="text-sm text-gray-500">Confirmed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'created').length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(orders.filter(o => o.status === 'paid').reduce((sum, order) => sum + order.amount, 0))}
              </p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrderPage;