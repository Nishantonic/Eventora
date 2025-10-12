import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "../components/EventCard";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import api from "../utils/api";

const eventGridVariants = {
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

// ✨ Purple Loading Spinner
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white text-purple-600">
    <motion.div
      className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    />
    <p className="mt-6 text-xl tracking-wide text-gray-600">Loading Events...</p>
  </div>
);

const dummyPastEvents = [
  {
    id: "past1",
    title: "Epic Rock Concert",
    date: "2025-09-15T20:00:00",
    location: "City Arena",
    description: "An unforgettable night of rock music with top bands performing live. The crowd was electric, and the light show was spectacular.",
    img: "https://media.istockphoto.com/id/1461816749/photo/a-crowd-of-people-with-raised-arms-during-a-music-concert-with-an-amazing-light-show-black.jpg?s=612x612&w=0&k=20&c=-hdWCLDP5AI9A3mjq3JPMPKhXxJ2P1iItPDFktQHxX8=",
    price: 1500,
    total_seats: 5000,
    available_seats: 0,
  },
  {
    id: "past2",
    title: "Tech Innovation Conference",
    date: "2025-08-20T09:00:00",
    location: "Convention Center",
    description: "Exploring the latest in technology and innovation with keynote speakers from leading companies. Attendees networked and learned about cutting-edge developments.",
    img: "https://orlandosydney.com/wp-content/uploads/2023/08/Conference-at-Darling-Harbour-Theatre-Interior-Photo%C2%B7-ICC-Sydney.-2500-seated-capacity.-Photography-By-orlandosydney.com-OS1_7156.jpg",
    price: 2000,
    total_seats: 1000,
    available_seats: 0,
  },
  {
    id: "past3",
    title: "Creative Art Workshop",
    date: "2025-07-10T14:00:00",
    location: "Art Studio",
    description: "Hands-on art sessions for all skill levels, where participants created abstract paintings and explored various techniques.",
    img: "https://blog.artweb.com/wp-content/uploads/2023/03/Artclasses.jpeg",
    price: 500,
    total_seats: 50,
    available_seats: 0,
  },
];

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events");
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
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  let pastEvents = events
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (pastEvents.length === 0) {
    pastEvents = dummyPastEvents;
  }

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-500 bg-white min-h-screen">
        {error}
      </div>
    );

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans p-6 md:p-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl font-extrabold text-center mb-12 text-purple-600"
      >
        All Events
      </motion.h1>

      {/* Events Tabs */}
      <Tabs className="max-w-7xl mx-auto">
        <TabList className="flex border-b border-gray-200 mb-8">
          <Tab
            className="p-3 cursor-pointer text-xl font-semibold transition duration-300 hover:text-purple-600"
            selectedClassName="border-b-4 border-purple-600 text-purple-600"
          >
            Upcoming Events ({upcomingEvents.length})
          </Tab>
          <Tab
            className="p-3 cursor-pointer text-xl font-semibold transition duration-300 hover:text-purple-600 ml-6"
            selectedClassName="border-b-4 border-purple-600 text-purple-600"
          >
            Past Event Highlights ({pastEvents.length})
          </Tab>
        </TabList>

        {/* Upcoming Events */}
        <TabPanel>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={eventGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 text-lg">
                  No upcoming events right now. Stay tuned for new announcements!
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </TabPanel>

        {/* Past Events */}
        <TabPanel>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={eventGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {pastEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EventCard event={{ ...event, isPast: true }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default EventPage;