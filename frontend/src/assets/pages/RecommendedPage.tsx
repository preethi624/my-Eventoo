import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { Search,  Calendar, RotateCcw, MapPin, Sparkles, TrendingUp, Filter } from "lucide-react";
import Footer from "../components/Footer";

const RecommendedEventsPage: React.FC = () => {
  const [events, setEvents] = useState<IEventDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((state: RootState) => state.auth.user);
  const [nearByEvents, setNearByEvents] = useState<IEventDTO[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  const userId = user?.id;
  const eventsPerPage = 1;
  console.log(nearByEvents);
  console.log(loadingNearby);
  console.log(selectedCategory);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEvents();
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchEvents();
  }, [selectedDate, maxPrice, currentPage]);

  const params = new URLSearchParams();
  if (searchTerm) params.append("searchTerm", searchTerm);
  if (maxPrice) params.append("maxPrice", maxPrice.toString());
  if (selectedDate) params.append("selectedDate", selectedDate);
  params.append("page", currentPage.toString());
  params.append("limit", eventsPerPage.toString());

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      if (!userId) {
        throw new Error("userId not exist");
      }
      const events = await eventRepository.findRecommended(params.toString());
      console.log("events", events);
      setEvents(events.events);
      setTotalPages(events.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleNearbyEventsClick = () => {
    navigate('/near');
  };

  const handleEventClick = (id: string) => {
    navigate(`/events/${id}`);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoadingNearby(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await eventRepository.fetchNearByEvents({ latitude, longitude }, params.toString());
            console.log("response", response);
            setNearByEvents(response.data);
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 relative">
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-950/50 to-gray-950"></div>
      </div>

      <UserNavbar />
      
      {/* Floating Nearby Events Button - Enhanced */}
      <div className="fixed top-24 right-6 z-50 hidden lg:block">
        <div
          onClick={handleNearbyEventsClick}
          className="group cursor-pointer"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-75 transition duration-300 animate-pulse"></div>
            
            {/* Card */}
            <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-shadow">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-base mb-1">
                    Near You
                  </div>
                  <div className="text-xs text-purple-300">
                    Local Events →
                  </div>
                </div>
              </div>
              
              {/* New Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                NEW
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section - Redesigned */}
      <div className="relative pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Curated For You
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Your Events
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Handpicked events matching your interests, preferences, and vibe
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Filters Sidebar - Enhanced */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                
                {/* Filter Card */}
                <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-gray-800 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                        <Filter className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Filters</h2>
                    </div>
                  </div>
                  
                  {/* Filter Inputs */}
                  <div className="p-6 space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Find events..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Max Price
                      </label>
                      <div className="relative">
                       
                        <input
                          type="number"
                          placeholder="Any price"
                          value={maxPrice ?? ""}
                          onChange={(e) =>
                            setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
                          }
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        setMaxPrice(null);
                        setSelectedDate("");
                        setSearchTerm("");
                      }}
                      className="w-full px-4 py-3.5 bg-gray-800/50 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2 group/btn"
                    >
                      <RotateCcw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Events Grid Area */}
          <main className="lg:col-span-9">
            {/* Loading State */}
            {loadingEvents && (
              <div className="flex items-center justify-center py-32">
                <div className="text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-400 text-lg font-medium">Discovering events for you...</p>
                </div>
              </div>
            )}

            {/* Events Grid */}
            {!loadingEvents && events.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {events.length} {events.length === 1 ? 'event' : 'events'} found
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event) => (
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
            {!loadingEvents && events.length === 0 && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 p-20 text-center">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      <span className="text-6xl">🎭</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-white">
                        No Events Found
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        Try adjusting your filters or search terms to discover more amazing events
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loadingEvents && totalPages > 1 && (
              <div className="mt-12">
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
                    <nav className="relative flex items-center gap-2 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-white rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`min-w-[44px] px-4 py-3 text-sm rounded-xl font-medium transition-all ${
                              currentPage === pageNumber
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                                : "bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-white rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
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
      
      <Footer />
    </div>
  );
};

export default RecommendedEventsPage;