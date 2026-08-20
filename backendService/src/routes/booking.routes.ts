import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  acceptBookingController,
  cancelBookingController,
  completeBookingController,
  createBookingController,
  declineBookingController,
  getBookingByIdController,
  listbookingsController,
  startBookingController,
} from "../controllers/booking.controller.js";

const bookingRoutes = Router();

bookingRoutes.post(
  "/create-booking",
  requireAuth,
  requireRole("CUSTOMER"),
  createBookingController,
);
bookingRoutes.get(
  "/allBookings",
  requireAuth,
  requireRole("CUSTOMER", "TRADIE"),
  listbookingsController,
);

//dynamic routes only

bookingRoutes.get(
  "/bookings/:id",
  requireAuth,
  requireRole("CUSTOMER", "TRADIE"),
  getBookingByIdController,
);
bookingRoutes.put(
  "/bookings/:id/accept",
  requireAuth,
  requireRole("TRADIE"),
  acceptBookingController,
);
bookingRoutes.put(
  "/bookings/:id/decline",
  requireAuth,
  requireRole("TRADIE"),
  declineBookingController,
);
bookingRoutes.put(
  "/bookings/:id/cancel",
  requireAuth,
  requireRole("TRADIE", "CUSTOMER"),
  cancelBookingController,
);
bookingRoutes.put(
  "/bookings/:id/complete",
  requireAuth,
  requireRole("TRADIE"),
  completeBookingController,
);

bookingRoutes.put(
  "/bookings/:id/start",
  requireAuth,
  requireRole("TRADIE"),
  startBookingController,
);

export default bookingRoutes;
