import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  createQuoteController,
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

export default quoteRoutes;
