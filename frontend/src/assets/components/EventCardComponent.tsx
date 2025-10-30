
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

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return { day, dateNum, month };
  };

  const dateInfo = formatDate(event.date);

  return (
    <div
      className="group relative bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => event._id && onClick(event._id)}
    >
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden flex-shrink-0">
        <img
          src={imageSrc}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Date Badge - Top Left */}
        <div className="absolute top-4 left-4 bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg w-16 text-center">
          <div className="bg-red-500 text-white text-xs font-bold py-1">
            {dateInfo.day}
          </div>
          <div className="py-2">
            <div className="text-2xl font-black leading-none">{dateInfo.dateNum}</div>
            <div className="text-xs font-semibold">{dateInfo.month}</div>
          </div>
        </div>

        {/* Countdown Timer - Only if published */}
        {event.status === "published" && (
          <div className="absolute bottom-4 left-4 right-4">
            <CountdownTimer eventDate={event.date.toString()} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3 flex flex-col flex-grow bg-gray-900">
        {/* Title */}
        <h2 className="text-xl font-bold text-white line-clamp-2 min-h-[3.5rem]">
          {event.title}
        </h2>

        {/* Venue */}
        <p className="text-gray-400 text-sm line-clamp-1">
          {event.venue}
        </p>

        {/* Category */}
        <p className="text-gray-500 text-xs">
          {event.category}
        </p>

        {/* Pricing Section */}
        <div className="pt-3 flex-grow flex flex-col justify-end">
          {event.ticketPrice ? (
            <div className="mb-3">
              <p className="text-gray-400 text-xs">
                ₹ {event.ticketPrice}
              </p>
            </div>
          ) : (
            <div className="mb-3">
              <p className="text-gray-400 text-xs">
                ₹ {Object.values(event.ticketTypes)[0]?.price || 0} onwards
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;