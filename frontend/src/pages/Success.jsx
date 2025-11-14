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
  const { state } = useLocation();
  const ticketRef = useRef(null);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState(null);

  const successRedirect = state?.success;

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("Invalid booking ID.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view booking details.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // PDF Download
  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setPdfLoading(true);

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`E-Ticket_${booking?.event?.title.replace(/\s/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF error:", error);
      alert("Unable to generate PDF. Please try again!");
    }

    setPdfLoading(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-purple-500" />
        </motion.div>
        <p className="mt-4 text-lg text-gray-600 font-medium">
          Fetching booking details…
        </p>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
        <p className="text-3xl text-red-600 font-bold">Oops!</p>
        <p className="text-gray-600 mt-2">{error || "Booking not found."}</p>
      </div>
    );
  }

  const totalAmount = booking.quantity * booking.event.price;
  const qrValue = `BookingID:${booking.id}|Event:${booking.event.title}|Qty:${booking.quantity}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6 relative overflow-hidden">
      {successRedirect && <Confetti recycle={false} numberOfPieces={200} gravity={0.2} />}

      {/* TICKET CARD */}
      <motion.div
        ref={ticketRef}
        className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
          <h1 className="text-4xl font-bold text-purple-700">
            Booking Confirmed 🎉
          </h1>
          <p className="text-gray-600 mt-2">
            Your e-ticket is ready! See the details below.
          </p>
        </motion.div>

        {/* Ticket info */}
        <div className="mt-8 bg-white rounded-2xl p-6 border shadow-inner">
          <h2 className="text-xl font-semibold text-purple-600 flex items-center gap-2 mb-4">
            <Ticket /> Ticket Information
          </h2>

          <div className="grid grid-cols-2 gap-y-3 text-gray-700 text-sm">
            <p><strong>Event:</strong> {booking.event.title}</p>
            <p><strong>Date:</strong> {new Date(booking.event.date).toLocaleString()}</p>
            <p><strong>Tickets:</strong> {booking.quantity}</p>

            <p className="col-span-2 text-lg text-green-600 font-bold border-t pt-3">
              Total Paid: ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center mt-8">
          <p className="text-gray-500 mb-2">Scan for entry verification</p>
          <QRCodeCanvas
            value={qrValue}
            size={210}
            level="H"
            className="mx-auto bg-white p-4 rounded-xl shadow-md border border-purple-100"
          />
        </div>

        <p className="text-center text-gray-500 mt-8 italic">
          Thank you for booking — see you at the event!
        </p>
      </motion.div>

      {/* PDF DOWNLOAD BUTTON */}
      <motion.button
        onClick={handleDownloadPDF}
        disabled={pdfLoading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full max-w-2xl mx-auto mt-10 py-3 font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all
        ${pdfLoading
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"}`}
      >
        {pdfLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" /> Creating PDF…
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
