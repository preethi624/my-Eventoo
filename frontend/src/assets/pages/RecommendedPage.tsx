import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";
import { Search, Calendar, RotateCcw, MapPin, Sparkles, TrendingUp, Filter } from "lucide-react";
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
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      
      {/* Floating Nearby Events Button */}
      <div className="fixed top-24 right-6 z-50 hidden lg:block">
        <div
          onClick={handleNearbyEventsClick}
          className="group cursor-pointer"
        >
          <div className="relative">
            {/* Card */}
            <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-lg transform group-hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base mb-1">
                    Near You
                  </div>
                  <div className="text-xs text-gray-600">
                    Local Events →
                  </div>
                </div>
              </div>
              
              {/* New Badge */}
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">
                NEW
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative pt-28 pb-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 border border-red-200 rounded-full">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-600">
                Curated For You
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              Your Events
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Handpicked events matching your interests, preferences, and vibe
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-sm">
                      <Filter className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  </div>
                </div>
                
                {/* Filter Inputs */}
                <div className="p-6 space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Find events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
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
                    className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl font-semibold transition-all duration-300 border border-gray-300 hover:border-red-500 flex items-center justify-center gap-2 group"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Reset All
                  </button>
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
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600 text-lg font-medium">Discovering events for you...</p>
                </div>
              </div>
            )}

            {/* Events Grid */}
            {!loadingEvents && events.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
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
              <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center shadow-sm">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-6xl">🎭</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      No Events Found
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Try adjusting your filters or search terms to discover more amazing events
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loadingEvents && totalPages > 1 && (
              <div className="mt-12">
                <div className="flex justify-center">
                  <nav className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                              ? "bg-red-500 text-white shadow-sm"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RecommendedEventsPage;