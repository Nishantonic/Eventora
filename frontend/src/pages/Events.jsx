// src/pages/Events.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "../components/EventCard";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Minimal default styling for tabs
import { Lock, CreditCard, ArrowRight, TrendingUp, Calendar, Zap, MessageCircle } from "lucide-react";

// Framer Motion variants
const eventGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= now);
  const pastEvents = events.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort past events by date descending

  if (loading) return <div className="text-center py-20 text-xl text-white bg-black min-h-screen">Loading Events...</div>;
  if (error) return <div className="text-center py-20 text-xl text-red-500 bg-black min-h-screen">{error}</div>;

  return (
    <div className="bg-black text-white min-h-screen font-sans p-6 md:p-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-center mb-12 text-purple-400"
      >
        All Events
      </motion.h1>

   
      {/* Events Tabs */}
      <Tabs className="max-w-7xl mx-auto">
        <TabList className="flex border-b border-gray-700 mb-8">
          <Tab
            className="p-3 cursor-pointer text-xl font-semibold transition duration-300 hover:text-purple-400"
            selectedClassName="border-b-4 border-purple-400 text-purple-400"
          >
            Upcoming Events ({upcomingEvents.length})
          </Tab>
          <Tab
            className="p-3 cursor-pointer text-xl font-semibold transition duration-300 hover:text-purple-400 ml-6"
            selectedClassName="border-b-4 border-purple-400 text-purple-400"
          >
            Past Event Highlights ({pastEvents.length})
          </Tab>
        </TabList>

        <TabPanel>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={eventGridVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <motion.div key={event.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <EventCard event={event} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-400 text-lg">
                  No upcoming events right now. Stay tuned for new announcements!
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </TabPanel>

        <TabPanel>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={eventGridVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {pastEvents.length > 0 ? (
                pastEvents.map(event => (
                  <motion.div key={event.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <EventCard event={{ ...event, isPast: true }} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-400 text-lg">
                  No past events to highlight yet.
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </TabPanel>
      </Tabs>

        

    </div>
  );
};

export default EventPage;