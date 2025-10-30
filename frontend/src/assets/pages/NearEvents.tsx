import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import { Search, Calendar, RotateCcw, MapPin, Navigation, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
              <Navigation className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">Location Based Discovery</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Events Near You
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-28">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                </div>

                <div className="space-y-5">
                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Events
                    </label>
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Event name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
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
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl font-medium transition-all border border-gray-300 hover:border-red-500 flex items-center justify-center gap-2 group"
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
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-red-500 border-r-red-400 rounded-full animate-spin"></div>
                    <MapPin className="absolute inset-0 m-auto w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-gray-700 text-lg font-medium">
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
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-semibold text-lg">
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
              <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Events Found
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-2">
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
            <nav className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                          ? "bg-red-500 text-white shadow-sm"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 hover:text-gray-900"
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
                className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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