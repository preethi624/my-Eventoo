import { useEffect, useState } from "react";
import OrganiserLayout from "../components/OrganiserLayout";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { organiserRepository } from "../../repositories/organiserRepositories";
import type { OrderDetails } from "../../interfaces/IPayment";
import { useNavigate } from "react-router-dom";
import { Eye, Search, Calendar, RotateCcw } from "lucide-react";
import DataTable from "../components/DataTable";
import type { RootState } from "../../redux/stroe";

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

const OrganiserBookings: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const organiser = useSelector((state: RootState) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, selectedDate, limit]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      if (statusFilter != "all") params.append("status", statusFilter);
      if (selectedDate) params.append("date", selectedDate);

      const orgId = organiser?.id;
      if (!orgId) {
        throw new Error("no orgId");
      }
      const response = await organiserRepository.fetchBookings(
        orgId,
        currentPage,
        limit,
        params.toString()
      );

      if (response.success && response.result) {
        setOrders(response.result);
        setTotalPage(response.totalPages);
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
    navigate(`/orgOrderDetails/:${orderId}`);
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
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      ),
    },
  ];

  return (
    <OrganiserLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Event Bookings
          </h2>
          <p className="text-gray-400">Manage and track all your event bookings</p>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by event or order ID"
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Date Input */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/50 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-gray-700/50 gap-4">
            <div className="flex items-center gap-3">
              <label className="text-gray-300 font-medium">Rows per page:</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="text-gray-300 font-medium bg-gray-900/50 px-4 py-2 rounded-lg">
              Page {currentPage} of {totalPage}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <DataTable data={orders} columns={orderColumns} />
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center p-6 border-t border-gray-700/50 gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg disabled:hover:bg-gray-700"
            >
              Previous
            </button>

            <div className="px-6 py-2.5 bg-gray-900/50 text-gray-300 rounded-lg font-medium">
              Page {currentPage} of {totalPage}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPage}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/50 disabled:hover:from-blue-600 disabled:hover:to-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </OrganiserLayout>
  );
};

export default OrganiserBookings;