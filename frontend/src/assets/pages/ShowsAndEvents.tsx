import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UseNavbar";
import type { EventFetchResponse, IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import EventHistorySticker from "../components/EventHistorySticker";

const ShowsAndEvents: React.FC = () => {
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
        await eventRepository.getOrganiserEvents(params.toString());

      if (response.success && Array.isArray(response.result?.response.events)) {
        const latestEvents = response.result.response.events.filter((event) => {
          const date = new Date(event.date);
          const dateString = date.toISOString().split("T")[0];
          const combined = new Date(`${dateString}T${event.time}`);

          return !isNaN(combined.getTime()) && combined >= new Date();
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
    navigate(`/events/${id}`);
  };

  const handleAllEventsClick = () => {
    navigate("/completed");
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <UserNavbar />
      <EventHistorySticker onClick={handleAllEventsClick} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Upcoming Events
          </h1>
          <p className="text-gray-600 text-lg">Discover amazing experiences near you</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-80 lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Event name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                  <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem"
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="music">🎵 Music</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="arts">🎨 Arts</option>
                  <option value="technology">💻 Technology</option>
                  <option value="Others">📌 Others</option>
                </select>
              </div>

              {/* Max Price Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Maximum Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    placeholder="Enter max price"
                    value={maxPrice ?? ""}
                    onChange={(e) =>
                      setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
                    }
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Right - Events */}
          <div className="flex-1">
            {events.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results</p>
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
              className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all shadow-sm hover:shadow"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`min-w-[44px] h-11 font-semibold rounded-lg transition-all shadow-sm hover:shadow ${
                    currentPage === pageNumber
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-600 scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
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
              className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all shadow-sm hover:shadow"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowsAndEvents;