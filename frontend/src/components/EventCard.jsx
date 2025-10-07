import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // ✅ Click handler only for View Details
  const handleViewDetails = (e) => {
    e.stopPropagation(); // prevent other clicks
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/events/${event.id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-400"
      whileHover={{
        scale: 1.03,
        boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {event.img ? (
          <img
            src={event.img}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-purple-600 font-semibold text-lg p-4">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 bg-purple-200 rounded-full mb-3"
            />
            <p className="text-sm text-gray-500">Image Not Available</p>
          </div>
        )}

        <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          {new Date(event.date).toLocaleDateString()}
        </span>
      </div>

      <div className="p-5">
        <motion.h3
          variants={textVariants}
          className="text-2xl font-extrabold text-gray-900 mb-2 truncate"
        >
          {event.title}
        </motion.h3>

        <motion.p
          variants={textVariants}
          className="text-sm text-gray-600 mb-4 line-clamp-2"
        >
          {event.description?.substring(0, 100)}...
        </motion.p>

        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-green-700 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
            {event.location}
          </span>

          <span className="text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-xs font-bold">
            Seats: {event.available_seats}/{event.total_seats}
          </span>
        </div>

        {/* ✅ Clickable View Details Button */}
        <div className="mt-5">
          <button
            onClick={handleViewDetails}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-purple-700 transition duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
