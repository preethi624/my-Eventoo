import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";

import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import EventMap from "../components/EventMap";
import { eventRepository } from "../../repositories/eventRepositories";
import EventInfoItem from "../components/EventInfoItem";

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEventDTO | null>(null);
<<<<<<< HEAD

  const navigate = useNavigate();

  let imageSrc = "https://via.placeholder.com/300x200";
  if (event && event.images && event.images.length > 0) {
    const img = event.images[0];

    if (typeof img === "string") {
      if (img.startsWith("http")) {
        imageSrc = img;
      } else {
        imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
      }
    } else if (typeof img === "object" && img.url) {
      imageSrc = img.url;
=======
  const navigate = useNavigate();
   let imageSrc = "https://via.placeholder.com/300x200";
    if (event&&event.images && event.images.length > 0) {
    const img = event.images[0];
    if (img.startsWith("http")) {
      
      imageSrc = img;
    } else {
    
      imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    }
  }

  useEffect(() => {
    if (id) {
      fetchEventDetail(id);
    }
  }, [id]);

  const fetchEventDetail = async (id: string) => {
    try {
      const response = await eventRepository.getEventById(id);

      if (response.success && response.result) {
        setEvent(response.result.result);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  if (!event) return <div className="text-center mt-20">Loading...</div>;
<<<<<<< HEAD

=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  const handleBooking = async () => {
    const eventId = event._id;
    navigate(`/eventBooking/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <UserNavbar />

      <div className="max-w-4xl mx-auto p-6">
<<<<<<< HEAD
        <img
          src={imageSrc}
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-xl mb-6"
        />
=======
        {/*<img
          src={
            event.images?.[0]
              ? `http://localhost:3000/${event.images[0].replace("\\", "/")}`
              : "https://via.placeholder.com/800x400"
          }
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-xl mb-6"
        />*/}
        <img
          src={
            imageSrc
          }
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-xl mb-6"
        />
        
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

        <span className="bg-black text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">
          {event.category}
        </span>

        <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

        <div className="space-y-3">
          <EventInfoItem
            icon={<FaCalendar />}
            label={new Date(event.date).toLocaleDateString()}
          />
          <EventInfoItem icon={<FaClock />} label={event.time} />
          <EventInfoItem icon={<FaMapMarkerAlt />} label={event.venue} />

          <EventMap venueName={event.venue} title={event.title} />

          <EventInfoItem
            icon={<FaUsers className="text-blue-500" />}
            label={`Capacity: ${event.capacity}`}
          />
        </div>

        <div className="my-8">
          <h3 className="text-xl font-semibold mb-2">About This Event</h3>
          <p className="text-gray-600">{event.description}</p>
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mt-6">
<<<<<<< HEAD
          {event.ticketPrice?<div>
=======
          <div>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            <h3 className="text-black text-2xl font-bold">
              ₹{event.ticketPrice}
            </h3>
            <p className="text-sm text-gray-500">
              {event.availableTickets} tickets remaining
            </p>
<<<<<<< HEAD
          </div>:(
    // Case 2: Multiple Ticket Types
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <FaTicketAlt className="text-black" /> Ticket Options
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {event.ticketTypes.map((t, i) => (
          <div
            key={i}
            className="flex justify-between items-center border rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col">
              <span className="capitalize font-medium text-gray-800">
                {t.type}
              </span>
              <span className="text-sm text-gray-500">
                {t.capacity - (t.sold??0)} left
              </span>
            </div>
            <span className="text-lg font-bold text-black">₹{t.price}</span>
          </div>
        ))}
      </div>
    </div>
  )}

         
        </div>
         <div className="flex justify-center mt-6">
        <button
          className="flex items-center bg-black hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg shadow"
          onClick={handleBooking}
        >
          <FaTicketAlt className="mr-2" />
          Book Tickets
        </button>
      </div>
=======
          </div>

          <button
            className="flex items-center bg-black hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-lg"
            onClick={handleBooking}
          >
            <FaTicketAlt className="mr-2" />
            Book Tickets
          </button>
        </div>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      </div>
    </div>
  );
};

export default EventDetail;
