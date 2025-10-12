import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import api from "../utils/api";
import {
  CalendarDays,
  Clock,
  MapPin,
  Tag,
  Users,
  Ticket,
  Loader,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1493225455756-0021d5e3833d?auto=format&fit=crop&w=800&q=80";
const centerDefault = { lat: 28.6139, lng: 77.209 };

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [center, setCenter] = useState(centerDefault);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/events/${id}`);
        const data = res.data;

        const total = data.total_seats || 0;
        const booked = data.bookingsCount || 0;
        setAvailableSeats(Math.max(total - booked, 0));
        setEvent(data);

        if (data.location) {
          const geo = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
              data.location
            )}`
          );
          if (geo.data?.length > 0) {
            const { lat, lon } = geo.data[0];
            setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center text-gray-900">
        <Loader className="w-10 h-10 animate-spin text-purple-500" />
        <p className="mt-3 text-gray-600">Loading Event Details...</p>
      </div>
    );

  if (error || !event)
    return (
      <div className="min-h-screen bg-white flex justify-center items-center text-red-500 text-lg">
        {error || "Event not found"}
      </div>
    );

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(event.date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleBookNow = () => {
    if (event.available_seats > 0) navigate(`/booking/${event.id}`);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans py-10 px-4 md:px-10 relative overflow-hidden">
      {/* 🌄 Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full h-96 bg-cover bg-center rounded-3xl shadow-2xl mb-10"
       style={{
  backgroundImage: `url(${event.img || FALLBACK_IMAGE})`,
  backgroundSize: "cover",       // ensures the image covers the full container
  backgroundPosition: "center",  // keeps the focus centered
  backgroundRepeat: "no-repeat", // prevents image tiling
}}

      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent rounded-3xl"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-5xl font-extrabold text-white mb-2">{event.title}</h1>
          <p className="text-xl text-gray-200">{event.location} • {formattedDate}</p>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 z-10">
        {/* LEFT SIDE: Details */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 flex flex-col"
        >
          <div className="flex flex-wrap gap-6 text-gray-600 mt-4 justify-between">
            <span className="flex items-center gap-2">
              <CalendarDays className="text-purple-600 w-5 h-5" /> {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="text-purple-600 w-5 h-5" /> {formattedTime}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="text-purple-600 w-5 h-5" /> {event.location}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10">
            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 p-6 rounded-2xl shadow-md text-center"
            >
              <Tag className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Price</p>
              <p className="font-semibold text-lg">₹{event.price}</p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 p-6 rounded-2xl shadow-md text-center"
            >
              <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Seats Left</p>
              <p className="font-semibold text-lg">
                {event.available_seats}/{event.total_seats}
              </p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 p-6 rounded-2xl shadow-md text-center"
            >
              <Ticket className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Status</p>
              <p className="font-semibold text-lg">
                {event.available_seats > 0 ? "Available" : "Sold Out"}
              </p>
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-4">
            About This <span className="text-purple-600">Event</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">
            {event.description}
          </p>

          {/* 🎟 Animated Book Button */}
          <motion.button
            onClick={handleBookNow}
            disabled={availableSeats <= 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-12 rounded-full font-bold text-lg transition-all shadow-lg mx-auto mt-auto ${
              event.available_seats > 0
                ? "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Ticket className="inline-block w-5 h-5 mr-2" />
            {event.available_seats > 0 ? "Book Now" : "Sold Out"}
          </motion.button>
        </motion.div>

        {/* RIGHT SIDE: Map */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={itemVariants}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
        >
          <h3 className="text-center text-3xl font-bold text-gray-800 py-6 border-b border-gray-200">
            Event <span className="text-purple-600">Location</span>
          </h3>

          <div className="relative" style={{ height: "500px" }}>
            <MapContainer
              key={`${center.lat}-${center.lng}`}
              center={[center.lat, center.lng]}
              zoom={14}
              scrollWheelZoom={true}
              className="z-0 rounded-b-3xl"
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[center.lat, center.lng]}>
                <Popup>
                  <strong>{event.title}</strong> <br /> {event.location}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="text-sm text-gray-500 text-center py-4">
            {center.lat === centerDefault.lat
              ? "📍 Showing default location (geocoding failed)."
              : `Map showing ${event.location}`}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;