// components/EventCard.tsx
import React from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import type { IEventDTO } from '../../interfaces/IEvent';

type EventCardProps = {
  event: IEventDTO;
  onClick: (id: string) => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const imageSrc = event.images && event.images.length > 0
    ? `http://localhost:3000/${event.images[0].replace('\\', '/')}`
    : 'https://via.placeholder.com/300x200';

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => event._id && onClick(event._id)}
    >
      <div className="relative">
        <img src={imageSrc} alt={event.title} className="w-full h-52 object-cover" />
        <span className="absolute top-3 right-3 bg-black text-white text-sm px-3 py-1 rounded-full">
          {event.category}
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
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
          <div className="text-black font-semibold text-lg">
            ₹{event.ticketPrice}
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            <FaTicketAlt />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
