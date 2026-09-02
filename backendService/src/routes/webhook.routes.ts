// routes/webhook.routes.ts
import { Router, raw } from "express";
import { handleStripeWebhookController } from "../controllers/webhook.controller.js";

const webhookRoutes = Router();

// raw({ type: "application/json" }) preserves the exact byte payload Stripe signed —
// express.json() would have already parsed/re-serialized it, breaking signature verification
webhookRoutes.post(
  "/stripe",
  raw({ type: "application/json" }),
  handleStripeWebhookController,
);

export default webhookRoutes;
