import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import api from "../utils/api";
import {
  Calendar,
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
  "https://images.unsplash.com/photo-1540130635574-855734898144?fit=crop&w=1920&q=80";
const centerDefault = { lat: 28.6139, lng: 77.209 };

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [center, setCenter] = useState(centerDefault);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parallax scroll hook
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 300], [0, -100]);

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
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
        <Loader className="w-10 h-10 animate-spin text-purple-500" />
        <p className="mt-3 text-gray-400">Loading Event Details...</p>
      </div>
    );

  if (error || !event)
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-red-500 text-lg">
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

  return (
    <div className="bg-black text-white min-h-screen font-sans py-10 px-4 md:px-10 relative overflow-hidden">
      {/* 🌄 Parallax Image Background */}
      <motion.div
        // style={{ y: yOffset }}
        className="absolute top-0 left-0 w-full h-full md:h-[400px] bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `url(${event.img || FALLBACK_IMAGE})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      ></motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mt-20 z-10">
        {/* LEFT SIDE: Details */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-purple-600 flex flex-col"
        >
          <img
            src={event.img || FALLBACK_IMAGE}
            alt={event.title}
            className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md"
          />

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-300 to-purple-700 bg-clip-text text-transparent">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-300 mt-4 justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="text-purple-400 w-5 h-5" /> {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="text-purple-400 w-5 h-5" /> {formattedTime}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 text-center">
            <div className="bg-gray-800 p-4 rounded-xl">
              <Tag className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-gray-400 text-sm">Price</p>
              <p className="font-semibold">₹{event.price}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <Users className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-gray-400 text-sm">Seats Left</p>
              <p className="font-semibold">
                {event.available_seats}/{event.total_seats}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <MapPin className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-gray-400 text-sm">Location</p>
              <p className="font-semibold">{event.location}</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-3 border-b border-gray-700 pb-2">
            About This Event
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
            {event.description}
          </p>

          {/* 🎟 Animated Book Button */}
          <motion.button
            onClick={handleBookNow}
            disabled={availableSeats <= 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-3 px-10 rounded-full font-bold text-lg transition-all shadow-lg mx-auto mt-auto ${
              event.available_seats > 0
                ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 hover:shadow-[0_0_20px_#a855f7] text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Ticket className="inline-block w-5 h-5 mr-2" />
            {event.available_seats > 0 ? "Book Now" : "Sold Out"}
          </motion.button>
        </motion.div>

        {/* RIGHT SIDE: Map */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-600 overflow-hidden relative z-10"
        >
          <h3 className="text-center text-3xl font-bold text-purple-400 py-4 border-b border-gray-800">
            Event Location
          </h3>

          <div className="relative z-10" style={{ height: "750px" }}>
            <MapContainer
              key={`${center.lat}-${center.lng}`}
              center={[center.lat, center.lng]}
              zoom={14}
              scrollWheelZoom={false}
              className="z-0 rounded-3xl"
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
          <p className="text-sm text-gray-400 text-center py-3 bg-black/50 relative z-20">
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
