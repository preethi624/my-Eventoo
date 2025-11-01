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
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import EventMap from "../components/EventMap";
import { eventRepository } from "../../repositories/eventRepositories";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEventDTO | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  console.log("event",event);
  

  const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
  const offerCode = searchParams.get("code"); 

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
          <p className="text-gray-700 mt-4 text-lg">Loading amazing experience...</p>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    const eventId = event._id;
    if(offerCode){
       navigate(`/eventBooking/${eventId}/?code=${offerCode}`);
    }else{
      navigate(`/eventBooking/${eventId}`);
      
    }
    
  };

  const InfoCard = ({ icon, label, sublabel }: any) => (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-red-500 transition-all duration-300 hover:shadow-md">
      <div className="text-3xl text-red-500 group-hover:text-red-600 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-gray-900 font-semibold text-lg">{label}</p>
        {sublabel && <p className="text-gray-600 text-sm">{sublabel}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />

      {/* Hero Section */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-24 right-6 flex flex-col gap-3 z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 hover:bg-white transition-all duration-300 hover:shadow-lg group"
          >
            <FaArrowLeft className="text-gray-700 text-xl group-hover:text-red-500" />
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-4 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 hover:bg-white transition-all duration-300 hover:shadow-lg group"
          >
            <FaHeart
              className={`text-xl transition-colors ${
                isLiked ? "text-red-500" : "text-gray-700 group-hover:text-red-400"
              }`}
            />
          </button>
          <button className="p-4 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 hover:bg-white transition-all duration-300 hover:shadow-lg group">
            <FaShare className="text-gray-700 text-xl group-hover:text-red-500" />
          </button>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-10 left-0 right-0 p-8 pb-16 max-w-6xl mx-auto">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-semibold shadow-lg">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                About This Event
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                Location
              </h3>
              <p className="text-gray-700 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                {event.venue}
              </p>
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <EventMap venueName={event.venue} title={event.title} />
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm sticky top-24">
              {event.ticketPrice ? (
                <>
                  <div className="text-center mb-6">
                    <p className="text-gray-600 text-sm mb-2">Starting From</p>
                    <h3 className="text-5xl font-bold text-red-500">
                      ₹{event.ticketPrice}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 flex items-center justify-center gap-2">
                      <FaTicketAlt />
                      {event.availableTickets} tickets remaining
                    </p>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaTicketAlt className="text-red-500" /> Ticket Options
                  </h3>
                  <div className="space-y-3">
                    {event.ticketTypes.map((t, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 hover:border-red-500 transition-all duration-300 group"
                      >
                        <div className="flex flex-col">
                          <span className="capitalize font-semibold text-gray-900 text-lg group-hover:text-red-500 transition-colors">
                            {t.type}
                          </span>
                          <span className="text-sm text-gray-600">
                            {t.capacity - (t.sold ?? 0)} left
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-red-500">
                          ₹{t.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                onClick={handleBooking}
              >
                <FaTicketAlt className="text-2xl group-hover:rotate-12 transition-transform" />
                Book Your Spot
              </button>

              <button
                className="w-full mt-3 text-gray-600 hover:text-red-500 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300"
                onClick={() => setShowTermsModal(true)}
              >
                Terms & Conditions
                <FaChevronRight className="text-xs" />
              </button>

              <p className="text-center text-gray-600 text-xs mt-4">
                Secure checkout • Instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
      <Footer/>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <FaTimes className="text-gray-600 text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-6 text-gray-700">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Booking & Tickets</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>All bookings are subject to availability and confirmation.</li>
                    <li>Tickets once booked cannot be exchanged, cancelled or refunded.</li>
                    <li>Lost or stolen tickets will not be replaced or refunded.</li>
                    <li>Entry to the venue is subject to the terms and conditions of the venue/organizer.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Entry Policy</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Please carry a valid ID proof along with your ticket for entry.</li>
                    <li>Age restrictions, if any, will be mentioned on the event page.</li>
                    <li>The organizer reserves the right to deny entry without refund.</li>
                    <li>Outside food and beverages are not allowed inside the venue.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Event Changes & Cancellations</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>The organizer reserves the right to make changes to the event schedule, artists, or venue.</li>
                    <li>In case of event cancellation, refunds will be processed as per organizer's policy.</li>
                    <li>We are not responsible for any travel or accommodation expenses incurred.</li>
                    <li>Rescheduled events will honor the original tickets unless otherwise stated.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Conduct & Safety</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Please follow all safety guidelines and instructions from venue staff.</li>
                    <li>Disruptive behavior may result in removal from the venue without refund.</li>
                    <li>Photography and recording may be restricted for certain events.</li>
                    <li>The organizer is not liable for any loss, injury, or damage during the event.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Privacy & Data</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Your booking information will be used for event management purposes.</li>
                    <li>We may share necessary details with the event organizer.</li>
                    <li>By booking, you agree to receive event-related communications.</li>
                    <li>We respect your privacy and follow applicable data protection laws.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">6. General Terms</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>These terms are subject to change without prior notice.</li>
                    <li>All disputes are subject to local jurisdiction only.</li>
                    <li>By completing your booking, you agree to these terms and conditions.</li>
                    <li>For any queries, please contact our customer support.</li>
                  </ul>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-1 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;