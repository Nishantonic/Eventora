// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    total_seats: 0,
    price: 0,
    img: "",
    category: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchEvents = async () => {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      const res = await axios.get("/api/events", config);
      setEvents(res.data);
    };
    fetchEvents();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

    const eventData = {
      title: form.title,
      description: form.description,
      location: form.location,
      category: form.category,
      total_seats: Number(form.total_seats),
      price: Number(form.price),
      img: form.img || null,
      date: form.date ? new Date(form.date).toISOString() : null,
    };

    try {
      if (editing) await axios.put(`/api/events/${editing}`, eventData, config);
      else await axios.post("/api/events", eventData, config);

      setForm({
        title: "",
        description: "",
        location: "",
        date: "",
        total_seats: 0,
        price: 0,
        img: "",
        category: "",
      });
      setEditing(null);

      const res = await axios.get("/api/events", config);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      total_seats: event.total_seats,
      price: event.price,
      img: event.img || "",
      category: event.category || "",
    });
    setEditing(event.id);
  };

  const handleDelete = async (id) => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    try {
      await axios.delete(`/api/events/${id}`, config);
      const res = await axios.get("/api/events", config);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white p-6">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-8"
      >
        Admin Dashboard
      </motion.h1>

      {/* Form Section */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <PlusCircle /> {editing ? "Update Event" : "Create New Event"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input" required />
          <input name="date" type="datetime-local" value={form.date} onChange={handleChange} className="input" required />
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" className="input" required />
          <input name="total_seats" type="number" value={form.total_seats} onChange={handleChange} placeholder="Total Seats" className="input" required />
          <input name="img" value={form.img} onChange={handleChange} placeholder="Image URL" className="input" />
          <select name="category" value={form.category} className='text-black input' onChange={handleChange} >
            <option value="">Select Category</option>
            {["Concert", "Workshop", "Seminar", "Conference", "Meetup", "Festival", "Sports", "Other"].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="input mt-4 h-24"
          required
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full py-3 bg-yellow-400 text-purple-900 font-bold rounded-xl shadow-lg hover:bg-yellow-300 transition"
        >
          {editing ? "Update Event" : "Create Event"}
        </motion.button>
      </motion.form>

      {/* Event Cards Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-yellow-400/20 transition"
            >
              {event.img && (
                <img
                  src={event.img}
                  alt={event.title}
                  className="rounded-xl w-full h-40 object-cover mb-4"
                />
              )}
              <h3 className="font-bold text-xl">{event.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{event.category}</p>
              <p className="text-sm mb-2">{new Date(event.date).toLocaleString()}</p>
              <p className="text-sm mb-2">Seats: {event.available_seats}/{event.total_seats}</p>
              <p className="text-sm mb-2 font-semibold">₹{event.price}</p>
              <div className="flex justify-between mt-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleEdit(event)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <Edit2 size={16} /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
