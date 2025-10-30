import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FaPlus, FaEdit, FaTrash, FaChartBar, FaFilter, FaSync } from "react-icons/fa";
import OrganiserLayout from "../components/OrganiserLayout";
import { eventRepository } from "../../repositories/eventRepositories";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import type { IEvent, IEventImage } from "../../interfaces/IEvent";
import { organiserRepository } from "../../repositories/organiserRepositories";
import DataTable from "../components/DataTable";
import { Link } from "react-router-dom";
import { categoryRepository } from "../../repositories/categoryRepository";
import type { RootState } from "../../redux/stroe";
import OrganiserFooter from "../components/OrganiserFooter";

interface TicketType {
  price: string;
  capacity: string;
}
interface IVenue {
    _id: string;
    name: string;
    address: string;
    city:string;
    state:string;
    seatTypes:  { type: string; seatCount: number }[]
  }

export type EventForm = {
  title: string;
  description: string;
  date: string;
  time: string;
  venue:string
  category: string;
  capacity: string;
  images: FileList | [];
  latitude: string;
  longitude: string;
  ticketTypes:  Record<string, TicketType>;
};

export type EventEdit = {
  id: string;
  title: string;
  date: string;
  venue: string;
  ticketsSold?: number;
  status: string;
  description: string;
  ticketPrice?: number;
  capacity: number;
  category: string;
  time: string;
  images: (string | IEventImage)[];
  ticketTypes:  Record<string, TicketType>;
};

const OrganiserEvents: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [editEventId, setEditEventID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const buttonBase = "px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 transition-all";
const statusButtons: Record<string, string> = {
  draft: "bg-blue-500 text-white hover:bg-blue-600",
  published: "bg-yellow-500 text-white hover:bg-yellow-600",
  completed: "bg-gray-500 text-white hover:bg-gray-600",
};

 


  

  console.log(editEventId);

  const [editForm, setEditForm] = useState<EventEdit>({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    capacity: 0,
    status: "",
    images: [],
    ticketTypes: {}
  });

  const [eventForm, setEventForm] = useState<EventForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    ticketTypes: {},
    capacity: "",
    images: [],
    latitude: "",
    longitude: "",
  });

  const [organiserDetails, setOrganiserDetails] = useState<any>(null);
  const organiser = useSelector((state: RootState) => state.auth.user);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(10);
  const [showPostponeModal, setShowPostponeModal] = useState(false);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchVenues();
  }, [currentPage, selectedDate, statusFilter, limit]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEvents();
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchVenues = async () => {
    const response = await organiserRepository.fetchVenues();
    console.log("venues", response);
    setVenues(response.venues);
  };

  const fetchCategories = async () => {
    const response = await categoryRepository.getCategories();
    setCategories(response.cat);
  };

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }

      if (selectedDate) params.append("date", selectedDate);
      if (statusFilter) params.append("status", statusFilter);

      const orgId = organiser?.id;
      if (!orgId) {
        throw new Error("organiserId not present");
      }
      const response = await eventRepository.getEvents(
        orgId,
        currentPage,
        limit,
        params.toString()
      );
      console.log("respooo", response);

      if (response.success && response.result) {
        setEvents(response.result.response.events);
        setTotalPage(response.result.response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const fetchOrganiserDetails = async () => {
      if (organiser?.id) {
        const response = await organiserRepository.getOrganiserById(
          organiser.id
        );
        console.log("reponse", response);

        if (response.success) {
          if (!response.result.result) {
            throw new Error("response not get");
          }

          setOrganiserDetails(response.result.result);
        }
      }
    };
    fetchOrganiserDetails();
  }, [organiser]);
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return toast.error("Event title is required");
  if (!eventForm.category) return toast.error("Please select a category");
  if (!eventForm.description.trim()) return toast.error("Description is required");
  if (!eventForm.date) return toast.error("Please select a date");
  if (!eventForm.time) return toast.error("Please select a time");
  if (!eventForm.venue) return toast.error("Please select a venue");

  // Validate ticket types
  const ticketTypes = Object.entries(eventForm.ticketTypes);
  if (ticketTypes.length === 0)
    return toast.error("Add at least one ticket type");

  for (const [type, data] of ticketTypes) {
    if (!data.price || Number(data.price) <= 0)
      return toast.error(`${type} ticket price must be greater than 0`);
    if (!data.capacity || Number(data.capacity) <= 0)
      return toast.error(`${type} ticket capacity must be greater than 0`);
  }

  // Validate images
  if (!eventForm.images || eventForm.images.length === 0)
    return toast.error("Please upload at least one event image");


    try {
      if (!organiser || !organiser.id) {
        throw new Error("organiser not found");
      }

      console.log("Valid event data:", eventForm);

      const formData = new FormData();

      Object.keys(eventForm).forEach((key) => {
        if (key === "images") {
          const files = eventForm.images as FileList;
          for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
          }
        } else if (key === "ticketTypes") {
          formData.append("ticketTypes", JSON.stringify(eventForm.ticketTypes));
        } else {
          const typedKey = key as keyof typeof eventForm;
          const value = eventForm[typedKey];
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      });

      formData.append("organiser", organiser.id);

      const response = await eventRepository.createEvent(formData);
      if (response.success) {
        toast.success("Event created successfully");
        setShowModal(false);
        setEventForm({
          title: "",
          description: "",
          date: "",
          time: "",
          venue:"",
          category: "",
          ticketTypes: {},
          capacity: "",
          images: [],
          latitude: "",
          longitude: "",
        });
        fetchEvents();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (eventId: string | undefined) => {
    if (!eventId) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await eventRepository.eventDelete(eventId);
        const data = response.data as { success: boolean };
        if (data.success) {
          fetchEvents();
          toast.success("Event deleted successfully!");
        } else {
          toast.error("Failed to delete event.");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error deleting event.");
      }
    }
  };

 
  
const handleEdit = async (eventId: string | undefined) => {
  if (!eventId) throw new Error("eventId not present");

  setEditModal(true);
  setEditEventID(eventId);

  const selectedEvent = events.find((event) => event._id === eventId);
  if (!selectedEvent) return;




  // Convert ticketTypes array → object dynamically
  const ticketArray = selectedEvent.ticketTypes as unknown as {
    type: string;
    price: number;
    capacity: number;
  }[];

  const ticketObj: Record<string, { price: string; capacity: string }> = {};

  ticketArray.forEach((t) => {
    ticketObj[t.type.toLowerCase()] = {
      price: t.price.toString(),
      capacity: t.capacity.toString(),
    };
  });

  // ✅ Set the edit form with real event data
  setEditForm({
    id: selectedEvent._id,
    title: selectedEvent.title,
    category: selectedEvent.category,
    description: selectedEvent.description,
    date: selectedEvent.date.toString().split("T")[0],
    time: selectedEvent.date.toString().split("T")[1]?.slice(0, 5) || "",
    venue: selectedEvent.venue,
    capacity: selectedEvent.capacity,
    ticketTypes: ticketObj, 
    status: selectedEvent.status,
    images: selectedEvent.images || [],
  });
};




  
  const handleEditSubmit = async (id: string) => {
  if (!id) return;

 if (!editForm.title.trim())
    return toast.error("Event title is required");

  if (!editForm.category)
    return toast.error("Please select a category");

  if (!editForm.description.trim())
    return toast.error("Description is required");

  if (!editForm.date)
    return toast.error("Event date is required");

  const eventDate = new Date(editForm.date);
  const today = new Date();
  if (eventDate.getTime() < today.setHours(0, 0, 0, 0))
    return toast.error("Event date cannot be in the past");

  if (!editForm.time)
    return toast.error("Event time is required");

  if (!editForm.venue.trim())
    return toast.error("Venue name is required");

  if (!editForm.capacity || Number(editForm.capacity) <= 0)
    return toast.error("Capacity must be greater than 0");

  // ✅ Ticket type validations
  const ticketTypes = Object.entries(editForm.ticketTypes);
  if (ticketTypes.length === 0)
    return toast.error("Add at least one ticket type");

  for (const [type, data] of ticketTypes) {
    if (!data.price || Number(data.price) <= 0)
      return toast.error(`${type} ticket price must be greater than 0`);
    if (!data.capacity || Number(data.capacity) <= 0)
      return toast.error(`${type} ticket capacity must be greater than 0`);
  }
  const ticketCapacity=ticketTypes.reduce((acc,curr)=>(acc+Number(curr[1].capacity||0)),0);
  if(editForm.capacity>ticketCapacity)
    return toast.error("Capacity must be less than or equal to total capacity of venue")
  

  if (!editForm.status)
    return toast.error("Please select an event status");

  // ✅ Image validation (optional: only if new image upload is required)
 const existingImage = !!events.find(
  (ev) => ev._id === editForm.id
)?.images?.length;

if (!existingImage && (!editForm.images || editForm.images.length === 0)) {
  return toast.error("Please upload an event image");
}


  const ticketTypesArray = Object.keys(editForm.ticketTypes).map((key) => ({
    type: key,
    price: Number(editForm.ticketTypes[key as keyof typeof editForm.ticketTypes].price),
    capacity: Number(editForm.ticketTypes[key as keyof typeof editForm.ticketTypes].capacity),
  }));

  const payload: EventEdit = {
    ...editForm,
    ticketTypes: ticketTypesArray as any, // if backend expects array
  };

  const response = await eventRepository.editEvent(id, payload);
  if (response.success) {
    toast(response.message);
    fetchEvents();
    setEditModal(false);
  } else {
    toast(response.message);
  }
};
const handlePostpone=async(eventId:string)=>{
  const event = events.find((e: any) => e._id === eventId);
  setSelectedEvent(event);
  setShowPostponeModal(true);
  
}
const handleCloseModal = () => {
  setShowPostponeModal(false);
  setSelectedEvent(null);
  setNewDate("");
};
const handleSubmitPostpone = async () => {
  if (!newDate || !selectedEvent) return toast.error("Please select a new date");

  try {
    
    
    const response = await eventRepository.rescheduleEvent(selectedEvent._id,newDate);
    if(response.success){
      toast("Rescheduled successfully")
    }else{
      toast("Failed to re-apply")
    }

    
      handleCloseModal();
    
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error);
  }
};



  const handleReapply = async () => {
    const orgId = organiser?.id;
    const response = await organiserRepository.reapply(orgId!);
    console.log("resp", response);

    if (response.success) {
      toast("Reapplied successfully");
    } else {
      toast("failed to reapply");
    }
  };

  const columns = [
    { header: "Event Name", accessor: "title" },
    {
      header: "Date",
      accessor: "date",
      render: (event: any) => new Date(event.date).toLocaleDateString(),
    },
    { header: "Venue", accessor: "venue" ,render: (event: any) => {
    const venue = venues.find(v => v._id === event.venue);
    return venue ? `${venue.name},${venue.address}` : event.venue;
  }},
    { header: "Status", accessor: "status" },
    
    {
  header: "Actions",
  accessor: "actions",
  render: (event: any) => (
  <div className="flex gap-2 flex-wrap">
    {event.status === "draft" && (
      <>
        <button className={`${buttonBase} ${statusButtons.draft}`} onClick={() => handleEdit(event._id)}>
          <FaEdit size={16} />
        </button>
        <button className={`${buttonBase} ${statusButtons.draft}`} onClick={() => handleDelete(event._id)}>
          <FaTrash size={16} />
        </button>
      </>
    )}
    {event.status === "published" && (
      <button className={`${buttonBase} ${statusButtons.published}`} onClick={() => handlePostpone(event._id)}>
        Postpone
      </button>
    )}
    
    {event.status==='completed'?<Link to={`/organiserEvent/${event._id}`}>
      <button className={`${buttonBase} bg-purple-600 text-white hover:bg-purple-700`}>
        <FaChartBar size={14} /> Report And Analytics
      </button>
    </Link>:<Link to={`/organiserEvent/${event._id}`}>
      <button className={`${buttonBase} bg-purple-600 text-white hover:bg-purple-700`}>
        <FaChartBar size={14} />  Analytics
      </button>
    </Link>}
  </div>
)

}

    
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setCurrentPage(1);
    setStatusFilter("");

  };
  // place near other handlers

const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedVenueId = e.target.value;
  const selectedVenue = venues.find(v => v._id === selectedVenueId);

  if (!selectedVenue) return;

  // Build descriptive venue string
  const venueString = `${selectedVenue.name}, ${selectedVenue.city}, ${selectedVenue.state}, India`;

  // Build dynamic ticketTypes
  const autoTicketTypes: Record<string, TicketType> = {};
  if (selectedVenue.seatTypes) {
    selectedVenue.seatTypes.forEach((seat) => {
      const key = seat.type.toLowerCase();
      autoTicketTypes[key] = {
        price: "",
        capacity: String(seat.seatCount),
      };
    });
  }

  // ✅ Store the full string in eventForm.venue, not the ID
  setEventForm(prev => ({
    ...prev,
    venue: venueString,
    ticketTypes: autoTicketTypes,
  }));
};



  return (
    
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950/30 p-6">
        <OrganiserLayout>
      {/* Animated Background Elements */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Events Management
            </h2>
            <p className="text-gray-400 mt-1">Create and manage your events</p>
          </div>
          <button
            className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 flex items-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              organiserDetails?.status !== "approved" ? "grayscale" : ""
            }`}
            disabled={organiserDetails?.status !== "approved"}
            onClick={() => setShowModal(true)}
            title={
              organiserDetails?.status !== "approved"
                ? "Your account is not approved yet"
                : ""
            }
          >
            <FaPlus /> Create Event
          </button>
        </div>
      </div>

      {/* Rejection Alert */}
      {organiserDetails?.status === "rejected" && (
        <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <strong className="font-bold text-red-300">Account Rejected</strong>
              <p className="text-red-200 mt-1">
                Your account has been rejected. Please update your details and
                reapply.
              </p>
            </div>
            <button
              onClick={handleReapply}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors whitespace-nowrap"
            >
              Reapply Now
            </button>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="🔍 Search by name or venue..."
            className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="date"
            className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleResetFilters}
            className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all flex items-center justify-center gap-2"
          >
            <FaSync /> Reset Filters
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <label className="text-gray-400">Rows per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-gray-400 text-sm">
            Page {currentPage} of {totalPage}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl overflow-x-auto">
        <DataTable data={events} columns={columns} />

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 gap-3 flex-wrap">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Previous
          </button>

          <span className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600">
            Page {currentPage} of {totalPage}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl p-8 overflow-y-auto max-h-[90vh] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Create New Event
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Category
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, category: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Describe your event..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, time: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Venue
                  </label>
                  <select
  value={venues.find(v => `${v.name}, ${v.city}, ${v.state}, India` === eventForm.venue)?._id || ""}
  onChange={handleVenueChange}
  className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
>
  <option value="">Select a venue</option>
  {venues.map((venue) => (
    <option key={venue._id} value={venue._id}>
      {venue.name} - {venue.address}
    </option>
  ))}
</select>

                </div>

                <div>
  <label className="block mb-2 text-gray-300 font-medium">
    Total Capacity
  </label>
  <input
    type="number"
    value={Object.values(eventForm.ticketTypes).reduce(
      (sum, t) => sum + Number(t.capacity || 0),
      0
    )} // sum of all capacities
    readOnly
    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 cursor-not-allowed"
    placeholder="Total capacity"
  />
</div>

              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {Object.entries(eventForm.ticketTypes).map(([type, data]) => (
    <div key={type} className="space-y-4">
      <div className="text-center mb-2">
        <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      <div>
        <label className="block mb-2 text-gray-400 text-sm">Price</label>
        <input
          type="number"
          min="0"
          value={data.price} 
          onChange={(e) =>
            setEventForm({
              ...eventForm,
              ticketTypes: {
                ...eventForm.ticketTypes,
                [type]: {
                  ...data,
                  price: e.target.value,
                },
              },
            })
          }
          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="₹0"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-400 text-sm">Capacity</label>
        <input
          type="number"
          min="0"
          value={data.capacity} 
          
          readOnly 
          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  ))}
</div>


              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Event Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEventForm({
                      ...eventForm,
                      images: e.target.files || [],
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 text-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/50"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPostponeModal && (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">
        {selectedEvent?.title} — Update Event Date
      </h2>
      
      <label className="block text-gray-300 mb-2">Select New Date:</label>
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmitPostpone}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


      {/* Edit Event Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl p-8 overflow-y-auto max-h-[90vh] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Edit Event
              </h3>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-400 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                
                  handleEditSubmit(editForm.id);
                
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts</option>
                    <option value="technology">Technology</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Time
                  </label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) =>
                      setEditForm({ ...editForm, time: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={editForm.venue}
                    onChange={(e) =>
                      setEditForm({ ...editForm, venue: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-300 font-medium">
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={editForm.capacity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, capacity: Number(e.target.value) })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                
              </div>
              {Object.entries(editForm.ticketTypes).map(([type, data]) => (
    <div key={type} className="space-y-4">
      <div className="text-center mb-2">
        <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      <div>
        <label className="block mb-2 text-gray-400 text-sm">Price</label>
        <input
          type="number"
          min="0"
          value={data.price} 
          onChange={(e) =>
            setEditForm({
              ...editForm,
              ticketTypes: {
                ...editForm.ticketTypes,
                [type]: {
                  ...data,
                  price: e.target.value,
                },
              },
            })
          }
          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="₹0"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-400 text-sm">Capacity</label>
        <input
          type="number"
          min="0"
          value={data.capacity} 
          
          readOnly 
          className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  ))}
              

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Event Image
                </label>
                {events.find((ev) => ev._id === editForm.id)?.images?.length ? (
                  <div className="mb-4">
                    <img
                      src={
                        typeof events.find((ev) => ev._id === editForm.id)
                          ?.images?.[0] === "string"
                          ? (events.find((ev) => ev._id === editForm.id)
                              ?.images?.[0] as string)
                          : (
                              events.find((ev) => ev._id === editForm.id)
                                ?.images?.[0] as IEventImage
                            )?.url
                      }
                      alt="Event"
                      className="w-40 h-40 object-cover rounded-lg border-2 border-purple-500"
                    />
                  </div>
                ) : null}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setEditForm({
                        ...editForm,
                        images: e.target.files,
                      } as any);
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 text-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/50"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </OrganiserLayout>
      <OrganiserFooter/>
      </div>
      
    
    
  );
};

export default OrganiserEvents;