// src/pages/Booking.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Ticket, Users, Tag, Phone, Loader } from 'lucide-react';
import api from '../utils/api';
const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(true); // 🔹 start as true until event loads
  const [submitting, setSubmitting] = useState(false); // 🔹 separate state for booking submit
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      };
      const res = await api.post(
        '/api/bookings',
        { event_id: parseInt(id), quantity: parseInt(quantity), mobile },
        config
      );
      navigate(`/success/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 Loading State
  if (loading) {
    return (
      <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-purple-500" />
        </motion.div>
        <p className="mt-4 text-xl text-gray-400">Loading Booking Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center py-20">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/80 to-black flex items-center justify-center px-4 py-12">
      <motion.div
        className="bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-lg w-full text-white border border-purple-600/40"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Event Title */}
        <h1 className="text-3xl font-extrabold mb-6 text-center text-yellow-400">
          Book Your Tickets
        </h1>
        <p className="text-center text-lg font-semibold mb-6">{event.title}</p>

        {/* Event Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4">
            <Tag className="w-6 h-6 text-yellow-400 mb-2" />
            <span className="text-sm text-gray-300">Price</span>
            <span className="text-lg font-bold">₹{event.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4">
            <Users className="w-6 h-6 text-yellow-400 mb-2" />
            <span className="text-sm text-gray-300">Seats Left</span>
            <span className="text-lg font-bold">{event.available_seats}</span>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(parseInt(e.target.value) || 1, event.available_seats))
              }
              min="1"
              max={event.available_seats}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Mobile (optional)</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="flex-1 p-3 bg-transparent focus:outline-none text-white"
              />
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-medium border-t border-gray-700 pt-4">
            <span>Total:</span>
            <span className="text-yellow-400">
              ₹{(quantity * event.price).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={submitting || event.available_seats < quantity}
            className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              submitting
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            <Ticket className="w-5 h-5" />
            {submitting ? 'Processing...' : 'Confirm Booking'}
          </button>

          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
};

export default Booking;
