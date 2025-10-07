import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Download, CheckCircle, Ticket, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../utils/api';
const Success = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const ticketRef = useRef(null); 

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSuccessRedirect = location.state?.success;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!bookingId) {
        setError("Invalid booking ID.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required to view booking details.");
        setLoading(false);
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await api.get(`/api/bookings/${bookingId}`, config); 
        setBookingDetails(res.data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err.response?.data?.msg || "Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bookingId]);

  const handleDownloadPDF = async () => {
    if (!bookingDetails || loading) return;
    const input = ticketRef.current;
    if (!input) return;

    setPdfLoading(true);

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(
        `E-Ticket_${bookingDetails.event.title.replace(/\s/g, '_')}_${bookingDetails.id}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading && !bookingDetails) {
    return (
      <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-purple-500" />
        </motion.div>
        <p className="mt-4 text-xl text-gray-400">Loading Booking Details...</p>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-black via-purple-900/80 to-black p-4">
        <p className="text-2xl text-red-500 mb-4">Error</p>
        <p className="text-lg text-gray-400">{error || "Booking details not found."}</p>
      </div>
    );
  }

  const totalAmount = bookingDetails.quantity * bookingDetails.event.price;
  const qrValue = `BookingID:${bookingDetails.id}|Event:${bookingDetails.event.title}|Qty:${bookingDetails.quantity}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/80 to-black text-white py-12 px-4 font-sans relative overflow-hidden">
      
      <Confetti   />

      <motion.div
        ref={ticketRef}
        className="max-w-xl mx-auto p-8 bg-purple-900/90 rounded-2xl shadow-2xl border-t-8 border-green-500"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-center mb-3 ">
          Booking Successful!
        </h1>
        <p className="text-lg text-gray-300 text-center mb-8">
          Your e-ticket confirmation is ready.
        </p>

        <div className="space-y-3 p-4 bg-gray-800/70 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
            <Ticket /> E-Ticket Details
          </h2>
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-white">Event:</span> {bookingDetails.event.title}
          </p>
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-white">Date:</span>{" "}
            {new Date(bookingDetails.event.date).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-white">Tickets:</span>{" "}
            {bookingDetails.quantity}
          </p>
          <p className="text-lg font-bold text-green-400 border-t border-gray-600 pt-3">
            Total Paid: ₹{totalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-300 mb-4">Scan this code for quick entry:</p>
          <QRCodeCanvas
            value={qrValue}
            size={200}
            level="H"
            className="mx-auto border-4 border-white rounded-lg shadow-xl"
          />
        </div>

        <p className="text-center text-lg italic text-gray-400 mt-6">
          "Thank you for choosing us! We look forward to seeing you at the event."
        </p>
      </motion.div>

      <motion.button
        onClick={handleDownloadPDF}
        disabled={pdfLoading}
        className={`w-full max-w-xl mx-auto  mt-8 py-3 rounded-lg font-bold text-lg transition duration-300 flex items-center justify-center gap-2 shadow-lg ${
          pdfLoading
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-500 text-white"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {pdfLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" /> Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" /> Download PDF Ticket
          </>
        )}
      </motion.button>
    </div>
  );
};

export default Success;
