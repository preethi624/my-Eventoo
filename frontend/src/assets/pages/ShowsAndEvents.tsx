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
  const [venues,setVenues]=useState<IVenue[]>([]);
  const[selectedVenue,setSelectedVenue]=useState("")
  const eventsPerPage = 3;
  useEffect(()=>{
    fetchLocations()
    


  },[])

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, maxPrice, selectedDate, currentPage,selectedVenue]);

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
  if(selectedVenue)params.append("selectedVenue",selectedVenue)
  params.append("page", currentPage.toString());
  params.append("limit", eventsPerPage.toString());
  const fetchLocations=async()=>{
    const response=await userRepository.getVenues()
    console.log("venues",response);
    setVenues(response.result)
    
  }
  
  

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

  const activeFiltersCount = [selectedCategory, maxPrice, selectedDate, searchTerm].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      <UserNavbar />
      
      {/* Fixed Event History Sticker - Positioned below navbar */}
      <div className="fixed top-24 right-6 z-40">
        <EventHistorySticker onClick={handleAllEventsClick} />
      </div>

      {/* Hero Header */}
      <div className="relative pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-bold mb-6 backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              LIVE EVENTS • DISCOVER NOW
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              <span className="block">Upcoming</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-shift">
                Events
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              Discover amazing experiences happening near you
            </p>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 text-sm">
              {[
                { label: `${events.length} Events Available`, icon: "🎭" },
                { label: "Multiple Categories", icon: "🎨" },
                { label: "Live Booking", icon: "⚡" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
                >
                  <span>{stat.icon}</span>
                  <span className="text-gray-300 font-medium">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-semibold flex items-center justify-between px-6 hover:bg-white/10 transition-all"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-purple-500 rounded-full text-xs">
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
          {/* Left Sidebar - Ultra Modern Filters */}
          <AnimatePresence>
            {(isFilterOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:w-96 lg:sticky lg:top-28 h-fit"
              >
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 space-y-6 shadow-2xl">
                    {/* Header with Active Count */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div>
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                          </div>
                          Filters
                        </h2>
                        {activeFiltersCount > 0 && (
                          <p className="text-sm text-purple-400 mt-1">
                            {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Search */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Search Events
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition"></div>
                        <div className="relative">
                          {/*<input
                            type="text"
                            placeholder="Event name, location, artist..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 bg-black/40 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none backdrop-blur-xl text-sm"
                          />*/}
                           <select
                          value={selectedVenue}
                          onChange={(e) => setSelectedVenue(e.target.value)}
                          className="w-full pl-14 pr-4 py-4 bg-black/40 border-2 border-white/10 rounded-2xl text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none appearance-none cursor-pointer backdrop-blur-xl text-sm font-medium"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 1rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "3rem"
                          }}
                        >
                          <option value="" className="bg-slate-900">All Locations</option>
                          {venues&&venues.map((v)=>(
                          <option key={v._id} value={v.city}className="bg-slate-900">{v.city}</option>
                         

                          ))}

                          
                        </select>
                          <div className="absolute left-4 top-4 p-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>*
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition"></div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Event name, location, artist..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 bg-black/40 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none backdrop-blur-xl text-sm"
                          />
                          <div className="absolute left-4 top-4 p-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-4 py-4 bg-black/40 border-2 border-white/10 rounded-2xl text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none appearance-none cursor-pointer backdrop-blur-xl text-sm font-medium"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 1rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "3rem"
                          }}
                        >
                          <option value="" className="bg-slate-900">All Categories</option>
                          <option value="music" className="bg-slate-900">🎵 Music</option>
                          <option value="sports" className="bg-slate-900">⚽ Sports</option>
                          <option value="arts" className="bg-slate-900">🎨 Arts</option>
                          <option value="technology" className="bg-slate-900">💻 Technology</option>
                          <option value="Others" className="bg-slate-900">📌 Others</option>
                        </select>
                      </div>
                    </div>

                    {/* Max Price Filter */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Maximum Price
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-4 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white font-black text-sm">
                          ₹
                        </div>
                        <input
                          type="number"
                          placeholder="Enter max price"
                          value={maxPrice ?? ""}
                          onChange={(e) =>
                            setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
                          }
                          className="w-full pl-14 pr-4 py-4 bg-black/40 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none backdrop-blur-xl text-sm"
                        />
                      </div>
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-4 bg-black/40 border-2 border-white/10 rounded-2xl text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none backdrop-blur-xl [color-scheme:dark] text-sm"
                      />
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        setMaxPrice(null);
                        setSelectedDate("");
                        setSearchTerm("");
                        setSelectedVenue("")
                      }}
                      className="w-full py-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-white font-bold rounded-2xl transition-all duration-300 border-2 border-red-500/20 hover:border-red-500/40 backdrop-blur-xl flex items-center justify-center gap-3 group mt-8"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right - Events Grid */}
          <div className="flex-1">
            {events.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between mb-8 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
                >
                  <p className="text-gray-300">
                    <span className="text-white font-bold text-lg">{events.length}</span> events found
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live Updates
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {events.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <EventCard
                        event={event}
                        onClick={handleEventClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-20 text-center shadow-2xl">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-8 backdrop-blur-xl border-4 border-white/10">
                    <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">No Events Found</h3>
                  <p className="text-gray-400 text-xl mb-8">Try adjusting your filters to discover amazing events</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setMaxPrice(null);
                      setSelectedDate("");
                      setSearchTerm("");
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-2xl shadow-purple-500/50 hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Ultra Modern Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="flex justify-center items-center gap-4 flex-wrap">
                  {/* Previous Button */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-8 py-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-purple-500/50 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 transition-all shadow-xl hover:shadow-purple-500/30 flex items-center gap-3 group"
                  >
                    <svg className="w-5 h-5 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-3">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <motion.button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`min-w-[56px] h-14 font-black rounded-xl transition-all text-lg shadow-xl ${
                            currentPage === pageNumber
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-2 border-purple-400 shadow-2xl shadow-purple-500/50 scale-110"
                              : "bg-white/5 backdrop-blur-xl text-gray-300 border-2 border-white/10 hover:border-purple-500/50 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {pageNumber}
                        </motion.button>
                      )
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-8 py-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-purple-500/50 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 transition-all shadow-xl hover:shadow-purple-500/30 flex items-center gap-3 group"
                  >
                    Next
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
      <Footer/>
      
    </div>
  );
};

export default ShowsAndEvents;