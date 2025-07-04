import React, { useEffect, useState } from 'react';


import OrganiserLayout from '../components/OrganiserLayout';

import { useSelector } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';



import { organiserRepository } from '../../repositories/organiserRepositories';

import type { OrderDetails } from '../../interfaces/IPayment';

import { useNavigate } from 'react-router-dom';

import { Eye } from 'lucide-react';
import DataTable from '../components/DataTable';




export type EventForm = {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  ticketPrice: string;
  capacity: string;
  images: FileList | [];
  latitude: string;
  longitude: string;
};

export type EventEdit = {
  id:string;
 
  title: string;
  date: string;
  venue: string;
  ticketsSold?: number;
  status: string;
  description:string;
  ticketPrice:number;
  capacity:number;
  category:string;
  time:string;

};

type Organiser = {
  id: string;
};

type RootState = {
  auth: {
    organiser: Organiser;
  };
};

const OrganiserBookings: React.FC = () => {
  const navigate = useNavigate();


  const [orders, setOrders] = useState<OrderDetails[]>([]);
 
  const organiser = useSelector((state: RootState) => state.auth.organiser);
  const [currentPage,setCurrentPage]=useState(1);
  const [totalPage,setTotalPage]=useState(1);
  const[statusFilter,setStatusFilter]=useState('all');
  const [searchTerm,setSearchTerm]=useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const limit=5;
 
  

  useEffect(() => {
    fetchOrders();
  }, [currentPage,searchTerm,statusFilter,selectedDate]);
  
  
  

 
  

  const fetchOrders = async () => {
    try {
      const params=new URLSearchParams();
  if(searchTerm){
  
   
    
    params.append('searchTerm',searchTerm);}
  if(statusFilter!='all')params.append('status',statusFilter)
    if (selectedDate) params.append('date', selectedDate);

      const orgId=organiser?.id
      const response=await organiserRepository.fetchBookings(orgId,currentPage,limit,params.toString());
      
      
     
      
  
      
      
     
      if (response.success&&response.result) {
        setOrders(response.result);
        setTotalPage(response.totalPages);
      
        
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  const handleNextPage = () => {
  if (currentPage < totalPage) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};
     

  
 const handleDetails=async(orderId:string)=>{
  navigate(`/orgOrderDetails/:${orderId}`)
  
 
 


 }
 const handleResetFilters = () => {
  setSearchTerm('');
  setSelectedDate('');
  setStatusFilter('all')
  setCurrentPage(1);
};

 const orderColumns = [
  { header: 'OrderId', accessor: 'razorpayOrderId' },
  {
    header: 'Created At',
    accessor: 'createdAt',
    render: (order: any) => new Date(order.createdAt).toLocaleDateString()
  },
  { header: 'Event Name', accessor: 'eventTitle' },
  {
    header: 'Ticket Sold',
    accessor: 'ticketCount',
    render: (order: any) => order.ticketCount || 0
  },
  { header: 'Booking Status', accessor: 'bookingStatus' },
  {
    header: 'View Details',
    accessor: 'actions',
    render: (order: any) => (
      <button
        onClick={() => handleDetails(order._id)}
        className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-black hover:bg-blue-700 rounded transition duration-200"
      >
        <Eye className="w-4 h-4" />
        View
      </button>
    )
  }
];

  

  return (
    <OrganiserLayout>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Events</h2>
       
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center justify-between">
  <input
    type="text"
    placeholder="Search by event or order ID"
    className="border px-3 py-1 rounded w-full sm:w-64"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <input
  type="date"
  className="border px-3 py-1 rounded w-full sm:w-48"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>

  
  <select
    className="border px-3 py-1 rounded w-full sm:w-48"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="all">All Statuses</option>
    <option value="confirmed">Confirmed</option>
    <option value="cancelled">Cancelled</option>
    <option value="pending">Pending</option>
  </select>
  <button
    onClick={handleResetFilters}
    className="bg-black text-white px-8 py-1 rounded hover:bg-red-600"
  >
    ResetFilters
  </button>

</div>


      <div className="bg-white shadow-md rounded p-4 overflow-x-auto">
       
  <DataTable data={orders} columns={orderColumns} />


        
        {totalPage>1&&(<div className="flex justify-center mt-4 gap-2">
  <button
    onClick={handlePrevPage}
    disabled={currentPage === 1}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Previous
  </button>
  {Array.from({ length: totalPage }, (_, index) => (
    <button
      key={index}
      onClick={() => setCurrentPage(index + 1)}
      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-300'}`}
    >
      {index + 1}
    </button>
  ))}
  <button
    onClick={handleNextPage}
    disabled={currentPage === totalPage}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>)}

      </div>

      
    </OrganiserLayout>
  );
};

export default OrganiserBookings;
