// src/pages/EventDetails.jsx - Ensure map and content stack on mobile
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const socket = io();

const mapContainerStyle = {
  height: '300px',
  width: '100%'
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(0);

  useEffect(() => {
    // ... same as before
  }, [id]);

  if (!event) return <p className="text-center">Loading...</p>;

  return (
    <motion.div 
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">{event.title}</h1>
      <div className="flex flex-col md:flex-row md:space-x-8 mt-4">
        <div className="flex-1">
          <p className="mb-4">{event.description}</p>
          <p className="mb-2">Location: {event.location}</p>
          <p className="mb-2">Date: {new Date(event.date).toLocaleString()}</p>
          <p className="mb-2">Price: ${event.price}</p>
          <p className="mb-4">Available Seats: {availableSeats}</p>
          <Link to={`/booking/${id}`} className="bg-purple-600 text-white px-4 py-2 rounded block text-center md:inline-block">Book Now</Link>
        </div>
        <div className="flex-1 mt-6 md:mt-0">
          <LoadScript googleMapsApiKey="YOUR_API_KEY">
            <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: 0, lng: 0 }} zoom={10}>
              <Marker position={{ lat: 0, lng: 0 }} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetails;