import React, { useEffect, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { CalendarDays, Users, ShieldCheck, Zap, Quote } from "lucide-react";

const EventCard = lazy(() => import("../components/EventCard"));

// 🔄 Simple animated spinner while events load
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <motion.div
      className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  </div>
);

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events");
        const upcoming = res.data
          .filter((e) => new Date(e.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setEvents(upcoming);
      } catch (err) {
        console.error(err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const features = [
    {
      icon: CalendarDays,
      title: "Discover & Book",
      desc: "Find the best events around you and book your seat in seconds.",
    },
    {
      icon: Users,
      title: "Connect & Network",
      desc: "Meet professionals and enthusiasts who share your passion.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Experience",
      desc: "Verified organizers, safe payments, and reliable access.",
    },
    {
      icon: Zap,
      title: "Fast & Simple",
      desc: "Clean design, instant booking, and easy event management.",
    },
  ];

  const testimonials = [
    {
      quote: "Eventora made finding and booking events so easy! I love the seamless experience.",
      author: "Jane Doe",
      role: "Event Enthusiast",
    },
    {
      quote: "As an organizer, the platform is intuitive and helps me reach more people.",
      author: "John Smith",
      role: "Event Organizer",
    },
    {
      quote: "Secure and reliable – I've attended multiple events without any issues.",
      author: "Alex Johnson",
      role: "Professional Networker",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="bg-white text-gray-900 font-sans overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-purple-700">
            Discover, Book, and Experience <br />
            <span className="text-orange-500">Unforgettable Events</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            From concerts to conferences, find events that inspire and connect
            you — all in one place.
          </p>
          <Link
            to="/events"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full transition inline-block shadow-lg hover:shadow-xl"
          >
            Explore Events
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex-1 flex justify-center"
        >
          <img
            src="https://img.freepik.com/premium-photo/portrait-happy-crowd-enjoying-music-festival_989072-315.jpg"
            alt="Vibrant concert crowd enjoying a live event"
            className="rounded-3xl shadow-2xl max-w-md w-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </section>

       {/* ================= UPCOMING EVENTS SECTION ================= */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
            Upcoming <span className="text-purple-600">Events</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Don’t miss what’s happening next — book your tickets today.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : events.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Suspense fallback={<LoadingSpinner />}>
                  <EventCard event={event} />
                </Suspense>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No upcoming events at the moment. Check back soon!
          </p>
        )}

        <div className="text-center mt-12">
          <Link
            to="/events"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition hover:shadow-xl"
          >
            View All Events
          </Link>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Why Choose <span className="text-purple-600">Eventora</span>?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We make event discovery and booking simple, fast, and secure — built
            for organizers and attendees alike.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl transition duration-300"
            >
              <f.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {f.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
            What Our Users <span className="text-purple-600">Say</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Hear from real people who love using Eventora.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-gray-50 p-8 rounded-2xl shadow-md text-center"
            >
              <Quote className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-6 italic leading-relaxed">"{t.quote}"</p>
              <h4 className="font-semibold text-gray-800">{t.author}</h4>
              <p className="text-sm text-gray-500">{t.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

     

      {/* ================= NEWSLETTER ================= */}
      <section className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Stay Updated with the Latest Events
        </h2>
        <p className="text-lg mb-8 opacity-90 leading-relaxed">
          Join our community and never miss an exciting moment again.
        </p>
        <form className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-3 rounded-l-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition"
          />
          <button
            type="submit"
            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-r-full hover:bg-gray-100 transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default LandingPage;