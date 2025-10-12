import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
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

  if (loading) {
    return (
      <div className="bg-white text-gray-900 flex flex-col items-center justify-center min-h-screen py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-purple-500" />
        </motion.div>
        <p className="mt-4 text-xl text-gray-600">Loading Booking Details...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="bg-white text-gray-900 min-h-screen flex items-center justify-center py-20">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }
  
  const isSoldOut = event.available_seats <= 0;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-gray-900">
      <motion.div
        className="flex flex-col justify-center p-8 md:p-12 lg:p-16"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-4xl font-extrabold mb-4 text-center text-purple-600">
            Book Your Tickets
          </h1>
          <p className="text-center text-xl font-semibold mb-8 text-gray-600">{event.title}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div 
              className="flex flex-col items-center bg-gray-50 rounded-xl p-4 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Tag className="w-6 h-6 text-orange-500 mb-2" />
              <span className="text-sm text-gray-500">Price</span>
              <span className="text-lg font-bold text-gray-900">₹{event.price.toLocaleString('en-IN')}</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center bg-gray-50 rounded-xl p-4 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Users className="w-6 h-6 text-orange-500 mb-2" />
              <span className="text-sm text-gray-500">Seats Left</span>
              <span className={`text-lg font-bold ${isSoldOut ? 'text-red-500' : 'text-green-600'}`}>
                {isSoldOut ? 'Sold Out' : event.available_seats}
              </span>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <div>
              <label htmlFor="quantity-input" className="block mb-2 font-semibold text-gray-800">
                Quantity
                <span className="text-sm font-normal text-gray-500 ml-2">({event.available_seats} available)</span>
              </label>
              <div className={`flex items-center bg-white border rounded-lg transition-colors duration-150 ${quantity !== 0 && (quantity < 1 || quantity > event.available_seats) ? 'border-red-500' : 'border-gray-300'}`}>
                <button
                  type="button"
                  onClick={decrementQuantity}
                  aria-label="Decrease quantity"
                  className="px-3 py-3 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:bg-white disabled:opacity-50 transition duration-150"
                  disabled={quantity <= 1 || isSoldOut} 
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  id="quantity-input"
                  type="number"
                  step="1"
                  value={quantity === 0 ? '' : quantity} 
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  placeholder='1'
                  min={1}
                  max={event.available_seats}
                  disabled={isSoldOut} 
                  className="flex-1 p-3 bg-white text-center focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900 border-x border-gray-300 font-semibold text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={incrementQuantity}
                  aria-label="Increase quantity"
                  className="px-3 py-3 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:bg-white disabled:opacity-50 transition duration-150"
                  disabled={quantity >= event.available_seats || isSoldOut} 
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {quantity === event.available_seats && !isSoldOut && (
                <p className="flex items-center gap-1 text-xs text-green-600 mt-2"><Check className='w-4 h-4'/> Maximum available seats selected.</p>
              )}
              {isSoldOut && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-2"><Ban className='w-4 h-4'/> This event is currently sold out.</p>
              )}
              {quantity !== 0 && (quantity < 1 || quantity > event.available_seats) && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-2"><X className='w-4 h-4'/> Invalid quantity. Must be between 1 and {event.available_seats}.</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-800">Mobile (optional)</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-600 transition duration-150">
                <Phone className="w-5 h-5 text-gray-500 ml-3" />
                <input
                  type="tel" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g., 9876543210 (10 digits)" 
                  className="flex-1 p-3 bg-transparent focus:outline-none text-gray-900"
                  disabled={isSoldOut}
                />
              </div>
            </div>

            <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-4">
              <span>Total:</span>
              <span className="text-orange-500">
                ₹{((quantity > 0 ? quantity : 0) * event.price).toLocaleString('en-IN')}
              </span>
            </div>

            <motion.button
              type="submit"
              disabled={submitting || quantity > event.available_seats || quantity < 1 || isSoldOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                submitting || isSoldOut || quantity < 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-xl'
              }`}
            >
              <Ticket className="w-5 h-5" />
              {isSoldOut
                ? 'Sold Out'
                : submitting
                ? <><Loader className='w-5 h-5 animate-spin'/> Processing...</>
                : 'Confirm Booking'}
            </motion.button>

            {error && <p className="flex items-center justify-center gap-2 text-red-500 text-center mt-4"><X className='w-5 h-5'/>{error}</p>}
          </form>
        </div>
      </motion.div>

      <motion.div
        className="hidden md:block relative overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img
          src={event.img || 'https://images.unsplash.com/photo-1493225455756-0021d5e3833d?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="object-cover w-full h-full min-h-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white opacity-50"></div> 
      </motion.div>
    </div>
  );
};

export default Booking;