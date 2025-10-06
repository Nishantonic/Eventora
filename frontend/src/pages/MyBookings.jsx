import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Ticket, Calendar, Users, Loader, Download } from "lucide-react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get("/api/bookings/my", config);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-purple-500" />
        </motion.div>
        <p className="mt-4 text-xl text-gray-400">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/80 to-black flex flex-col items-center justify-center text-white">
        <Ticket className="w-16 h-16 text-gray-500 mb-4" />
        <p className="text-xl text-gray-400">You haven’t booked any events yet.</p>
        <Link
          to="/events"
          className="mt-6 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/80 to-black text-white py-12 px-6 font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-yellow-400">
        My Bookings
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {bookings.map((booking) => {
          const totalAmount = booking.quantity * booking.event.price;
          return (
            <motion.div
              key={booking.id}
              className="bg-gray-900/90 rounded-2xl shadow-lg p-6 border border-purple-600/40 flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >
              <h2 className="text-2xl font-bold text-purple-300 mb-3">
                {booking.event.title}
              </h2>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  {new Date(booking.event.date).toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  Tickets: {booking.quantity}
                </p>
                <p className="font-semibold text-green-400">
                  Paid: ₹{totalAmount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/success/${booking.id}`}
                  className="flex-1 py-2 rounded-lg font-semibold text-center bg-purple-600 hover:bg-purple-500 transition"
                >
                  View Ticket
                </Link>
               
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
