// src/pages/Success.jsx
import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import {QRCodeCanvas}  from 'qrcode.react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const Success = () => {
  const { bookingId } = useParams();

  useEffect(() => {
    // Logic to fetch booking details if needed
  }, [bookingId]);

  return (
    <div className="container mx-auto p-4 text-center">
      <Confetti />
      <motion.h1 
        className="text-3xl font-bold"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Booking Successful!
      </motion.h1>
      <p>Your ticket QR Code:</p>
      <QRCodeCanvas  value={`booking-${bookingId}`} className="mx-auto mt-4" />
      <a href={`data:image/png;base64,...`} download="ticket.png" className="block mt-4">Download QR</a>
    </div>
  );
};

export default Success;