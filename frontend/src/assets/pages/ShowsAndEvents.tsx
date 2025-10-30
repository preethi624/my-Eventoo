import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../components/UseNavbar";
import type { EventFetchResponse, IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";
import EventCard from "../components/EventCardComponent";
import EventHistorySticker from "../components/EventHistorySticker";
import Footer from "../components/Footer";
import { userRepository } from "../../repositories/userRepositories";
import type { IVenue } from "../../interfaces/IVenue";
import { categoryRepository } from "../../repositories/categoryRepository";
import { useLocation } from "react-router-dom";

const ShowsAndEvents: React.FC = () => {
  const [events, setEvents] = useState<IEventDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [categories,setCategories]=useState<{ _id: string; name: string }[]>([]);
  const eventsPerPage = 3;
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
  const offerCode = searchParams.get("code");

  
  useEffect(() => {
    fetchLocations();
    fetchCategories()
  }, []);
  const fetchCategories=async()=>{
    const response=await categoryRepository.getCategories();
    setCategories(response.cat)
  }

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, maxPrice, selectedDate, currentPage, selectedVenue]);

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
  if (selectedVenue) params.append("selectedVenue", selectedVenue);
  params.append("page", currentPage.toString());
  params.append("limit", eventsPerPage.toString());

  const fetchLocations = async () => {
    const response = await userRepository.getVenues();
    console.log("venues", response);
    setVenues(response.result);
  };
  

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
    if(offerCode){
        navigate(`/events/${id}?code=${offerCode}`);
    }else{
      navigate(`/events/${id}`);

    }
    
  };

  const handleAllEventsClick = () => {
    navigate("/completed");
  };

  const activeFiltersCount = [selectedCategory, maxPrice, selectedDate, searchTerm].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <UserNavbar />

      {/* Fixed Event History Sticker - Positioned below navbar */}
      <div className="fixed top-24 right-6 z-40">
        <EventHistorySticker onClick={handleAllEventsClick} />
      </div>

      {/* Hero Header */}
      <div className="relative pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {selectedVenue ? `Events in ${selectedVenue}` : "Upcoming Events"}
          </h1>
        </div>
      </div>

      {/* Category Pills Section */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.name
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-red-300 hover:bg-red-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full py-4 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold flex items-center justify-between px-6 hover:bg-gray-50 transition-all shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <AnimatePresence>
            {(isFilterOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:w-80 lg:sticky lg:top-32 h-fit"
              >
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                    {activeFiltersCount > 0 && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                        {activeFiltersCount} active
                      </span>
                    )}
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Location
                    </label>
                    <select
                      value={selectedVenue}
                      onChange={(e) => setSelectedVenue(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none text-sm"
                    >
                      <option value="">All Locations</option>
                      {venues && venues.map((v) => (
                        <option key={v._id} value={v.city}>{v.city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Search Events
                    </label>
                    <input
                      type="text"
                      placeholder="Event name, artist..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none text-sm"
                    />
                  </div>

                  {/* Max Price Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Maximum Price
                    </label>
                    <input
                      type="number"
                      placeholder="Enter max price"
                      value={maxPrice ?? ""}
                      onChange={(e) =>
                        setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none text-sm"
                    />
                  </div>

                  {/* Date Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none text-sm"
                    />
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setMaxPrice(null);
                      setSelectedDate("");
                      setSearchTerm("");
                      setSelectedVenue("");
                    }}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all border border-gray-300 text-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right - Events Grid */}
          <div className="flex-1">
            {events.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-600 text-sm">
                    <span className="text-gray-900 font-bold">{events.length}</span> events found
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1
                      }}
                    >
                      <EventCard
                        event={event}
                        onClick={handleEventClick}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to discover events</p>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setMaxPrice(null);
                    setSelectedDate("");
                    setSearchTerm("");
                    setSelectedVenue("");
                  }}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-center items-center gap-3 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`min-w-[44px] h-11 font-semibold rounded-xl transition-all text-sm ${
                          currentPage === pageNumber
                            ? "bg-red-500 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
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
                  className="px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default ShowsAndEvents;