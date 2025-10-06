// src/pages/EventDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from "framer-motion";
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';
import { Calendar, MapPin, Tag, Users, Clock, Loader, Ticket } from 'lucide-react'; 
import api from "../utils/api";
const mapContainerStyle = { height: "400px", width: "100%" };
const centerDefault = { lat: 28.6139, lng: 77.209 }; 

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1540130635574-855734898144?fit=crop&w=1920&q=80"; 

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [event, setEvent] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(0);
    const [center, setCenter] = useState(centerDefault);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingCount, setBookingCount] = useState(1); 

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/events/${id}`);
                setEvent(res.data);
                setAvailableSeats(res.data.total_seats - (res.data.bookingsCount || 0)); 
                
                if (res.data.location) {
                    try {
                        const geoRes = await api.get(
                            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(res.data.location)}`
                        ); 
                        if (geoRes.data && geoRes.data.length > 0) {
                            const { lat, lon } = geoRes.data[0];
                            setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
                        }
                    } catch (geoErr) {
                        console.warn("Geocoding error, using default center.");
                    }
                }
            } catch (err) {
                console.error("Error fetching event:", err);
                setError("Event not found or failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader className="w-12 h-12 text-purple-500" />
                </motion.div>
                <p className="mt-4 text-xl text-gray-400">Loading Event Details...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center py-20">
                <p className="text-xl text-red-500">{error || "Event data is missing."}</p>
            </div>
        );
    }
    
    const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const formattedTime = new Date(event.date).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit',
    });
    
    const backgroundImageUrl = event.imgUrl || FALLBACK_IMAGE;

    const handleBookNow = () => {
        navigate(`/booking/${event.id}?tickets=${bookingCount}`);
    };

    return (
        <div className="bg-black text-white min-h-screen font-sans relative z-0">
            
            {/* 🚀 Header with parallax background */}
            <header 
                className="relative w-full h-[60vh] flex items-center justify-center bg-cover bg-center bg-fixed z-0"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }} 
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div> 
                
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center p-6 max-w-4xl mx-auto"
                >
                    <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
                        {event.title}
                    </h1>
                    <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 mt-6 text-xl text-yellow-400 font-semibold">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-400" /> {formattedDate}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-400" /> {formattedTime}
                        </span>
                    </div>
                </motion.div>
            </header>

            {/* 🚀 Main content with padding so it doesn’t overlap navbar */}
            <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10 pt-24"> 
                <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 border-t-8 border-purple-500 -mt-10 md:-mt-16">
                    
                    {/* Event Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center">
                        <div className="p-4 bg-gray-800 rounded-xl">
                            <MapPin className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <p className="text-gray-300 text-sm">Location</p>
                            <p className="text-lg font-bold text-white">{event.location}</p>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-xl">
                            <Tag className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <p className="text-gray-300 text-sm">Price</p>
                            <p className="text-lg font-bold text-white">₹{event.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-xl">
                            <Users className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <p className="text-gray-300 text-sm">Seats Left</p>
                            <p className="text-lg font-bold text-white">
                                {availableSeats} / {event.total_seats}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <section className="mb-10">
                        <h2 className="text-3xl font-bold text-purple-400 mb-4 border-b border-gray-700 pb-2">About the Event</h2>
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{event.description}</p>
                    </section>
                    
                    {/* Booking and Map Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Left Side: Booking Form */}
                        <motion.div className="p-6 bg-gray-800 rounded-xl shadow-inner border border-purple-700/50"
                            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <h3 className="text-3xl font-bold text-yellow-400 mb-5">Secure Your Spot</h3>
                            
                            <div className="flex items-center justify-between mb-4">
                                <label htmlFor="bookingCount" className="text-lg text-white">Number of Tickets:</label>
                                <input
                                    type="number"
                                    id="bookingCount"
                                    min="1"
                                    max={availableSeats}
                                    value={bookingCount}
                                    onChange={(e) => setBookingCount(Math.min(parseInt(e.target.value) || 1, availableSeats))}
                                    className="w-20 p-2 text-center bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500"
                                    disabled={availableSeats <= 0}
                                />
                            </div>

                            <div className="mb-6 border-t border-gray-700 pt-4">
                                <p className="flex justify-between text-xl font-semibold text-white">
                                    <span>Total Price:</span>
                                    <span className="text-yellow-400">₹{(event.price * bookingCount).toLocaleString('en-IN')}</span>
                                </p>
                            </div>
                            
                            <button 
                                className={`w-full py-3 rounded-full font-bold text-lg transition duration-300 flex items-center justify-center gap-2 ${
                                    availableSeats > 0 
                                    ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                                disabled={availableSeats <= 0}
                                onClick={handleBookNow}
                            >
                                <Ticket className="w-5 h-5" />
                                {availableSeats > 0 ? "Book Now" : "Sold Out"}
                            </button>
                        </motion.div>
                        
                        {/* Right Side: Map */}
                        <motion.div className="shadow-2xl rounded-2xl overflow-hidden bg-gray-800"
                            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <h3 className="text-2xl font-semibold p-4 bg-purple-500/20 text-white text-center">Event Location</h3>
                            <MapContainer 
                                key={`${center.lat}-${center.lng}`} 
                                center={[center.lat, center.lng]} 
                                zoom={14} 
                                style={mapContainerStyle}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[center.lat, center.lng]}>
                                    <Popup>
                                        <strong>{event.title}</strong><br />
                                        {event.location}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                            <p className="text-sm text-center p-3 text-gray-400">
                                {center.lat === centerDefault.lat && center.lng === centerDefault.lng 
                                    ? `Showing default location. Geocoding for "${event.location}" failed.` 
                                    : `Map for: ${event.location}`}
                            </p>
                        </motion.div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default EventDetails;
