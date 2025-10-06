import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaUsers,
  FaShare,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";

import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import EventMap from "../components/EventMap";
import { eventRepository } from "../../repositories/eventRepositories";
import Footer from "../components/Footer";

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEventDTO | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="text-white mt-4 text-lg">Loading amazing experience...</p>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    const eventId = event._id;
    navigate(`/eventBooking/${eventId}`);
  };

  const InfoCard = ({ icon, label, sublabel }: any) => (
    <div className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
      <div className="text-3xl text-purple-400 group-hover:text-purple-300 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-white font-semibold text-lg">{label}</p>
        {sublabel && <p className="text-gray-400 text-sm">{sublabel}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <UserNavbar />

      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt={event.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? "scale-100 blur-0" : "scale-110 blur-sm"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-transparent"></div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-24 right-6 flex flex-col gap-3 z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
          >
            <FaArrowLeft className="text-white text-xl group-hover:text-purple-300" />
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
          >
            <FaHeart
              className={`text-xl transition-colors ${
                isLiked ? "text-red-500" : "text-white group-hover:text-red-400"
              }`}
            />
          </button>
          <button className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 group">
            <FaShare className="text-white text-xl group-hover:text-purple-300" />
          </button>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-10 left-0 right-0 p-8 pb-16 max-w-6xl mx-auto">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-purple-500/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold shadow-lg border border-purple-400/30">
              {event.category}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <InfoCard
            icon={<FaCalendar />}
            label={new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            sublabel="Event Date"
          />
          <InfoCard icon={<FaClock />} label={event.time} sublabel="Start Time" />
          <InfoCard
            icon={<FaUsers />}
            label={event.capacity}
            sublabel="Total Capacity"
          />
          <InfoCard
            icon={<FaMapMarkerAlt />}
            label="View Map"
            sublabel={event.venue}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                About This Event
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Map Section */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
                Location
              </h3>
              <p className="text-gray-300 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-400" />
                {event.venue}
              </p>
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <EventMap venueName={event.venue} title={event.title} />
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 sticky top-24">
              {event.ticketPrice ? (
                <>
                  <div className="text-center mb-6">
                    <p className="text-gray-400 text-sm mb-2">Starting From</p>
                    <h3 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ₹{event.ticketPrice}
                    </h3>
                    <p className="text-purple-300 text-sm mt-2 flex items-center justify-center gap-2">
                      <FaTicketAlt />
                      {event.availableTickets} tickets remaining
                    </p>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FaTicketAlt className="text-purple-400" /> Ticket Options
                  </h3>
                  <div className="space-y-3">
                    {event.ticketTypes.map((t, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group"
                      >
                        <div className="flex flex-col">
                          <span className="capitalize font-semibold text-white text-lg group-hover:text-purple-300 transition-colors">
                            {t.type}
                          </span>
                          <span className="text-sm text-gray-400">
                            {t.capacity - (t.sold ?? 0)} left
                          </span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ₹{t.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/70 flex items-center justify-center gap-3 group"
                onClick={handleBooking}
              >
                <FaTicketAlt className="text-2xl group-hover:rotate-12 transition-transform" />
                Book Your Spot
              </button>

              <p className="text-center text-gray-400 text-xs mt-4">
                Secure checkout • Instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
      <Footer/>
    </div>
  );
};

export default EventDetail;