import React, { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { CalendarDays, Users, ShieldCheck, Zap, Quote, Music, Briefcase, Palette, Utensils } from "lucide-react";

const EventCard = lazy(() => import("../components/EventCard"));

// 🔄 Simple animated spinner while events load
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16 sm:py-24">
    <motion.div
      className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  </div>
);

const LandingPage = () => {
  // Fetch events using react-query
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      const res = await api.get("/api/events?upcoming=true&limit=3&sort=date");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep cache for 10 minutes
    retry: 1, // Retry once on failure
  });

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

  const categories = [
    {
      icon: Music,
      title: "Concerts",
      desc: "Live music and performances",
      link: "/events/concerts",
    },
    {
      icon: Briefcase,
      title: "Conferences",
      desc: "Professional and industry events",
      link: "/events/conferences",
    },
    {
      icon: Palette,
      title: "Art & Culture",
      desc: "Exhibitions and cultural events",
      link: "/events/art",
    },
    {
      icon: Utensils,
      title: "Food & Drink",
      desc: "Culinary experiences and tastings",
      link: "/events/food",
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
      <section className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 overflow-hidden">
        {/* Background subtle animation for depth */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-100 to-orange-100 opacity-50"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 text-center md:text-left z-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 text-purple-700">
            Discover, Book, and Experience <br />
            <span className="text-orange-500">Unforgettable Events</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            From concerts to conferences, find events that inspire and connect you — all in one place.
          </p>
          <Link
            to="/events"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition inline-block shadow-lg hover:shadow-xl text-base sm:text-lg"
          >
            Explore Events
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="flex-1 flex justify-center z-10"
        >
          <img
            src="https://img.freepik.com/premium-photo/portrait-happy-crowd-enjoying-music-festival_989072-315.jpg"
            alt="Vibrant concert crowd enjoying a live event"
            className="rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl object-cover transform transition-transform duration-500 hover:rotate-1"
            loading="lazy"
          />
        </motion.div>

        {/* Particle animations optimized for mobile */}
        <motion.div
          className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-purple-400 rounded-full filter blur-3xl opacity-20 sm:opacity-30"
          animate={{
            x: [0, 40, 0],
            y: [0, 20, 0],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-28 sm:w-40 h-28 sm:h-40 bg-orange-400 rounded-full filter blur-3xl opacity-20 sm:opacity-30"
          animate={{
            x: [0, -30, 0],
            y: [0, -15, 0],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
        />
      </section>

      {/* ================= EVENT CATEGORIES SECTION ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
            Explore by <span className="text-purple-600">Category</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Find events that match your interests, from music to professional networking.
          </p>
        </div>

        <motion.div
          className="flex overflow-x-auto space-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 max-w-6xl mx-auto pb-4 sm:pb-0 snap-x snap-mandatory"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8 text-center min-w-[260px] sm:min-w-0 snap-center"
            >
              <category.icon className="w-10 sm:w-12 h-10 sm:h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">{category.title}</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-4">{category.desc}</p>
              <Link
                to={category.link}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm sm:text-base transition"
              >
                Explore {category.title}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= UPCOMING EVENTS SECTION ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
            Upcoming <span className="text-purple-600">Events</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Don’t miss what’s happening next — book your tickets today.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 text-base sm:text-lg">{error.message}</div>
        ) : events.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 max-w-6xl mx-auto"
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
          <p className="text-center text-gray-500 text-base sm:text-lg">
            No upcoming events at the moment. Check back soon!
          </p>
        )}

        <div className="text-center mt-10 sm:mt-12">
          <Link
            to="/events"
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition hover:shadow-xl text-base sm:text-lg"
          >
            View All Events
          </Link>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 sm:mb-4">
            Why Choose <span className="text-purple-600">Eventora</span>?
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We make event discovery and booking simple, fast, and secure — built for organizers and attendees alike.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto"
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
              className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8 text-center hover:shadow-2xl transition duration-300"
            >
              <f.icon className="w-10 sm:w-12 h-10 sm:h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">{f.title}</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
            What Our Users <span className="text-purple-600">Say</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Hear from real people who love using Eventora.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md text-center"
            >
              <Quote className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 sm:mb-6 italic text-sm sm:text-base leading-relaxed">"{t.quote}"</p>
              <h4 className="font-semibold text-gray-800 text-base sm:text-lg">{t.author}</h4>
              <p className="text-sm text-gray-500">{t.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-12 sm:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4">
          Stay Updated with the Latest Events
        </h2>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 leading-relaxed max-w-xl mx-auto">
          Join our community and never miss an exciting moment again.
        </p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-0">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-2.5 sm:py-3 rounded-full sm:rounded-l-full sm:rounded-r-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-white text-purple-600 font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full sm:rounded-r-full sm:rounded-l-none hover:bg-gray-100 transition text-sm sm:text-base"
          >
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;