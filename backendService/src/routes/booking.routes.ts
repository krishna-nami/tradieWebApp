import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  createBookingController,
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
export default bookingRoutes;
