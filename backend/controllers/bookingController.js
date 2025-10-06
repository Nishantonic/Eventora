// controllers/bookingController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  const { event_id, quantity, mobile } = req.body;
  if (!event_id || !quantity) return res.status(400).json({ msg: "Missing fields" });

  try {
    const event = await prisma.event.findUnique({ where: { id: event_id } });
    if (!event) return res.status(404).json({ msg: "Event not found" });
    if (event.available_seats < quantity) return res.status(400).json({ msg: "Not enough seats" });

    const total_amount = quantity * Number(event.price);

    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.create({
        data: {
          user_id: req.user.id,
          event_id,
          name: req.user.name,
          email: req.user.email,
          mobile: mobile || null,
          quantity,
          total_amount,
          booking_date: new Date(),
          status: "confirmed",
        },
      });
      await tx.event.update({
        where: { id: event_id },
        data: { available_seats: event.available_seats - quantity },
      });
      return b;
    });

    // Emit real-time update if socket is set up
    const io = req.app.get("io");
    if (io) {
      io.emit("seatUpdate", { eventId: event_id, availableSeats: event.available_seats - quantity });
    }

    res.json(booking);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { user_id: req.user.id },
      include: { event: true },
    });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { event: true, user: true },
    });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    if (booking.user_id !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ msg: "Not authorized" });
    if (booking.status === "cancelled") return res.status(400).json({ msg: "Already cancelled" });

    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.booking.update({
        where: { id: booking.id },
        data: { status: "cancelled" },
      });
      const updatedEvent = await tx.event.update({
        where: { id: booking.event_id },
        data: { available_seats: { increment: booking.quantity } },
      });
      return { u, updatedEvent };
    });

    // Emit real-time update if socket is set up
    const io = req.app.get("io");
    if (io) {
      io.emit("seatUpdate", { eventId: booking.event_id, availableSeats: updated.updatedEvent.available_seats });
    }

    res.json(updated.u);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;
  
  // NOTE: In a real application, you must verify the user (req.user.id)
  // owns this booking before returning the data.
  // We rely on the `protect` middleware for authentication.

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      // Crucial: Include the associated event details
      include: {
        event: true, 
      },
    });

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Optional: Add user ownership check here (e.g., if booking.userId !== req.user.id throw 403)
    
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking by ID:", error.message);
    res.status(500).json({ msg: "Internal server error." });
  }
};