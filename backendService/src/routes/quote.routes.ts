import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  acceptQuoteController,
  createQuoteController,
  declineQuoteController,
  sendQuoteController,
  updateQuotecontroller,
} from "../controllers/quote.controller.js";

const quoteRoutes = Router();

//Dynamics Routes Only

quoteRoutes.post(
  "/bookings/:id/quote",
  requireAuth,
  requireRole("TRADIE"), // ← blocks CUSTOMER entirely, 403 before even reaching the controller
  createQuoteController,
);
quoteRoutes.put(
  "/quotes/:id",
  requireAuth,
  requireRole("TRADIE"),
  updateQuotecontroller,
);

quoteRoutes.put(
  "/quotes/:id/send",
  requireAuth,
  requireRole("TRADIE"),
  sendQuoteController,
);
quoteRoutes.put(
  "/quotes/:id/accept",
  requireAuth,
  requireRole("CUSTOMER"),
  acceptQuoteController,
);
quoteRoutes.put(
  "/quotes/:id/decline",
  requireAuth,
  requireRole("CUSTOMER"),
  declineQuoteController,
);

export default quoteRoutes;
