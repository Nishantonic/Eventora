// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    seats: 0,
    price: 0,
    image: '',
    category: ''
  });
  const [editing, setEditing] = useState(null);

  // ✅ Fetch all events
  useEffect(() => {
    if (user?.role !== 'admin') return;
    const fetchEvents = async () => {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.get('/api/events', config);
      setEvents(res.data);
    };
    fetchEvents();
  }, [user]);

  // ✅ Handle form input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Create or Update Event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

    const eventData = {
      title: form.title,
      description: form.description,
      location: form.location,
      category: form.category,
      total_seats: Number(form.seats), // Int
      price: Number(form.price), // Float
      image: form.image || null,
      date: form.date ? new Date(form.date).toISOString() : null // ISO format
    };

    if (editing) {
      await axios.put(`/api/events/${editing}`, eventData, config);
    } else {
      await axios.post('/api/events', eventData, config);
    }

    // Reset form & refresh list
    setForm({ title: '', description: '', location: '', date: '', seats: 0, price: 0, image: '', category: '' });
    setEditing(null);

    const res = await axios.get('/api/events', config);
    setEvents(res.data);
  };

  // ✅ Edit event
  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      category: event.category,
      total_seats: event.total_seats,
      price: event.price,
      image: event.image || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '' // convert ISO -> datetime-local
    });
    setEditing(event.id);
  };

  // ✅ Delete event
  const handleDelete = async (id) => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
    await axios.delete(`/api/events/${id}`, config);

    const res = await axios.get('/api/events', config);
    setEvents(res.data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="block mb-2 p-2 border w-full"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="block mb-2 p-2 border w-full"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="block mb-2 p-2 border w-full"
        />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          className="block mb-2 p-2 border w-full"
        />
        <input
          name="seats"
          type="number"
          value={form.seats}
          onChange={handleChange}
          placeholder="Seats"
          className="block mb-2 p-2 border w-full"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="block mb-2 p-2 border w-full"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="block mb-2 p-2 border w-full"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="block mb-2 p-2 border w-full"
        >
          <option value="">Select Category</option>
          <option value="Concert">Concert</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
          <option value="Conference">Conference</option>
          <option value="Meetup">Meetup</option>
          <option value="Festival">Festival</option>
          <option value="Sports">Sports</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Create'}
        </button>
      </form>

      {/* Event List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <motion.div key={event.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.category}</p>
            <p>{new Date(event.date).toLocaleString()}</p>
            <p>Seats: {event.seats}</p>
            <p>Price: ₹{event.price}</p>
            {event.image && <img src={event.image} alt={event.title} className="mt-2 rounded" />}
            <button
              onClick={() => handleEdit(event)}
              className="mr-2 mt-2 text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(event.id)}
              className="mt-2 text-red-600"
            >
              Delete
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
