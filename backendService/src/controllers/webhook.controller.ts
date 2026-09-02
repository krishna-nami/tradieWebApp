import { Request, Response } from "express";
import { stripe } from "../config/stripe.js";
import * as webhookService from "../services/webhook.service.js";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export const handleStripeWebhookController = async (
  req: Request,
  res: Response,
) => {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).send("Missing Stripe signature header");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  res.status(200).json({ received: true });

  try {
    await webhookService.processStripeEvent(event);
  } catch (err) {
    console.error(`Error processing webhook event ${event.type}:`, err);
  }
};
