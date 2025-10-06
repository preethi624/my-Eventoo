import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { Search, DollarSign, Calendar, RotateCcw, MapPin, Sparkles, TrendingUp } from "lucide-react";
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
  params.append("page", currentPage.toString());
  params.append("limit", eventsPerPage.toString());

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      if (!userId) {
        throw new Error("userId not exist");
      }
      const events = await eventRepository.findRecommended( params.toString());
      console.log("events", events);
      setEvents(events.events);
      setTotalPages(events.totalPage)
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingEvents(false);
    }
  };
  const handleNearbyEventsClick=()=>{
    navigate('/near')

  }

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
            const response = await eventRepository.fetchNearByEvents({ latitude, longitude },params.toString());
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      <UserNavbar />
      
      {/* Floating Nearby Events Card */}
      <div className="fixed top-32 right-6 z-50">
        <div
          onClick={handleNearbyEventsClick}
          className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl p-5 min-w-[220px] border border-white/10 shadow-2xl">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-white text-lg mb-1">
                  Events Near You
                </div>
                <div className="text-sm text-gray-300 mb-3">
                  Discover local happenings
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                  Explore Now →
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-bounce">
              NEW
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Hero Section */}
      <div className="pt-32 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">Personalized For You</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200">
              Recommended Events
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover events tailored specifically for your interests and preferences
            </p>
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-purple-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="Event name or location..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
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
                            setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
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
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-blue-400 transition-colors pointer-events-none" />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all [color-scheme:dark]"
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
                    <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-300 text-lg font-medium">Loading recommended events...</p>
                </div>
              </div>
            )}

            {/* Events Grid */}
            {!loadingEvents && events.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loadingEvents && events.length === 0 && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-20"></div>
                <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-16 text-center shadow-2xl">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-5xl">🎭</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      No events found
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Try adjusting your search filters to discover more amazing events tailored just for you.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Pagination */}
        {!loadingEvents && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <nav className="relative flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2.5 text-sm rounded-xl font-medium transition-all duration-300 ${
                        currentPage === pageNumber
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                          : "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
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

export default RecommendedEventsPage;