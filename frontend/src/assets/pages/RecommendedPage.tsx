import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/stroe";

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
  
  console.log("user", user);
  
  const userId = user?.id;
  const eventsPerPage = 1;

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
          console.log("position", position);
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
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="fixed top-32 right-6 z-50">
        <div
          onClick={handleNearbyEventsClick}
          className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
        >
          <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl shadow-2xl">
            <div className="bg-white rounded-xl p-4 min-w-[200px]">
              <div className="text-center">
                <div className="text-3xl mb-2 animate-bounce">📍</div>
                <div className="font-bold text-gray-800 text-lg mb-1">
                  Events Near You
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Discover local happenings
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Click to Explore →
                </div>
              </div>
            </div>
            
            {/* Pulsing ring effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 animate-pulse"></div>
            
            {/* Floating badge */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce font-bold">
              NEW
            </div>
          </div>
        </div>
      </div>
      
      {/* Clean Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Recommended Events
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover events tailored specifically for your interests
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Recommended Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-32">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
              
              <div className="space-y-6">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Events
                  </label>
                  <input
                    type="text"
                    placeholder="Event name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter max price"
                    value={maxPrice ?? ""}
                    onChange={(e) =>
                      setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setMaxPrice(null);
                    setSelectedDate("");
                    setSearchTerm("");
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Events Content */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {loadingEvents && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading recommended events...</p>
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
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 text-6xl mb-4">🎭</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search filters to find more events.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {!loadingEvents &&  (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Nearby Events Section */}
      
    </div>
  );
};

export default RecommendedEventsPage;