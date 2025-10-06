// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookings,
  cancelBooking,
  getBookingById
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, admin, getBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id", protect, getBookingById); 


export default router;