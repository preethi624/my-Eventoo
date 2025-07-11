import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaUsers,
} from 'react-icons/fa';




import UserNavbar from '../components/UseNavbar';
import type { IEventDTO } from '../../interfaces/IEvent';
import EventMap from '../components/EventMap';
import { eventRepository } from '../../repositories/eventRepositories';





const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEventDTO| null>(null);
  const navigate=useNavigate()

  useEffect(() => {
    if(id){
      fetchEventDetail(id);

    }
    
  }, [id]);

  const fetchEventDetail = async (id:string) => {
    try {
      
        const response = await eventRepository.getEventById(id);

      
    
      if (response.success&&response.result) {
      
        
        setEvent(response.result.result);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  if (!event) return <div className="text-center mt-20">Loading...</div>;
  const handleBooking=async()=>{
    const eventId=event._id;
    navigate(`/eventBooking/${eventId}`)
    
  }
  

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
     <UserNavbar/>

      <div className="max-w-4xl mx-auto p-6">
        <img
          src={
            event.images?.[0]
              ? `http://localhost:3000/${event.images[0].replace('\\', '/')}`
              : 'https://via.placeholder.com/800x400'
          }
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-xl mb-6"
        />

        <span className="bg-black text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">
          {event.category}
        </span>

        <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

        <div className="space-y-3 text-lg text-gray-700">
          <div className="flex items-center">
            <FaCalendar className="text-black mr-3" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <FaClock className="text-black mr-3" />
            {event.time}
          </div>
          
          <div className="flex items-center">
  <FaMapMarkerAlt className="text-black mr-3" />
  {event.venue}
</div>

<EventMap
  venueName={event.venue}
  title={event.title}
/>

          <div className="flex items-center">
            <FaUsers className="text-blue-500 mr-3" />
            Capacity: {event.capacity}
          </div>
        </div>

        <div className="my-8">
          <h3 className="text-xl font-semibold mb-2">About This Event</h3>
          <p className="text-gray-600">{event.description}</p>
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mt-6">
          <div>
            <h3 className="text-black text-2xl font-bold">₹{event.ticketPrice}</h3>
            <p className="text-sm text-gray-500">
              {event.availableTickets} tickets remaining
            </p>
          </div>
          
         
          <button className="flex items-center bg-black hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-lg" onClick={handleBooking}>
            <FaTicketAlt className="mr-2" />
            Book Tickets
          </button>
          
         
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
