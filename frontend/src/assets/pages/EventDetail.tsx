import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaUsers,
  FaStar,
  FaUser,
  FaPaperPlane,
  FaQuoteLeft,
} from "react-icons/fa";

import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import EventMap from "../components/EventMap";
import { eventRepository } from "../../repositories/eventRepositories";
import EventInfoItem from "../components/EventInfoItem";
import { reviewRepository } from "../../repositories/reviewRepositories";

interface Review {
  _id: string;
  user: {
    name: string;
    _id: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  eventId: string;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEventDTO | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  
  const navigate = useNavigate();
  
  let imageSrc = "https://via.placeholder.com/300x200";
  if (event && event.images && event.images.length > 0) {
    const img = event.images[0];
    if (img.startsWith("http")) {
      imageSrc = img;
    } else {
      imageSrc = `http://localhost:3000/${img.replace(/\\/g, "/")}`;
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

  
  

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  


  if (!event) return <div className="text-center mt-20">Loading...</div>;

  const handleBooking = async () => {
    const eventId = event._id;
    navigate(`/eventBooking/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <UserNavbar />

      <div className="max-w-4xl mx-auto p-6">
        <img
          src={imageSrc}
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-xl mb-6"
        />

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
          <div>
            <h3 className="text-black text-2xl font-bold">
              ₹{event.ticketPrice}
            </h3>
            <p className="text-sm text-gray-500">
              {event.availableTickets} tickets remaining
            </p>
          </div>

          <button
            className="flex items-center bg-black hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-lg"
            onClick={handleBooking}
          >
            <FaTicketAlt className="mr-2" />
            Book Tickets
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default EventDetail;