import { useState, useMemo, useEffect } from "react";
import {
  Search,
  
  Calendar,
  Users,
  Ticket,
  IndianRupee,
 
  Sparkles,
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
      checkedIn:boolean
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
    console.log("attendees",response);
    
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

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden bg-transparent"
      style={{
        background: "linear-gradient(135deg, #1e1e2f 0%, #2c2a42 100%)",
      }}
    >
      {/* Animated Background Overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)," +
            "radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3), transparent 50%)," +
            "radial-gradient(circle at 40% 20%, rgba(72, 61, 139, 0.2), transparent 50%)",
          animation: "gradientShift 15s ease infinite",
        }}
      ></div>

      <OrganiserLayout>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 relative z-10">
          {/* Header */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
              <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg">
                Event Attendees
              </h1>
              <Sparkles className="text-yellow-300 animate-pulse mt-2 sm:mt-0" size={32} />
            </div>
            <p className="text-white/80 text-base sm:text-lg font-medium">
              Manage and track your event attendees
            </p>
          </div>

          {/* Event Selector */}
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-4 sm:p-8 mb-8 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  Select Event
                </label>
                <div className="relative group">
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-800/60 border-2 border-white/10 rounded-2xl text-white font-medium focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 cursor-pointer hover:border-blue-400 appearance-none"
                  >
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title} - {new Date(event.date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-7 sm:w-8 h-7 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="text-white" size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {[
              {
                title: "Total Attendees",
                value: attendeesLength,
                icon: <Users className="w-8 h-8 text-white" />,
                bgFrom: "from-blue-500",
                bgTo: "to-blue-600",
              },
              {
                title: "Total Revenue",
                value: `₹${stats.totalRevenue}`,
                icon: <IndianRupee className="w-8 h-8 text-white" />,
                bgFrom: "from-purple-500",
                bgTo: "to-purple-600",
              },
              {
                title: "Total Tickets",
                value: stats.totalTickets,
                icon: <Ticket className="w-8 h-8 text-white" />,
                bgFrom: "from-orange-500",
                bgTo: "to-orange-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-4 sm:p-6 hover:shadow-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:-translate-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/70 mb-2 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-4xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div
                    className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} p-3 sm:p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-4 sm:p-8 mb-8 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-start sm:items-center">
              {/* Search */}
              <div className="flex-1 min-w-0">
                <div className="relative group w-full">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-hover:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-4 bg-slate-800/60 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 hover:border-blue-400 hover:bg-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 sm:gap-3">
                <div className="relative group w-full sm:w-auto">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-4 bg-slate-800/60 border-2 border-white/10 rounded-2xl text-white focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-slate-800 font-medium appearance-none pr-10 sm:pr-12"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-5 sm:w-6 h-5 sm:h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-x-auto hover:border-blue-400/50 transition-all duration-300">
            <table className="w-full">
    <thead className="bg-slate-800/80 border-b border-white/10">
      <tr>
        {["Booked Users", "Contact", "Tickets", "Booking Date", "Amount", "Status","IsAttended"].map((th) => (
          <th
            key={th}
            className="text-left py-4 px-4 font-bold text-white text-sm uppercase tracking-wider"
          >
            {th}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-white/5">
      {attendees.map((attendee) => (
        <tr key={attendee.id} className="hover:bg-slate-800/50 transition-all duration-200">
          <td className="py-4 px-4">{attendee.name}</td>
          <td className="py-4 px-4">{attendee.email}</td>
          <td className="py-4 px-4">{attendee.ticketCount}</td>
          <td className="py-4 px-4">{new Date(attendee.createdAt).toLocaleDateString()}</td>
          <td className="py-4 px-4">₹{attendee.amount / 100}</td>
          <td className="py-4 px-4">{attendee.bookingStatus}</td>
          <td className="py-4 px-4">
  {attendee.checkedIn ? "Yes" : "No"}
</td>

        </tr>
      ))}
    </tbody>
  </table>
  <div className="sm:hidden space-y-4">
  {attendees.map((attendee) => (
    <div
      key={attendee.id}
      className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 p-4"
    >
      <p className="font-bold text-white text-lg">{attendee.name}</p>
      <p className="text-white/70 text-sm">{attendee.email}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full font-bold">Tickets: {attendee.ticketCount}</span>
        <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full font-bold">Booking: {new Date(attendee.createdAt).toLocaleDateString()}</span>
        <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full font-bold">Amount: ₹{attendee.amount / 100}</span>
        <span className={`px-3 py-1 rounded-full font-bold ${
          attendee.bookingStatus === "confirmed" ? "bg-green-500/20 text-green-300" :
          attendee.bookingStatus === "cancelled" ? "bg-red-500/20 text-red-300" :
          "bg-yellow-500/20 text-yellow-300"
        }`}>{attendee.bookingStatus}</span>
      </div>
    </div>
  ))}
</div>

            {/* Pagination */}
            {totalPage > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center p-4 sm:p-8 border-t border-white/10 gap-3 bg-slate-800/50">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-6 py-2 sm:py-3 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg disabled:hover:bg-slate-700 border border-white/10 hover:border-blue-400"
                >
                  Previous
                </button>
                <div className="flex flex-wrap justify-center gap-2">
                  {Array.from({ length: totalPage }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 shadow-lg border-2 ${
                        currentPage === index + 1
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400 shadow-blue-500/50 scale-110"
                          : "bg-slate-700/80 text-white/80 hover:bg-slate-600 border-white/10 hover:border-blue-400"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPage}
                  className="px-6 py-2 sm:py-3 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg disabled:hover:bg-slate-700 border border-white/10 hover:border-blue-400"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </OrganiserLayout>
      <OrganiserFooter />

      {/* Animation Keyframes */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, 10px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default AttendeesPage;
