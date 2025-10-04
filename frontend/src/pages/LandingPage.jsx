// src/pages/LandingPage.jsx - Optimized with more responsive classes and similar structure
import React from 'react';
import { Parallax } from 'react-parallax';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';

// Replace with actual background image
const bgImage = 'https://example.com/conference-bg.jpg';

const LandingPage = () => {
  return (
    <Parallax bgImage={bgImage} strength={300} className="min-h-screen">
      <div className="bg-purple-800 bg-opacity-80 text-white">
        <div className="container mx-auto p-4 md:p-8">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold text-center pt-8 md:pt-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Smart Event Booking
          </motion.h1>
          <p className="text-center text-lg md:text-xl mt-4">Join the ultimate event experience</p>
          <div className="text-center mt-6 md:mt-8">
            <Link to="/events" className="bg-yellow-400 text-purple-900 px-4 py-2 md:px-6 md:py-3 rounded-full font-bold">Browse Events</Link>
          </div>
          {/* Speakers section */}
          <section className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Featured Speakers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-8">
              <motion.div className="bg-yellow-300 p-4 rounded-lg text-center text-purple-900" whileHover={{ scale: 1.05 }}>
                <img src="https://example.com/speaker1.jpg" alt="Speaker 1" className="mx-auto rounded-full w-24 h-24 md:w-32 md:h-32 object-cover" />
                <p className="mt-2 font-semibold">Speaker 1</p>
                <p>Head of Design</p>
              </motion.div>
              {/* Repeat for 3 more speakers */}
              <motion.div className="bg-yellow-300 p-4 rounded-lg text-center text-purple-900" whileHover={{ scale: 1.05 }}>
                <img src="https://example.com/speaker2.jpg" alt="Speaker 2" className="mx-auto rounded-full w-24 h-24 md:w-32 md:h-32 object-cover" />
                <p className="mt-2 font-semibold">Speaker 2</p>
                <p>CTO</p>
              </motion.div>
              <motion.div className="bg-yellow-300 p-4 rounded-lg text-center text-purple-900" whileHover={{ scale: 1.05 }}>
                <img src="https://example.com/speaker3.jpg" alt="Speaker 3" className="mx-auto rounded-full w-24 h-24 md:w-32 md:h-32 object-cover" />
                <p className="mt-2 font-semibold">Speaker 3</p>
                <p>Marketing Expert</p>
              </motion.div>
              <motion.div className="bg-yellow-300 p-4 rounded-lg text-center text-purple-900" whileHover={{ scale: 1.05 }}>
                <img src="https://example.com/speaker4.jpg" alt="Speaker 4" className="mx-auto rounded-full w-24 h-24 md:w-32 md:h-32 object-cover" />
                <p className="mt-2 font-semibold">Speaker 4</p>
                <p>Innovator</p>
              </motion.div>
            </div>
          </section>
          {/* About section */}
          <section className="mt-12 md:mt-16 bg-black p-6 md:p-8 rounded-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-center">About Us</h2>
            <p className="mt-4 text-center">Smart Event Booking is your go-to platform for discovering and booking exciting events.</p>
            <div className="flex justify-center mt-6">
              <Countdown targetDate="2025-08-13" />
            </div>
            <div className="text-center mt-6">
              <Link to="/events" className="bg-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full inline-block">Buy Ticket</Link>
            </div>
          </section>
        </div>
      </div>
    </Parallax>
  );
};

export default LandingPage;