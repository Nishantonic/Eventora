// src/pages/Booking.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
// Added icons for clarity: Check, X, Ban
import { Ticket, Users, Tag, Phone, Loader, Check, X, Ban, Minus, Plus } from 'lucide-react'; 
import api from '../utils/api';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        setEvent(res.data);
        // Ensure quantity is not greater than available seats on load
        if (res.data.available_seats < quantity) {
             setQuantity(res.data.available_seats > 0 ? 1 : 0);
        }
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
    // Re-validate against current state before submitting
    if (quantity < 1 || quantity > event.available_seats) {
         setError('Invalid quantity selected.');
         return;
    }

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
      setError('Booking failed. Please try again. The event may be sold out or you are not logged in.');
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, event?.available_seats || 1));
  };

  const decrementQuantity = () => {
    // Correct logic: Prevents quantity from going below 1 (for tickets)
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleQuantityChange = (e) => {
    const valueStr = e.target.value;
    const value = parseInt(valueStr, 10);
    setQuantity(isNaN(value) ? 0 : value);
  };

  const handleQuantityBlur = () => {
    let newQuantity = quantity;
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }
    newQuantity = Math.min(newQuantity, event?.available_seats || 1);
    setQuantity(newQuantity);
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

  if (error && !event) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center py-20">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }
  
  // Handle case where event loads but has no seats
  const isSoldOut = event.available_seats <= 0;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-purple-950 text-white">
      {/* Left Section: Booking Details and Form */}
      <motion.div
        className="flex flex-col justify-center p-8 md:p-12 lg:p-16"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto w-full">
          {/* Event Title */}
          <h1 className="text-4xl font-extrabold mb-4 text-center text-yellow-400">
            Book Your Tickets
          </h1>
          <p className="text-center text-xl font-semibold mb-8 text-gray-200">{event.title}</p>

          {/* Event Summary */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col items-center bg-gray-800 rounded-xl p-4 shadow-md">
              <Tag className="w-6 h-6 text-yellow-400 mb-2" />
              <span className="text-sm text-gray-300">Price</span>
              <span className="text-lg font-bold text-white">₹{event.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-800 rounded-xl p-4 shadow-md">
              <Users className="w-6 h-6 text-yellow-400 mb-2" />
              <span className="text-sm text-gray-300">Seats Left</span>
              <span className={`text-lg font-bold ${isSoldOut ? 'text-red-500' : 'text-green-400'}`}>
                {isSoldOut ? 'Sold Out' : event.available_seats}
              </span>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-2xl shadow-xl border border-purple-600/40">
            {/* Quantity Field with Availability Info */}
            <div>
              <label htmlFor="quantity-input" className="block mb-2 font-semibold text-gray-200">
                Quantity
                <span className="text-sm font-normal text-gray-400 ml-2">({event.available_seats} available)</span>
              </label>
              <div className={`flex items-center bg-gray-800 border rounded-lg transition-colors duration-150 ${quantity !== 0 && (quantity < 1 || quantity > event.available_seats) ? 'border-red-500' : 'border-gray-700'}`}>
                <button
                  type="button"
                  onClick={decrementQuantity}
                  aria-label="Decrease quantity"
                  className="px-3 py-3 text-white hover:bg-gray-700 rounded-l-lg disabled:bg-gray-900 disabled:opacity-50 transition duration-150"
                  disabled={quantity <= 1 || isSoldOut} // Disabled if at min (1) or sold out
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  id="quantity-input"
                  type="number"
                  step="1"
                  value={quantity === 0 ? '' : quantity} // Show empty when temporarily 0 for better UX during editing
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  placeholder='1'
                  min={1}
                  max={event.available_seats}
                  disabled={isSoldOut} // Disabled if sold out
                  // 🚩 FIX: Improved input UI with better focus and consistent background
                  className="flex-1 p-3 bg-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white border-x border-gray-700 font-semibold text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={incrementQuantity}
                  aria-label="Increase quantity"
                  className="px-3 py-3 text-white hover:bg-gray-700 rounded-r-lg disabled:bg-gray-900 disabled:opacity-50 transition duration-150"
                  disabled={quantity >= event.available_seats || isSoldOut} // Disabled if at max or sold out
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {/* Added feedback when max quantity is selected */}
              {quantity === event.available_seats && !isSoldOut && (
                <p className="flex items-center gap-1 text-xs text-yellow-400 mt-2"><Check className='w-4 h-4'/> Maximum available seats selected.</p>
              )}
              {isSoldOut && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-2"><Ban className='w-4 h-4'/> This event is currently **Sold Out**.</p>
              )}
              {quantity !== 0 && (quantity < 1 || quantity > event.available_seats) && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-2"><X className='w-4 h-4'/> Invalid quantity. Must be between 1 and {event.available_seats}.</p>
              )}
            </div>

            {/* Mobile Field with better type/placeholder */}
            <div>
              <label className="block mb-2 font-semibold text-gray-200">Mobile (optional)</label>
              <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition duration-150">
                <Phone className="w-5 h-5 text-gray-400 ml-3" />
                <input
                  type="tel" // Changed to 'tel' for better mobile keyboard
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g., 9876543210 (10 digits)" // Added a clear placeholder
                  className="flex-1 p-3 bg-transparent focus:outline-none text-white"
                  disabled={isSoldOut}
                />
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-medium border-t border-gray-700 pt-4">
              <span>Total:</span>
              <span className="text-yellow-400">
                ₹{((quantity > 0 ? quantity : 0) * event.price).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={submitting || quantity > event.available_seats || quantity < 1 || isSoldOut}
              className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                submitting || isSoldOut || quantity < 1
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white hover:scale-[1.01] active:scale-100 shadow-md hover:shadow-lg' // Enhanced hover effect
              }`}
            >
              <Ticket className="w-5 h-5" />
              {isSoldOut
                ? 'Sold Out'
                : submitting
                ? <><Loader className='w-5 h-5 animate-spin'/> Processing...</>
                : 'Confirm Booking'}
            </button>

            {error && <p className="flex items-center justify-center gap-2 text-red-400 text-center mt-4"><X className='w-5 h-5'/>{error}</p>}
          </form>
        </div>
      </motion.div>

      {/* Right Section: Event Image */}
      <motion.div
        className="hidden md:block relative overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={event.img || 'https://via.placeholder.com/800x1200?text=Event+Image'}
          alt={event.title}
          className="object-fit w-full h-full min-h-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black opacity-50"></div> {/* Gradient overlay for better contrast */}
      </motion.div>
    </div>
  );
};

export default Booking;