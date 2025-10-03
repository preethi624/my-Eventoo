import  { useState, useMemo, useEffect } from "react";
import {
  Search,
  UserCheck,
  Mail,
  Calendar,
  Users,
  
  Ticket,

  IndianRupee,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";

import { eventRepository } from "../../repositories/eventRepositories";

import { organiserRepository } from "../../repositories/organiserRepositories";
import OrganiserLayout from "../components/OrganiserLayout";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <OrganiserLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Event Attendees
            </h1>
            <p className="text-gray-600">
              Manage and track your event attendees
            </p>
          </div>

          {/* Event Selector */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Attendees
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {attendeesLength}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{stats.totalRevenue}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <IndianRupee className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tickets
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.totalTickets}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Ticket className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">confirmed</option>
                  <option value="pending">pending</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Attendee
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Contact
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Tickets
                    </th>

                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Booking Date
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      BookingStatus
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendees.map((attendee) => (
                    <tr
                      key={attendee.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {attendee.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              ID: {attendee.orderId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {attendee.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          <Ticket className="w-4 h-4" />
                          {attendee.ticketCount}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {new Date(attendee.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">
                          ${attendee.amount / 100}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${
                            attendee.bookingStatus === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {attendee.bookingStatus === "confirmed" ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Confirmed
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Not Confirmed
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPage > 1 && (
                <div className="flex justify-center mt-4 gap-2">
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
                      className={`px-3 py-1 rounded ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300"
                      }`}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </OrganiserLayout>
    </div>
  );
};

export default AttendeesPage;
