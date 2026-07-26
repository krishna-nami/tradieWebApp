import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  acceptBookingController,
  createBookingController,
  getBookingByIdController,
  listbookingsController,
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
export default bookingRoutes;
