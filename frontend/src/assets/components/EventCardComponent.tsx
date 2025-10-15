import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import type { IEventDTO } from "../../interfaces/IEvent";
import CountdownTimer from "./CountDownTimer";

type EventCardProps = {
  event: IEventDTO;
  onClick: (id: string) => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  let imageSrc = "https://via.placeholder.com/300x200";
  if (event.images && event.images.length > 0) {
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

  return (
    <div
      className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl overflow-hidden hover:from-white/15 hover:to-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-purple-500/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col h-full"
      onClick={() => event._id && onClick(event._id)}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      
      <div className="relative flex flex-col h-full">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img
            src={imageSrc}
            alt={event.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Category Badge */}
          <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
            {event.category}
          </span>

          {/* Countdown Timer - Positioned at bottom of image */}
          {event.status === "published" && (
            <div className="absolute bottom-3 left-3 right-3">
              <CountdownTimer eventDate={event.date.toString()} />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3 flex flex-col flex-grow">
          {/* Title */}
          <h2 className="text-xl font-black text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
            {event.title}
          </h2>

          {/* Event Details */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-300 text-sm">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/20 mr-2.5 flex-shrink-0">
                <FaCalendar className="text-purple-400 text-xs" />
              </div>
              <span className="font-medium text-xs">
                {new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            <div className="flex items-center text-gray-300 text-sm">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/20 mr-2.5 flex-shrink-0">
                <FaClock className="text-blue-400 text-xs" />
              </div>
              <span className="font-medium text-xs">{event.time}</span>
            </div>

            <div className="flex items-center text-gray-300 text-sm">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-500/20 mr-2.5 flex-shrink-0">
                <FaMapMarkerAlt className="text-pink-400 text-xs" />
              </div>
              <span className="font-medium text-xs line-clamp-1">{event.venue}</span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="pt-3 border-t border-white/10 flex-grow flex flex-col">
            {event.ticketPrice ? (
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Starting From</p>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    ₹{event.ticketPrice}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaTicketAlt className="text-purple-400 text-sm" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Tickets</h3>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(event.ticketTypes).slice(0, 3).map(([_, value], i) => (
                     
                    <div
                      key={i}
                      className="flex items-center justify-between bg-black/40 backdrop-blur-sm px-2.5 py-2 rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors"
                    >
                      <span className="text-gray-300 font-medium text-xs truncate max-w-[55%]" title={value.type}>
                        {value.type}
                      </span>
                      <div className="text-right flex-shrink-0">
                        <span className="text-white font-bold text-xs">₹{value.price}</span>
                        <span className="text-[10px] text-gray-400 ml-1.5">
                          ({Number(value.capacity) - Number((value as any).sold ?? 0)} left)
                        </span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(event.ticketTypes).length > 3 && (
                    <p className="text-[10px] text-gray-400 text-center pt-1">
                      +{Object.keys(event.ticketTypes).length - 3} more ticket types
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Button - Always at bottom */}
            <button className="w-full mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-[1.02]">
              <FaTicketAlt className="text-sm" />
              <span className="text-sm">
                {event.status !== "completed" ? "Book Now" : "View Reviews"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;