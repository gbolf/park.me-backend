import express from "express";
import {
  createBooking,
  getUserBookings,
  getBookingsForOwnedParkings,
  updateBookingStatus,
} from "../controllers/booking.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.use(requireAuth);

router.post("/", createBooking);

router.get("/user", getUserBookings);

router.get("/owner", getBookingsForOwnedParkings);

router.put("/:bookingId/status", updateBookingStatus);

export default router;
