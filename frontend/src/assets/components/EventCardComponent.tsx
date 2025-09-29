// components/EventCard.tsx
<<<<<<< HEAD

import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import type { IEventDTO } from "../../interfaces/IEvent";
import CountdownTimer from "./CountDownTimer";
=======
import React from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import type { IEventDTO } from '../../interfaces/IEvent';
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

type EventCardProps = {
  event: IEventDTO;
  onClick: (id: string) => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
<<<<<<< HEAD
  
  let imageSrc = "https://via.placeholder.com/300x200";
  if (event.images && event.images.length > 0) {
    const img = event.images[0]; // take the first image

    // Case 1: Cloudinary (direct URL or object with url property)
    if (typeof img === "string") {
      if (img.startsWith("http")) {
        imageSrc = img; // Cloudinary or external full URL
      } else {
        // Local stored image (uploads/myimage.jpg)
        imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
      }
    } else if (typeof img === "object" && img.url) {
      // Case 2: if Mongo stores { url: "..." }
      imageSrc = img.url;
=======
  /*const imageSrc = event.images && event.images.length > 0
    ? `http://localhost:3000/${event.images[0].replace('\\', '/')}`
    : 'https://via.placeholder.com/300x200';*/
    let imageSrc = "https://via.placeholder.com/300x200";
    if (event.images && event.images.length > 0) {
    const img = event.images[0];
    if (img.startsWith("http")) {
      
      imageSrc = img;
    } else {
    
      imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => event._id && onClick(event._id)}
    >
      <div className="relative">
<<<<<<< HEAD
      
        <img
          src={imageSrc}
          alt={event.title}
          className="w-full h-52 object-cover"
        />
=======
        <img src={imageSrc} alt={event.title} className="w-full h-52 object-cover" />
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        <span className="absolute top-3 right-3 bg-black text-white text-sm px-3 py-1 rounded-full">
          {event.category}
        </span>
      </div>
      <div className="p-4">
<<<<<<< HEAD
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {event.title}
        </h2>
=======
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        <div className="text-gray-600 flex items-center mb-1">
          <FaCalendar className="mr-2 text-black" />
          {new Date(event.date).toLocaleDateString()}
        </div>
        <div className="text-gray-600 flex items-center mb-1">
          <FaClock className="mr-2 text-black" />
          {event.time}
        </div>
        <div className="text-gray-600 flex items-center mb-2">
          <FaMapMarkerAlt className="mr-2 text-black" />
          {event.venue}
        </div>

        <div className="flex justify-between items-center mt-4">
<<<<<<< HEAD
          {event.ticketPrice?<div className="text-black font-semibold text-lg">
            ₹{event.ticketPrice}
          </div>:<div className="mt-3 border-t pt-3">
          <h3 className="text-md font-semibold mb-2 flex items-center">
            <FaTicketAlt className="mr-2" /> Ticket Types
          </h3>
          {/*<ul className="space-y-1 text-sm text-gray-700">
            {event.ticketTypes?.map((t, i) => (
              <li
                key={i}
                className="flex justify-between bg-gray-100 px-3 py-2 rounded-md"
              >
                <span className="capitalize">{t.type}</span>
                <span>
                  ₹{t.price} ({t.capacity - t.sold} left)
                </span>
              </li>
            ))}
          </ul>*/}
          <ul className="space-y-1 text-sm text-gray-700">
  {Object.entries(event.ticketTypes).map(([key, value], i) => (
    <li
      key={i}
      className="flex justify-between bg-gray-100 px-3 py-2 rounded-md"
    >
      <span className="capitalize">{key}</span>
      <span>
        ₹{value.price} ({Number(value.capacity) - Number((value as any).sold ?? 0)} left)
      </span>
    </li>
  ))}
</ul>

        </div>}
          
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            <FaTicketAlt />
            {event.status != "completed" ? "BookNow" : "Reviews"}
          </button>
        </div>
      </div>
      {event.status === "published" ? (
          <CountdownTimer eventDate={event.date.toString()} />
        ) : null}
=======
          <div className="text-black font-semibold text-lg">
            ₹{event.ticketPrice}
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            <FaTicketAlt />
            Book Now
          </button>
        </div>
      </div>
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    </div>
  );
};

export default EventCard;
