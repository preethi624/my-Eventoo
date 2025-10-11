import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import { Search,  Calendar, RotateCcw, MapPin, Navigation, Sparkles } from "lucide-react";
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
            setLoadingEvents(false)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <UserNavbar />

      {/* Hero Section with proper spacing from navbar */}
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Location Based Discovery</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Events Near You
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Discover amazing events happening right in your neighborhood
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Location Services Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-28">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Filters</h2>
                </div>

                <div className="space-y-5">
                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Search Events
                    </label>
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        placeholder="Event name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Maximum Price
                    </label>
                    <div className="relative group">
                     
                      <input
                        type="number"
                        placeholder="Enter max price"
                        value={maxPrice ?? ""}
                        onChange={(e) =>
                          setMaxPrice(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Date
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all [color-scheme:dark]"
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
                    className="w-full px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-medium transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 group"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Events Content */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {loadingEvents && (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-cyan-500 rounded-full animate-spin"></div>
                    <MapPin className="absolute inset-0 m-auto w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-gray-300 text-lg font-medium">
                    Finding nearby events...
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Please wait while we search your area
                  </p>
                </div>
              </div>
            )}

            {/* Events Grid */}
            {!loadingEvents && nearByEvents.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-lg">
                        {nearByEvents.length} Events Found
                      </span>
                      <p className="text-gray-500 text-sm">In your area</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {nearByEvents.map((event) => (
                    <div key={event._id} className="max-w-2xl">
                      <EventCard
                        event={event}
                        onClick={handleEventClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loadingEvents && nearByEvents.length === 0 && (
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-20 text-center shadow-2xl">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <MapPin className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    No Events Found
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-2">
                    We couldn't find any events in your area at the moment.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Try adjusting your filters or check back later for new events.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {!loadingNearby && totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center gap-2 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-3 shadow-2xl">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              <div className="flex gap-2 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`min-w-[44px] px-4 py-2.5 rounded-xl font-medium transition-all ${
                        currentPage === pageNumber
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                          : "bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-gray-300 hover:text-white"
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
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      <Footer/>
    </div>
  );
};

export default NearEventsPage;