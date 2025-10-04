// src/components/EventCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {event.img && <img src={event.img} alt={event.title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p>{event.description.substring(0, 100)}...</p>
        <p>Location: {event.location}</p>
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        <p>Available: {event.available_seats}/{event.total_seats}</p>
        <Link to={`/events/${event.id}`} className="bg-purple-600 text-white px-4 py-2 rounded mt-2 inline-block">Details</Link>
      </div>
    </motion.div>
  );
};

export default EventCard;