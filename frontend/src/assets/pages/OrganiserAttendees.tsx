import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Calendar,
  Users,
  Ticket,
  IndianRupee,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";

import { eventRepository } from "../../repositories/eventRepositories";
import { organiserRepository } from "../../repositories/organiserRepositories";
import OrganiserLayout from "../components/OrganiserLayout";
import OrganiserFooter from "../components/OrganiserFooter";

export const AttendeesPage = () => {
  const [attendees, setAttendees] = useState<
    {
      amount: number;
      createdAt: Date;
      email: string;
      id: string;
      name: string;
      ticketCount: number;
      bookingStatus: string;
      orderId: string;
      checkedIn: boolean;
    }[]
  >([]);
  const [events, setEvents] = useState<{ _id: string; title: string; date: Date }[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [attendeesLength, setAttendeesLength] = useState(0);
  const limit = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const organiser = useSelector((state: RootState) => state.auth.user);

  const fetchEvents = async () => {
    if (!organiser?.id) return;
    const response = await eventRepository.fetchEvents(organiser.id);
    const fetchedEvents = response.events;
    if (!selectedEvent && fetchedEvents.length > 0) {
      setSelectedEvent(fetchedEvents[0]._id);
    }
    setEvents(response.events);
  };

  const fetchAttendees = async () => {
    if (!selectedEvent) return;
    if (!organiser?.id) return;

    const response = await organiserRepository.fetchAttendees(
      selectedEvent,
      organiser.id,
      searchTerm.trim(),
      filterStatus,
      currentPage,
      limit
    );
    console.log("attendees", response);

    setAttendees(response.attendee.attendee || []);
    setTotalPage(response.attendee.totalPages);
    setTotalRevenue(response.attendee.revenue);
    setAttendeesLength(response.attendee.totalAttendees);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchAttendees();
  }, [selectedEvent, searchTerm, filterStatus, currentPage]);

  const stats = useMemo(() => {
    const totalTickets = attendees.reduce((sum, a) => sum + a.ticketCount, 0);
    return { total: attendees.length, totalRevenue, totalTickets };
  }, [attendees]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <OrganiserLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Event Attendees
              </h1>
              <Sparkles className="text-yellow-400 animate-pulse w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
              Manage and track your event attendees
            </p>
          </div>

          {/* Event Selector */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              Select Event
            </label>
            <div className="relative">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white text-sm sm:text-base font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all cursor-pointer hover:bg-gray-700 appearance-none pr-10"
              >
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              {
                title: "Total Attendees",
                value: attendeesLength,
                icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
                bgColor: "from-blue-500 to-blue-600",
                iconBg: "bg-blue-500/20",
              },
              {
                title: "Total Revenue",
                value: `₹${stats.totalRevenue}`,
                icon: <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8" />,
                bgColor: "from-purple-500 to-purple-600",
                iconBg: "bg-purple-500/20",
              },
              {
                title: "Total Tickets",
                value: stats.totalTickets,
                icon: <Ticket className="w-6 h-6 sm:w-8 sm:h-8" />,
                bgColor: "from-orange-500 to-orange-600",
                iconBg: "bg-orange-500/20",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-400 mb-1 sm:mb-2 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white truncate">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.iconBg} p-3 sm:p-4 rounded-xl text-white flex-shrink-0`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {attendees.length>0?
          (<>

          {/* Filters and Search */}
         <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all hover:bg-gray-700"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-64">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all cursor-pointer hover:bg-gray-700 appearance-none pr-10"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Attendees Table - Desktop */}
          {events&&<div className="hidden lg:block bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-600">
                  <tr>
                    {["Name", "Contact", "Tickets", "Booking Date", "Amount", "Status", "Checked In"].map((th) => (
                      <th
                        key={th}
                        className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider whitespace-nowrap"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {attendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-6 text-white font-medium">{attendee.name}</td>
                      <td className="py-4 px-6 text-gray-400 text-sm">{attendee.email}</td>
                      <td className="py-4 px-6 text-white">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                          {attendee.ticketCount}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm whitespace-nowrap">
                        {new Date(attendee.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-white font-semibold">₹{attendee.amount / 100}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                            attendee.bookingStatus
                          )}`}
                        >
                          {getStatusIcon(attendee.bookingStatus)}
                          <span className="capitalize">{attendee.bookingStatus}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            attendee.checkedIn
                              ? "bg-green-500/20 text-green-400 border border-green-500/20"
                              : "bg-gray-600/20 text-gray-400 border border-gray-600/20"
                          }`}
                        >
                          {attendee.checkedIn ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            

            {/* Pagination */}
            {totalPage > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-700 bg-gray-700/20">
                <div className="text-sm text-gray-400">
                  Page {currentPage} of {totalPage}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPage, 5) }, (_, index) => {
                      let pageNum;
                      if (totalPage <= 5) {
                        pageNum = index + 1;
                      } else if (currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (currentPage >= totalPage - 2) {
                        pageNum = totalPage - 4 + index;
                      } else {
                        pageNum = currentPage - 2 + index;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                            currentPage === pageNum
                              ? "bg-red-500 text-white shadow-lg"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPage}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>}
          </>):(
  // Show this when no events exist
  <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700 shadow-xl">
    <h2 className="text-2xl font-semibold text-gray-300 mb-2">No Attendees Found</h2>
    <p className="text-gray-400 text-sm">
      There is no attendees yet
    </p>
  </div>
)}

          {/* Mobile Cards - Tablet & Mobile */}
          <div className="lg:hidden space-y-4 mb-6">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-5 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate mb-1">
                      {attendee.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">{attendee.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(
                      attendee.bookingStatus
                    )}`}
                  >
                    {getStatusIcon(attendee.bookingStatus)}
                    <span className="capitalize hidden sm:inline">{attendee.bookingStatus}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Tickets</p>
                    <p className="text-lg font-bold text-white">{attendee.ticketCount}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Amount</p>
                    <p className="text-lg font-bold text-white">₹{attendee.amount / 100}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full font-medium">
                    📅 {new Date(attendee.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full font-medium ${
                      attendee.checkedIn
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-600/20 text-gray-400"
                    }`}
                  >
                    {attendee.checkedIn ? "✓ Checked In" : "⊗ Not Checked In"}
                  </span>
                </div>
              </div>
            ))}

            {/* Mobile Pagination */}
            {totalPage > 1 && (
              <div className="flex flex-col gap-4 p-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700">
                <div className="text-center text-sm text-gray-400">
                  Page {currentPage} of {totalPage}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPage}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    Next
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {Array.from({ length: Math.min(totalPage, 7) }, (_, index) => {
                    let pageNum;
                    if (totalPage <= 7) {
                      pageNum = index + 1;
                    } else if (currentPage <= 4) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPage - 3) {
                      pageNum = totalPage - 6 + index;
                    } else {
                      pageNum = currentPage - 3 + index;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                          currentPage === pageNum
                            ? "bg-red-500 text-white shadow-lg scale-110"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </OrganiserLayout>
      <OrganiserFooter />
    </div>
  );
};

export default AttendeesPage;