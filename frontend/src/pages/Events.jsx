// src/pages/LandingPage.jsx
import React from "react";
import { Parallax } from "react-parallax";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Countdown from "../components/Countdown";

const bgImage =
  "https://images.unsplash.com/photo-1522199710521-72d69614c702?fit=crop&w=1920&q=80"; // 🎨 replace with your background

const LandingPage = () => {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Hero Section */}
      <Parallax bgImage={bgImage} strength={400}>
        <div className="bg-gradient-to-b from-purple-900/70 via-purple-800/80 to-black/90 min-h-screen flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Transform the Way You Experience Events
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-xl mt-4 text-gray-200 max-w-2xl"
          >
            Discover, Book, and Join unforgettable moments — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/events"
              className="bg-yellow-400 text-purple-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition"
            >
              Browse Events
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-full hover:bg-yellow-400 hover:text-purple-900 transition"
            >
              Join Us
            </Link>
          </motion.div>
        </div>
      </Parallax>

      {/* Featured Speakers */}
      <section className="py-16 bg-gradient-to-b from-black to-purple-950 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-yellow-400"
        >
          Featured Speakers
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Alex Carter", role: "Head of Design" },
            { name: "Maria Lopez", role: "CTO" },
            { name: "John Smith", role: "Marketing Guru" },
            { name: "Nina Kim", role: "Innovator" },
          ].map((spk, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-yellow-400/90 text-purple-900 p-6 rounded-2xl shadow-lg text-center"
            >
              <img
                src={`https://randomuser.me/api/portraits/${
                  i % 2 === 0 ? "men" : "women"
                }/${i + 30}.jpg`}
                alt={spk.name}
                className="w-28 h-28 object-cover rounded-full mx-auto mb-4 border-4 border-purple-900"
              />
              <h3 className="font-bold text-lg">{spk.name}</h3>
              <p className="text-sm opacity-80">{spk.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-black text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-yellow-400"
        >
          About Smart Event Booking
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto mt-6 text-gray-300"
        >
          We are redefining the way you discover, plan, and enjoy events. Our
          platform brings you curated experiences, exclusive speakers, and
          seamless ticketing — all with a touch of innovation and creativity.
        </motion.p>

        <div className="mt-10 flex justify-center">
          <Countdown targetDate="2025-08-13" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <Link
            to="/tickets"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Buy Ticket
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
