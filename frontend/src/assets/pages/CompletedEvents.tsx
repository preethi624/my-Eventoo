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
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 bg-white border-b border-gray-200">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
            Completed Events
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse through our collection of past events and relive the memories
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-28 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-5">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Events
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Name or Location"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all cursor-pointer"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="Enter max price"
                      value={maxPrice ?? ""}
                      onChange={(e) =>
                        setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all cursor-pointer"
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
                  className="w-full py-3 bg-gray-50 border border-gray-300 hover:border-red-500 hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all duration-200"
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
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="relative inline-block mb-4">
                  <svg className="w-20 h-20 relative text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl text-gray-700 font-medium">No completed events found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
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
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-all duration-200 shadow-sm disabled:shadow-none border border-red-500 disabled:border-gray-300"
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
                      ? "bg-red-500 text-white shadow-sm scale-110 border border-red-500"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-red-500"
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
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-all duration-200 shadow-sm disabled:shadow-none border border-red-500 disabled:border-gray-300"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedEvents;