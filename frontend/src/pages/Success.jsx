import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { useParams, useLocation } from "react-router-dom";
import { Download, CheckCircle, Ticket, Loader } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../utils/api";

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

      const token = localStorage.getItem("token");
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

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `E-Ticket_${bookingDetails.event.title.replace(/\s/g, "_")}_${bookingDetails.id}.pdf`
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
      <div className="bg-gradient-to-br from-purple-100 via-white to-pink-100 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-purple-500" />
        </motion.div>
        <p className="mt-4 text-lg text-gray-600 font-medium">
          Loading your booking details...
        </p>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-900 bg-gradient-to-br from-red-50 to-white p-4">
        <p className="text-3xl text-red-500 mb-2 font-bold">Oops!</p>
        <p className="text-lg text-gray-600">{error || "Booking not found."}</p>
      </div>
    );
  }

  const totalAmount = bookingDetails.quantity * bookingDetails.event.price;
  const qrValue = `BookingID:${bookingDetails.id}|Event:${bookingDetails.event.title}|Qty:${bookingDetails.quantity}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 text-gray-900 py-12 px-4 font-sans relative overflow-hidden">
      <Confetti recycle={false} numberOfPieces={180} gravity={0.2} />

      <motion.div
        ref={ticketRef}
        className="max-w-2xl mx-auto p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3 drop-shadow-md" />
          <h1 className="text-4xl font-bold text-purple-700">
            Booking Confirmed 🎉
          </h1>
          <p className="text-gray-600 mt-2">
            Your e-ticket is ready! Check below for event details.
          </p>
        </motion.div>

        <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-inner">
          <h2 className="text-xl font-semibold text-purple-600 flex items-center gap-2 mb-3">
            <Ticket /> Ticket Information
          </h2>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
            <p><strong>Event:</strong> {bookingDetails.event.title}</p>
            <p><strong>Date:</strong> {new Date(bookingDetails.event.date).toLocaleString()}</p>
            <p><strong>Tickets:</strong> {bookingDetails.quantity}</p>
            <p className="font-semibold text-green-600 text-lg col-span-2 border-t pt-3 mt-2">
              Total Paid: ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 mb-3">Scan for quick event entry</p>
          <QRCodeCanvas
            value={qrValue}
            size={200}
            level="H"
            className="mx-auto border-4 border-purple-100 rounded-2xl bg-white shadow-lg p-3"
          />
        </div>

        <p className="text-center text-gray-500 mt-8 italic">
          Thank you for booking with us — we cant wait to see you at the event!
        </p>
      </motion.div>

      <motion.button
        onClick={handleDownloadPDF}
        disabled={pdfLoading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={` w-full max-w-2xl mx-auto mt-10 py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
          pdfLoading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:shadow-xl"
        }`}
      >
        {pdfLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" /> Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" /> Download Ticket PDF
          </>
        )}
      </motion.button>
    </div>
  );
};

export default Success;
