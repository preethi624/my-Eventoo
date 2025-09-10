import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import OrganiserLayout from "../components/OrganiserLayout";
import { eventRepository } from "../../repositories/eventRepositories";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";
import type {
  EventFetchResponse,
  IEventDTO,
  IEventImage,
} from "../../interfaces/IEvent";
import { organiserRepository } from "../../repositories/organiserRepositories";
import { eventSchema } from "../../validations/eventValidations";
import * as Yup from "yup";
import DataTable from "../components/DataTable";
import { Link } from "react-router-dom";
import { categoryRepository } from "../../repositories/categoryRepository";
import type { RootState } from "../../redux/stroe";


export type EventForm = {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  ticketPrice: string;
  capacity: string;
  images: FileList | [];
  latitude: string;
  longitude: string;
};

export type EventEdit = {
  id: string;

  title: string;
  date: string;
  venue: string;
  ticketsSold?: number;
  status: string;
  description: string;
  ticketPrice: number;
  capacity: number;
  category: string;
  time: string;
  images: (string | IEventImage)[];
};



const OrganiserEvents: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<IEventDTO[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [editEventId, setEditEventID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [selectedVenue, setSelectedVenue] = useState("");

  const [editForm, setEditForm] = useState<EventEdit>({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    ticketPrice: 0,
    capacity: 0,
    status: "",
    images: [],
  });
  const [eventForm, setEventForm] = useState<EventForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    ticketPrice: "",
    capacity: "",
    images: [],
    latitude: "",
    longitude: "",
  });

  const [organiserDetails, setOrganiserDetails] = useState<any>(null);
  const organiser = useSelector((state: RootState) => state.auth.user);
  const [venues, setVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(10);

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
      const response: EventFetchResponse = await eventRepository.getEvents(
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

  const validateCreateForm = () => {
    const {
      title,
      category,
      description,
      date,
      time,
      venue,
      capacity,
      ticketPrice,
      images,
    } = eventForm;

    if (!title || !category || !description || !date || !time || !venue) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    if (!images || images.length === 0) {
      toast.error("Please upload at least one image.");
      return false;
    }

    if (Number(capacity) <= 0) {
      toast.error("Capacity must be greater than 0.");
      return false;
    }

    if (Number(ticketPrice) < 0) {
      toast.error("Ticket price cannot be negative.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await eventSchema.validate(eventForm, { abortEarly: false });

      console.log("Valid event data:", eventForm);

      const formData = new FormData();
      Object.keys(eventForm).forEach((key) => {
        if (key === "images") {
          const files = eventForm.images as FileList;

          for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
          }
        } else {
          const typedKey = key as keyof typeof eventForm;
          const value = eventForm[typedKey];
          if (typeof value === "string") {
            formData.append(key, value);
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
          venue: "",
          category: "",
          ticketPrice: "",
          capacity: "",
          images: [],
          latitude: "",
          longitude: "",
        });
        fetchEvents();
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          toast.error(error.message);
        });
      }
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
    setEditModal(true);
    if (!eventId) {
      throw new Error("eventId not present");
    }

    setEditEventID(eventId);
    const selectedEvent = events.find((event) => event._id === eventId);
    if (!selectedEvent) return;

    setEditForm({
      id: selectedEvent._id,
      title: selectedEvent.title,
      description: selectedEvent.description,
      date: selectedEvent.date.toString().split("T")[0],
      time: selectedEvent.date.toString().split("T")[1]?.slice(0, 5) || "",

      venue: selectedEvent.venue,
      category: selectedEvent.category,
      ticketPrice: selectedEvent.ticketPrice,
      capacity: selectedEvent.capacity,
      status: selectedEvent.status,
      images: selectedEvent.images,
    });
  };
  const validateEditForm = () => {
    const {
      title,
      category,
      description,
      date,
      time,
      venue,
      capacity,
      ticketPrice,
      status,
    } = editForm;
    if (
      !title ||
      !category ||
      !description ||
      !date ||
      !time ||
      !venue ||
      !status
    ) {
      toast.error("All fields are required.");
      return false;
    }

    if (!title.trim()) {
      toast.error("Event title is required");
      return false;
    }

    if (!category) {
      toast.error("Please select a category");
      return false;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!date) {
      toast.error("Date is required");
      return false;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      toast.error("Event date cannot be in the past");
      return false;
    }

    if (!time) {
      toast.error("Time is required");
      return false;
    }

    if (!venue.trim()) {
      toast.error("Venue is required");
      return false;
    }

    if (!capacity || capacity < 1) {
      toast.error("Capacity must be at least 1");
      return false;
    }

    if (ticketPrice === null || ticketPrice < 0) {
      toast.error("Ticket price must be 0 or greater");
      return false;
    }

    if (!status) {
      toast.error("Please select an event status");
      return false;
    }

    return true;
  };
  const handleEditSubmit = async (id: string) => {
    if (!id) {
      return;
    }
    const isValid = validateEditForm();
    if (!isValid) return;
    const formData = new FormData();
    Object.keys(editForm).forEach((key) => {
      if (key === "images" && (editForm as any).images instanceof FileList) {
        const files = (editForm as any).images as FileList;
        for (let i = 0; i < files.length; i++) {
          formData.append("images", files[i]);
        }
      } else {
        const typedKey = key as keyof typeof editForm;
        const value = editForm[typedKey];
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await eventRepository.editEvent(id, editForm);
    if (response.success) {
      toast(response.message);
      fetchEvents();
      setEditModal(false);
    } else {
      toast(response.message);
    }
  };
  const handleReapply = async () => {
    const orgId = organiser?.id;
    const response = await organiserRepository.reapply(orgId);
    console.log("resp", response);

    if (response.success) {
      toast("Repplied sucessfully");
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
    { header: "Venue", accessor: "venue" },

    { header: "Status", accessor: "status" },
    {
      header: "Actions",
      accessor: "actions",
      render: (event: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(event._id)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(event._id)}
            className="text-red-600 hover:text-red-800"
          ></button>
          <Link to={`/organiserEvent/${event._id}`}>
            <button className="bg-black text-white px-2 py-1 rounded text-sm hover:bg-indigo-700">
              Analytics
            </button>
          </Link>
        </div>
      ),
    },
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setCurrentPage(1);
    setStatusFilter("");
  };

  return (
    <OrganiserLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Events</h2>
        <button
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50`}
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
      {organiserDetails?.status === "rejected" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mb-4">
          <strong className="font-bold">Account Rejected:</strong>
          <span className="block sm:inline ml-2">
            Your account has been rejected. Please update your details and
            reapply.
          </span>
          <button
            onClick={handleReapply}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
          >
            Reapply
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded p-4 overflow-x-auto">
        <input
          type="text"
          placeholder="Search by eventName or venue "
          className="border px-3 py-1 rounded w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-1 rounded w-full sm:w-48"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <select
          className="border px-3 py-1 rounded w-full sm:w-48"
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
          className="bg-black text-white px-8 py-1 rounded hover:bg-red-600"
        >
          ResetFlters
        </button>
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="mr-2 text-gray-600">Rows per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border px-2 py-1 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-gray-600 text-sm">
            Page {currentPage} of {totalPage}
          </div>
        </div>

        <DataTable data={events} columns={columns} />
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-3 py-1">
            Page {currentPage} of {totalPage}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create a new event</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    name="category"
                    onChange={(e) =>
                      setEventForm({ ...eventForm, category: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
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
                <label className="block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={eventForm.time}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, time: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Venue</label>
                  <select
                    name="venue"
                    value={eventForm.venue}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, venue: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select a venue</option>
                    {venues.map((venue) => (
                      <option key={venue._id} value={venue.name}>
                        {venue.name} - {venue.address}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Capacity Input */}
                <div>
                  <label className="block mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={eventForm.capacity}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, capacity: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Ticket Price</label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={eventForm.ticketPrice}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, ticketPrice: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Event Images</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEventForm({
                      ...eventForm,
                      images: e.target.files || [],
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Event</h3>
              <button onClick={() => setEditModal(false)}>&times;</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (validateEditForm()) {
                  handleEditSubmit(editForm.id);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={editForm.category}
                    name="category"
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select Category</option>
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts</option>
                    <option value="technology">Technology</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editForm.time}
                    onChange={(e) =>
                      setEditForm({ ...editForm, time: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={editForm.venue}
                    onChange={(e) =>
                      setEditForm({ ...editForm, venue: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    name="capacity"
                    value={editForm.capacity}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        capacity: Number(e.target.value),
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Ticket Price</label>
                <input
                  type="number"
                  name="ticketPrice"
                  min="0"
                  value={editForm.ticketPrice}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      ticketPrice: Number(e.target.value),
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Status</label>
                <select
                  value={editForm.status}
                  name="status"
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Status</option>
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Event Image</label>

                {events.find((ev) => ev._id === editForm.id)?.images?.length ? (
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
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : null}

                {/* File input for new image */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setEditForm({
                        ...editForm,
                        // store file temporarily (not in DB yet)
                        images: e.target.files,
                      } as any);
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OrganiserLayout>
  );
};

export default OrganiserEvents;
