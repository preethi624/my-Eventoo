import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import { Search, DollarSign, Calendar, RotateCcw, MapPin, Navigation, Radar } from "lucide-react";
import Footer from "../components/Footer";

const NearEventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [nearByEvents, setNearByEvents] = useState<IEventDTO[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const eventsPerPage = 3;

  const params = new URLSearchParams();
  if (searchTerm) params.append("searchTerm", searchTerm);
  if (maxPrice) params.append("maxPrice", maxPrice.toString());
  if (selectedDate) params.append("selectedDate", selectedDate);
  params.append("page", currentPage.toString());
  params.append("limit", eventsPerPage.toString());
  params.append("page", currentPage.toString());
  params.append("limit", eventsPerPage.toString());

  const handleEventClick = (id: string) => {
    navigate(`/events/${id}`);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoadingNearby(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("position", position);
          try {
            const { latitude, longitude } = position.coords;
            const response = await eventRepository.fetchNearByEvents(
              {
                latitude,
                longitude,
              },
              params.toString()
            );
            console.log("response", response);
            setNearByEvents(response.data);
            setTotalPages(response.totalPage);
            setLoadingEvents(true);
          } catch (error) {
            console.log(error);
          } finally {
            setLoadingNearby(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoadingNearby(false);
        }
      );
    }
  }, [searchTerm, maxPrice, selectedDate, currentPage]);
  console.log("totalPage", totalPages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      <UserNavbar />

      {/* Enhanced Hero Section */}
      <div className="pt-32 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">Location Based</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-200">
              Events Near You
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover amazing events happening right in your neighborhood
            </p>
            
            {/* Location Indicator */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Location Services Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-32">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Radar className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Filters</h2>
                  </div>

                  <div className="space-y-5">
                    {/* Search Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                        Search Events
                      </label>
                      <div className="relative group/input">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-blue-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="Event name or location..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                        Maximum Price
                      </label>
                      <div className="relative group/input">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-green-400 transition-colors" />
                        <input
                          type="number"
                          placeholder="Enter max price"
                          value={maxPrice ?? ""}
                          onChange={(e) =>
                            setMaxPrice(
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Date Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                        Event Date
                      </label>
                      <div className="relative group/input">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-cyan-400 transition-colors pointer-events-none" />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setMaxPrice(null);
                        setSelectedDate("");
                        setSearchTerm("");
                      }}
                      className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10 flex items-center justify-center gap-2 group/reset"
                    >
                      <RotateCcw className="w-4 h-4 group-hover/reset:rotate-180 transition-transform duration-500" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events Content */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {loadingEvents && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                    <MapPin className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
                  </div>
                  <p className="text-gray-300 text-lg font-medium">
                    Finding nearby events...
                  </p>
                </div>
              </div>
            )}

            {/* Events Grid */}
            {!loadingEvents && nearByEvents.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">
                      Found {nearByEvents.length} events nearby
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {nearByEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onClick={handleEventClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loadingEvents && nearByEvents.length === 0 && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-20"></div>
                <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-16 text-center shadow-2xl">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      No nearby events found
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      We couldn't find any events in your area at the moment.
                    </p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your filters or check back later for new events.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Pagination */}
        {!loadingNearby && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <nav className="relative flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2.5 text-sm rounded-xl font-medium transition-all duration-300 ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                            : "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      <Footer/>
    </div>
  );
};

export default NearEventsPage;