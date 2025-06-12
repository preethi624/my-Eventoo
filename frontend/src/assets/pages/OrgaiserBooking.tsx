import React, { useEffect, useState } from 'react';


import OrganiserLayout from '../components/OrganiserLayout';

import { useSelector } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';



import { organiserRepository } from '../../repositories/organiserRepositories';

import type { OrderDetails } from '../../interfaces/IPayment';

import { useNavigate } from 'react-router-dom';





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
  const [totalPage,setTotalPage]=useState(1)
  const limit=5;
 
  

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);
 
  

  const fetchOrders = async () => {
    try {
      const orgId=organiser?.id
      const response=await organiserRepository.fetchBookings(orgId,currentPage,limit);
     
      
  
      
      
     
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
  

  return (
    <OrganiserLayout>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Events</h2>
       
      </div>

      <div className="bg-white shadow-md rounded p-4 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">OrderId</th>
              <th className="p-2">createdAt</th>
              <th className="p-2">EventName</th>
              <th className="p-2">TicketSold</th>
              <th className="p-2">PaymentStatus</th>
              <th className="p-2">View Details</th>
             
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-2">{order.razorpayOrderId}</td>
                <td className="p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">{order.eventTitle}</td>
                <td className="p-2">{order.ticketCount || 0}</td>
                <td className="p-2">{order.status}</td>
                <td onClick={()=>handleDetails(order._id)}><button>Details</button></td>
                
              </tr>
            ))}
          </tbody>
        </table>
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
      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
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
