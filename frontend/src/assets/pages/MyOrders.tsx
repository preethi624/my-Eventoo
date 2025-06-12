import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CreditCard, Search, Filter, Download, Eye, MoreVertical, AlertCircle, Loader2 } from 'lucide-react';
import { paymentRepository } from '../../repositories/paymentRepositories';

import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/stroe';
import UserNavbar from '../components/UseNavbar';
import { Bookmark } from "lucide-react";
import type { IGetOrdersResponse, IOrder } from '../../interfaces/IOrder';
import { Link } from 'react-router-dom';






const MyOrderPage: React.FC = () => {
  console.log("myorder page renderd");
  
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [debounceSearch,setDebounceSearch]=useState(searchTerm)
  
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
 
  // Fetch orders from backend

  useEffect(() => {

       fetchOrders();

   
   
  }, [currentPage,debounceSearch,statusFilter]);
     
      const params=new URLSearchParams();
  if(searchTerm){
  
   
    
    params.append('searchTerm',searchTerm);}
  if(statusFilter!='all')params.append('status',statusFilter)
  

/*useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, statusFilter]);*/

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

 /* const filteredOrders =orders.slice()
  .sort((a,b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .filter(order => {
   
    
    const matchesSearch = order.eventDetails.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });*/

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'created': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'paid': return 'Confirmed';
      case 'created': return 'Pending';
      case 'failed': return 'Failed';
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

  const handleDownloadTicket = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/ticket`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to download ticket:', err);
    }
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
              <option value="paid">Confirmed</option>
              <option value="created">Pending</option>
              <option value="failed">Failed</option>
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
                           {formatDate(order.eventDetails.createdAt.toString())}
                        </div>

                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusDisplay(order.status)}
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