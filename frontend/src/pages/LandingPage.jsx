import React, { useState, useEffect } from "react";
import { Parallax } from "react-parallax";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Countdown from "../components/Countdown";
import axios from "axios";
import EventCard from "../components/EventCard";
import { Award, Zap, ShieldCheck } from "lucide-react"; // New icons for features

const bgImages = [
  "https://images.unsplash.com/photo-1522199710521-72d69614c702?fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?fit=crop&w=1920&q=80",
  "https://media.sciencephoto.com/f0/32/90/55/f0329055-800px-wm.jpg",
  "https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg?s=612x612&w=0&k=20&c=gWTTDs_Hl6AEGOunoQ2LsjrcTJkknf9G8BGqsywyEtE=",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const topSpeakers = [
  {
    name: "Priya Sharma",
    role: "AI Ethicist",
    img: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    name: "Rajesh Kumar",
    role: "Venture Capitalist",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Anjali Menon",
    role: "Tech Pioneer",
    img: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    name: "Sandeep Verma",
    role: "E-commerce Founder",
    img: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    name: "Kavita Singh",
    role: "Climate Activist",
    img: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    name: "Vikram Bose",
    role: "Space Scientist",
    img: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    name: "Neha Patel",
    role: "FinTech Expert",
    img: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    name: "Arjun Singh",
    role: "Digital Strategist",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
  },
];

const SpeakerTicker = () => (
  <div className="overflow-hidden py-12 bg-gray-800/50 border-y border-purple-800/50">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-yellow-400">
        🔥 Top Speakers at Indian Events
      </h2>
      <p className="text-gray-400">
        Meet the visionaries who lead the conversation.
      </p>
    </div>
    <div className="max-w-7xl mx-auto">
      <motion.div
        className="flex w-fit"
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 40,
        }}
      >
        {[...topSpeakers, ...topSpeakers].map((speaker, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 mx-4 p-4 bg-gray-900 rounded-xl shadow-2xl text-center border border-purple-800/50 transform hover:scale-[1.03] transition duration-300 cursor-pointer"
          >
            <img
              src={speaker.img}
              alt={speaker.name}
              className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-purple-500 hover:border-yellow-400 transition"
            />
            <h3 className="text-lg font-semibold text-white">{speaker.name}</h3>
            <p className="text-sm text-purple-300">{speaker.role}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

const LandingPage = () => {
  const [events, setEvents] = useState([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 4000);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
const res = axios.get(`${BASE_URL}/api/events`);
        const upcomingEvents = res.data
          .filter((e) => new Date(e.date) >= new Date())
          .slice(0, 3);
        setEvents(upcomingEvents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const features = [
    {
      icon: Award,
      title: "Curated Events",
      description:
        "Hand-picked, high-quality experiences you won't find anywhere else.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Booking",
      description:
        "Secure your spot in seconds with our optimized and smooth checkout process.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Tickets",
      description:
        "All tickets are officially verified, giving you peace of mind for every event.",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="relative h-screen overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgImages[currentImageIndex]})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="bg-gradient-to-b from-purple-900/80 via-purple-800/60 to-black/90 h-full flex items-center justify-center">
              <div className="text-center p-6 z-10">
                <motion.h1
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg"
                >
                  Your Next Adventure Awaits
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-2xl mx-auto"
                >
                  Discover the best events, book your tickets effortlessly, and
                  make memories.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <Link
                    to="/events"
                    className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full text-xl shadow-2xl hover:bg-yellow-300 transition duration-300 transform hover:scale-105"
                  >
                    Find Events Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

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
          viewport={{ once: true, amount: 0.2 }}
        >
          {events.length > 0 ? (
            events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <EventCard event={event} />
              </motion.div>
            ))
          ) : (
            <div className="md:col-span-3 text-center text-gray-400">
              No upcoming events to feature right now. Check back soon!
            </div>
          )}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            to="/events"
            className="text-purple-400 hover:text-purple-300 font-semibold border-b-2 border-purple-400 pb-1 transition duration-300"
          >
            View All Events &rarr;
          </Link>
        </div>
      </section>

      <SpeakerTicker />

      <hr className="border-gray-800" />

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
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 bg-gray-900 rounded-xl shadow-2xl text-center transform hover:scale-[1.03] transition duration-300 border border-purple-800/50"
            >
              <feature.icon className="w-10 h-10 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-16 bg-purple-900/20 text-center px-6"></section>
    </div>
  );
};

export default LandingPage;
