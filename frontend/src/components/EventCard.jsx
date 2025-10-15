import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/events/${event.id}`);
  };

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=60";

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-2xl transition relative"
    >
      {/* Image Section */}
      <div
        className="relative h-56"
        style={{
          backgroundImage: `url(${event.img || FALLBACK_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {new Date(event.date).toLocaleDateString()}
        </span>

        <span className="absolute top-3 right-3 bg-white/90 text-purple-700 text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {event.category || "General"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between h-[260px]">
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-extrabold text-gray-900 mb-2 line-clamp-1"
          >
            {event.title}
          </motion.h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description?.substring(0, 100) || "Exciting event awaits!"}
          </p>

          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-600" />
              <span className="truncate">{event.location || "Online / TBA"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-green-600" />
              <span>
                {event.available_seats}/{event.total_seats} Seats Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-orange-500" />
              <span>{new Date(event.date).toDateString()}</span>
            </div>
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleViewDetails}
          className="mt-5 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-300"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventCard;
