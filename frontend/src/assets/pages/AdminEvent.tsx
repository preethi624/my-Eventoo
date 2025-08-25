import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";

import AdminLayout from "../components/AdminLayout";
import { adminRepository } from "../../repositories/adminRepositories";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

import type { IEventDTO } from "../../interfaces/IEvent";
const truncate = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};
export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;

  venue: string;
  capacity: number;
  status: "draft" | "published" | "completed" | "cancelled";
  isBlocked: boolean;
}

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<IEventDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEventDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [orgName, setOrgName] = useState("");

  const eventsPerPage = 6;

  const [expandedEvents, setExpandedEvents] = useState<{
    [key: string]: boolean;
  }>({});
  const toggleTrunk = (id: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    capacity: 0,
    status: "draft",
    time: "",
    ticketPrice: 0,
  });

  useEffect(() => {
    const handler=setTimeout(()=>{
      fetchEvents();

    },500)
    return()=>clearTimeout(handler)
    
  }, [
    searchLocation,
    
  
    searchTitle,
   
    orgName,
  ]);
  useEffect(() => {
  fetchEvents();
}, [selectedCategory, maxPrice, selectedDate, currentPage]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchLocation) params.append("searchLocation", searchLocation);
      if (searchTitle) params.append("searchTitle", searchTitle);
      if (selectedCategory) params.append("selectedCategory", selectedCategory);
      if (maxPrice) params.append("maxPrice", maxPrice.toString());
      if (selectedDate) params.append("selectedDate", selectedDate);
      if (orgName) params.append("orgName", orgName);
      params.append("page", currentPage.toString());
      params.append("limit", eventsPerPage.toString());

      const response = await adminRepository.getAllEvents(params.toString());
      console.log("resoo", response);

      if (response.success && response.result) {
        setEvents(response.result.response.events);
        setTotalPage(response.result.response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const id = selectedEvent?._id;
      if (!id) {
        toast.error("Invalid user ID");
        return;
      }

      const response = await adminRepository.updateEvent(id, formData);

      if (response.success) {
        setIsModalOpen(false);
        fetchEvents();
        resetForm();
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error edititng event:", error);
    }
  };

  const handleToggleBlock = async (event: IEventDTO) => {
    const result = await Swal.fire({
      title: "Are you sure?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, block/unblock it!",
    });
    if (result.isConfirmed) {
      try {
        const response = await adminRepository.blockEvent(event);

        if (response.success) {
          toast(response.message);
          fetchEvents();
        } else {
          toast(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const resetForm = () => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      venue: "",
      capacity: 0,
      status: "draft",
      time: "",
      ticketPrice: 0,
    });
  };
  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  console.log("total", totalPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <div className="flex justify-between items-center mb-6 ">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Search & Filter Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 round-full">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 "
                >
                  <option value="">All Categories</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts</option>
                  <option value="technology">Technology</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Max Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="Enter max price"
                  value={maxPrice ?? ""}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Search by location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Title Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  placeholder="Search by event name"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organiser Name
                </label>
                <input
                  type="text"
                  placeholder="Search by organiser name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setMaxPrice(null);
                    setSelectedDate("");
                    setSearchLocation("");
                    setSearchTitle("");
                    setOrgName("");
                  }}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800">
                  {event.title}
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    event.status === "draft"
                      ? "bg-green-100 text-yellow-800"
                      : event.status === "published"
                      ? "bg-blue-100 text-blue-800"
                      : event.status === "cancelled"
                      ? "bg-gray-100 text-gray-800"
                      : event.status === "completed"
                      ? "bg-gray-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                {expandedEvents[event._id]
                  ? event.description
                  : truncate(event.description, 100)}
              </p>
              <button onClick={() => toggleTrunk(event._id)}>
                {expandedEvents[event._id] ? "Show less" : "Read more"}
              </button>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Capacity: {event.capacity}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>TicketPrice: {event.ticketPrice}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    const eventDate = new Date(event.date);
                    setSelectedEvent(event);

                    setFormData({
                      title: event.title,
                      description: event.description,
                      date: eventDate.toISOString().split("T")[0],
                      venue: event.venue,
                      capacity: event.capacity,
                      status: event.status,
                      time: event.time,
                      ticketPrice: event.ticketPrice,
                    });
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleBlock(event)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    event.isBlocked
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {event.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {"Edit Event"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <p>Title</p>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <p>Description</p>

                <textarea
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  name="date"
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                  required
                />

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <p>Venue</p>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  placeholder="Venue"
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <p>Capacity</p>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  placeholder="Capacity"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <p>TicketPrice</p>
                <input
                  type="number"
                  name="Price"
                  value={formData.ticketPrice}
                  placeholder="TicketPrice"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ticketPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded"
                  required
                />

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "draft"
                        | "published"
                        | "completed"
                        | "cancelled",
                    })
                  }
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {selectedEvent ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {totalPage > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPage }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-black text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default EventPage;
