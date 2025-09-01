import React, { useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";

import type { OrderDetails } from "../../interfaces/IPayment";

import { useNavigate } from "react-router-dom";

import { Eye } from "lucide-react";
import DataTable from "../components/DataTable";
import { adminRepository } from "../../repositories/adminRepositories";
import AdminLayout from "../components/AdminLayout";

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
  id: string;

  title: string;
  date: string;
  venue: string;
  ticketsSold?: number;
  status: string;
  description: string;
  ticketPrice: number;
  capacity: number;
  category: string;
  time: string;
};

const AdminBookings: React.FC = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDetails[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [orgSearch, setOrgSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [limit,setLimit]=useState(10)

  

  useEffect(() => {
    fetchOrders();
  }, [
    currentPage,

    statusFilter,
    selectedDate,
    limit
    
  ]);
  useEffect(()=>{
    const handler=setTimeout(()=>{
      fetchOrders()

    },500)
    return ()=>clearTimeout(handler)

  },[searchTerm,orgSearch,userSearch])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      if (orgSearch) {
        params.append("organiser", orgSearch);
      }
      if (userSearch) {
        params.append("user", userSearch);
      }
      if (statusFilter != "all") params.append("status", statusFilter);
      if (selectedDate) params.append("date", selectedDate);
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      const response = await adminRepository.fetchBookings(params.toString());
      console.log("bookings", response);

      if (response.success && response.result) {
        setOrders(response.result.result.orders);
        setTotalPage(response.result.result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
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

  const handleDetails = async (orderId: string) => {
  
    
    navigate(`/adminOrderDetails/${orderId}`);
  };
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const orderColumns = [
    { header: "OrderId", accessor: "razorpayOrderId" },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (order: any) => new Date(order.createdAt).toLocaleDateString(),
    },
    { header: "Event Name", accessor: "eventTitle" },
    {
      header: "Ticket Sold",
      accessor: "ticketCount",
      render: (order: any) => order.ticketCount || 0,
    },
    { header: "Booking Status", accessor: "bookingStatus" },
    {
      header: "View Details",
      accessor: "actions",
      render: (order: any) => (
       
        
        <button
          onClick={() => handleDetails(order._id)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-black hover:bg-blue-700 rounded transition duration-200"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Orders</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
      
        <div className="w-full md:w-1/4 flex flex-col gap-4 mt-12">
          <input
            type="text"
            placeholder="Search by event or order ID"
            className="border px-3 py-2 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by organiser name"
            className="border px-3 py-2 rounded-full"
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by user name"
            className="border px-3 py-2 rounded-full"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded-full"
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
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-red-600"
          >
            Reset Filters
          </button>
        </div>

        
        <div className="w-full md:w-3/4 bg-white shadow-md rounded p-4 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="mr-2 text-gray-600">Rows per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border px-2 py-1 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-gray-600 text-sm">
            Page {currentPage} of {totalPage}
          </div>
        </div>
          <DataTable data={orders} columns={orderColumns} />
          <div className="flex justify-center mt-4 gap-2 flex-wrap">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-3 py-1">
            Page {currentPage} of {totalPage}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

          
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminBookings;
