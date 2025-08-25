import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import UserNavbar from "../components/UseNavbar";
import type { EventFetchResponse, IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";

import EventCard from "../components/EventCardComponent";
import EventHistorySticker from "../components/EventHistorySticker";

const CompletedEvents: React.FC = () => {
  const [events, setEvents] = useState<IEventDTO[]>([]);
  //const [searchLocation, setSearchLocation] = useState("");
  //const [searchTitle, setSearchTitle] = useState("");
  const [searchTerm,setSearchTerm]=useState("")
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 3;

  useEffect(() => {
    fetchEvents();
  }, [
    
    selectedCategory,
    maxPrice,
    selectedDate,
    
    currentPage,
  ]);
  useEffect(()=>{
    const handler=setTimeout(()=>{
      fetchEvents()

    },500)
    return()=>clearTimeout(handler)

  },[searchTerm])

  const params = new URLSearchParams();
  //if (searchLocation) params.append("searchLocation", searchLocation);
  //if (searchTitle) params.append("searchTitle", searchTitle);
  if(searchTerm) params.append("searchTerm",searchTerm)
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
          /*const date = new Date(event.date);
          const dateString = date.toISOString().split("T")[0];
          const combined = new Date(`${dateString}T${event.time}`);

          return !isNaN(combined.getTime()) && combined <= new Date();*/
          return event.status==="completed"
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
    <div className="pt-24 min-h-screen bg-gray-100">
      <UserNavbar />
     

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Completed Events</h1>

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-1/4 sticky top-28 h-fit bg-white p-4 rounded shadow space-y-4">
            <h2 className="text-xl font-semibold">Filters</h2>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="technology">Technology</option>
              <option value="Others">Others</option>
            </select>

            {/* Max Price Filter */}
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice ?? ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Search by event name or Location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />

            {/* Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded"
            />

            {/* Reset Button */}
            <button
              onClick={() => {
                setSelectedCategory("");
                setMaxPrice(null);
                setSelectedDate("");
                setSearchTerm("");
              }}
              className="w-full p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>

          {/* Right - Events */}
          <div className="w-3/4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={handleEventClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Pagination Controls */}

      <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-2 bg-black text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`w-10 h-10 border rounded ${
                currentPage === pageNumber
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
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
          className="px-3 py-2 bg-black text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompletedEvents;
