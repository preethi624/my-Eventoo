import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { EventFetchResponse, IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";

const CompletedEvents: React.FC = () => {
  const [events, setEvents] = useState<IEventDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 3;

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, maxPrice, selectedDate, currentPage]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEvents();
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const params = new URLSearchParams();

  if (searchTerm) params.append("searchTerm", searchTerm);
  if (selectedCategory) params.append("selectedCategory", selectedCategory);
  if (maxPrice) params.append("maxPrice", maxPrice.toString());
  if (selectedDate) params.append("selectedDate", selectedDate);
  params.append("page", currentPage.toString());
  params.append("limit", eventsPerPage.toString());

  const fetchEvents = async () => {
    try {
      const response: EventFetchResponse =
        await eventRepository.getCompletedEvents(params.toString());

      if (response.success && Array.isArray(response.result?.response.events)) {
        const latestEvents = response.result.response.events.filter((event) => {
          return event.status === "completed";
        });

        setEvents(latestEvents);
        setTotalPages(response.result.response.events.length);
      } else {
        console.error("Unexpected API result format:", response);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handleEventClick = (id: string) => {
    navigate(`/reviews/${id}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <UserNavbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Completed Events
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Browse through our collection of past events and relive the memories
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-28 bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Filters</h2>
              </div>

              <div className="space-y-5">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Search Events
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Name or Location"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 text-white rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-black/50 border border-white/10 text-white rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="music">🎵 Music</option>
                    <option value="sports">⚽ Sports</option>
                    <option value="arts">🎨 Arts</option>
                    <option value="technology">💻 Technology</option>
                    <option value="Others">🌟 Others</option>
                  </select>
                </div>

                {/* Max Price Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Max Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="Enter max price"
                      value={maxPrice ?? ""}
                      onChange={(e) =>
                        setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full pl-8 pr-4 py-3 bg-black/50 border border-white/10 text-white rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 bg-black/50 border border-white/10 text-white rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all cursor-pointer"
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
                  className="w-full py-3 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right - Events */}
          <div className="lg:w-3/4">
            {events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <svg className="w-20 h-20 relative text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl text-gray-400 font-medium">No completed events found</p>
                <p className="text-gray-600 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
            {/* Previous Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl disabled:from-gray-800 disabled:to-gray-700 disabled:cursor-not-allowed hover:from-purple-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 disabled:shadow-none border border-purple-500/20 disabled:border-gray-700"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-12 h-12 font-semibold rounded-xl transition-all duration-200 ${
                    currentPage === pageNumber
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/40 scale-110 border border-purple-500/50"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 hover:text-white backdrop-blur-xl"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl disabled:from-gray-800 disabled:to-gray-700 disabled:cursor-not-allowed hover:from-purple-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 disabled:shadow-none border border-purple-500/20 disabled:border-gray-700"
            >
              Next →
            </button>
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
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default CompletedEvents;