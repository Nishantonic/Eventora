// src/pages/Booking.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await axios.get(`/api/events/${id}`);
      setEvent(res.data);
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      };
      const res = await axios.post('/api/bookings', { event_id: id, quantity, mobile }, config);
      navigate(`/success/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="container mx-auto p-4 max-w-md"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Book {event.title}</h1>
      <label className="block mb-2">Quantity</label>
      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" max={event.available_seats} className="w-full p-2 border mb-4" />
      <label className="block mb-2">Mobile (optional)</label>
      <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full p-2 border mb-4" />
      <p>Total: ${quantity * event.price}</p>
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded mt-4">Confirm Booking</button>
    </motion.form>
  );
};

export default Booking;