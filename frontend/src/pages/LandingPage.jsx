import React, { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Zap, ShieldCheck } from "lucide-react";
import api from "../utils/api";

// Lazy load EventCard
const EventCard = lazy(() => import("../components/EventCard"));

// Optimized compressed background images
const bgImages = [
  "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=60",
  "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1600&q=60",
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const topSpeakers = [
  { name: "Priya Sharma", role: "AI Ethicist", img: "https://randomuser.me/api/portraits/women/11.jpg" },
  { name: "Rajesh Kumar", role: "Venture Capitalist", img: "https://randomuser.me/api/portraits/men/12.jpg" },
  { name: "Anjali Menon", role: "Tech Pioneer", img: "https://randomuser.me/api/portraits/women/13.jpg" },
  { name: "Sandeep Verma", role: "E-commerce Founder", img: "https://randomuser.me/api/portraits/men/14.jpg" },
  { name: "Kavita Singh", role: "Climate Activist", img: "https://randomuser.me/api/portraits/women/15.jpg" },
  { name: "Vikram Bose", role: "Space Scientist", img: "https://randomuser.me/api/portraits/men/16.jpg" },
];

const SpeakerTicker = () => (
  <div className="overflow-hidden py-12 bg-gray-800/50 border-y border-purple-800/50">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-yellow-400">🔥 Top Speakers</h2>
      <p className="text-gray-400">Meet the visionaries leading the conversation.</p>
    </div>
    <div className="max-w-7xl mx-auto">
      <motion.div
        className="flex w-fit"
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
      >
        {[...topSpeakers, ...topSpeakers].map((s, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 mx-4 p-4 bg-gray-900 rounded-xl shadow-xl text-center border border-purple-800/50 hover:scale-105 transition"
          >
            <img
              src={s.img}
              alt={s.name}
              className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-purple-500 hover:border-yellow-400 transition"
              loading="lazy"
            />
            <h3 className="text-lg font-semibold text-white">{s.name}</h3>
            <p className="text-sm text-purple-300">{s.role}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

const EventSkeleton = () => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
    <div className="h-48 bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-700 rounded w-full" />
    </div>
  </div>
);

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Smooth hero background image transition
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImageIndex((i) => (i + 1) % bgImages.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  // Optimized event fetching with cache
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const cached = localStorage.getItem("events");
        if (cached) {
          setEvents(JSON.parse(cached));
          setIsLoading(false);
        }

        const res = await api.get("/api/events", { timeout: 5000 });
        const upcoming = res.data
          .filter((e) => new Date(e.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);

        setEvents(upcoming);
        localStorage.setItem("events", JSON.stringify(upcoming));
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const features = [
    { icon: Award, title: "Curated Events", description: "Hand-picked, high-quality experiences you won't find anywhere else." },
    { icon: Zap, title: "Lightning Fast Booking", description: "Secure your spot in seconds with a smooth, optimized checkout." },
    { icon: ShieldCheck, title: "Verified Tickets", description: "All tickets are verified for your peace of mind." },
  ];

  return (
    <div className="bg-black text-white font-sans">
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
            style={{
              backgroundImage: `url(${bgImages[currentImageIndex]})`,
              transform: "scale(1.05)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center p-6">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg"
          >
            Your Next Adventure Awaits
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-2xl mx-auto"
          >
            Discover the best events, book effortlessly, and make memories that last.
          </motion.p>
          <Link
            to="/events"
            className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full text-xl shadow-lg hover:bg-yellow-300 transform hover:scale-105 transition"
          >
            Find Events
          </Link>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="py-16 bg-gray-900 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-10 text-purple-400"
        >
          🔥 Featured Upcoming Events
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {isLoading ? (
            <>
              <EventSkeleton /> <EventSkeleton /> <EventSkeleton />
            </>
          ) : error ? (
            <div className="md:col-span-3 text-center text-red-400">{error}</div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Suspense fallback={<EventSkeleton />}>
                  <EventCard event={event} />
                </Suspense>
              </motion.div>
            ))
          ) : (
            <div className="md:col-span-3 text-center text-gray-400">
              No upcoming events right now. Check back soon!
            </div>
          )}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            to="/events"
            className="text-purple-400 hover:text-purple-300 font-semibold border-b-2 border-purple-400 pb-1 transition"
          >
            View All Events →
          </Link>
        </div>
      </section>

      {/* SPEAKER TICKER */}
      <SpeakerTicker />

      {/* FEATURES */}
      <section className="py-20 bg-black px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center text-yellow-400 mb-16"
        >
          Why Choose Us?
        </motion.h2>

        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-8 bg-gray-900 rounded-xl shadow-2xl text-center hover:scale-105 transition border border-purple-800/50"
            >
              <f.icon className="w-10 h-10 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-400">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 bg-purple-900/20 text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-gray-300 mb-8">
          Subscribe to our newsletter for the latest events and offers.
        </p>
        <form className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-3 bg-gray-800 border border-purple-800 rounded-l-full text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-r-full hover:bg-yellow-300 transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default LandingPage;
