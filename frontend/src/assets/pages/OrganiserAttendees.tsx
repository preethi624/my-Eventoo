import { useState, useMemo, useEffect } from "react";
import {
  Search,
  UserCheck,
  Mail,
  Calendar,
  Users,
  Ticket,
  IndianRupee,
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
    }[]
  >([]);
  const [events, setEvents] = useState<
    { _id: string; title: string; date: Date }[]
  >([]);
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
    console.log("response", response);

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
    console.log("resss", response);
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
    const total = attendees.length;

    const totalTickets = attendees.reduce((sum, a) => sum + a.ticketCount, 0);

    return { total, totalRevenue, totalTickets };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <OrganiserLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Event Attendees
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and track your event attendees
            </p>
          </div>

          {/* Event Selector */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-64">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Event
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                >
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title} -{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-blue-500/20 transition-all duration-200 hover:border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Total Attendees
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {attendeesLength}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
                  <Users className="w-7 h-7 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-purple-500/20 transition-all duration-200 hover:border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-purple-400">
                    ₹{stats.totalRevenue}
                  </p>
                </div>
                <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-500/30">
                  <IndianRupee className="w-7 h-7 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-orange-500/20 transition-all duration-200 hover:border-orange-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Total Tickets
                  </p>
                  <p className="text-3xl font-bold text-orange-400">
                    {stats.totalTickets}
                  </p>
                </div>
                <div className="bg-orange-500/20 p-4 rounded-xl border border-orange-500/30">
                  <Ticket className="w-7 h-7 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-700/50">
                  <tr>
                    <th className="text-left py-5 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Attendee
                    </th>
                    <th className="text-left py-5 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left py-5 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="text-left py-5 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Booking Date
                    </th>
                    <th className="text-left py-5 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-5 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {attendees.map((attendee) => (
                    <tr
                      key={attendee.id}
                      className="hover:bg-gray-700/30 transition-colors duration-150"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {attendee.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              ID: {attendee.orderId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            {attendee.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full font-medium border border-blue-500/30">
                          <Ticket className="w-4 h-4" />
                          {attendee.ticketCount}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            {new Date(attendee.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-semibold text-white">
                          ₹{attendee.amount / 100}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium border ${
                            attendee.bookingStatus === "confirmed"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : attendee.bookingStatus === "cancelled"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          }`}
                        >
                          {attendee.bookingStatus === "confirmed" ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Confirmed
                            </>
                          ) : attendee.bookingStatus === "cancelled" ? (
                            <>
                              <XCircle className="w-4 h-4" />
                              Cancelled
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPage > 1 && (
                <div className="flex justify-center items-center p-6 border-t border-gray-700/50 gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg disabled:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPage }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                          currentPage === index + 1
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/50"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPage}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg disabled:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <OrganiserFooter/>
      </OrganiserLayout>
    </div>
  );
};

export default AttendeesPage;