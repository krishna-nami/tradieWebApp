import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  adminReviewRefundRequestController,
  createPaymentIntentController,
  createRefundRequestController,
  downloadInvoiceController,
  getConnectOnboardingLinkController,
  getConnectStatusController,
  listPayoutsController,
  respondToRefundRequestController,
} from "../controllers/payment.controller.js";

const paymentRoutes = Router();

paymentRoutes.post(
  "/intent",
  requireAuth,
  requireRole("CUSTOMER"),
  createPaymentIntentController,
);

paymentRoutes.get(
  "/connect/onboard",
  requireAuth,
  requireRole("TRADIE"),
  getConnectOnboardingLinkController,
);

paymentRoutes.post(
  "/refund-requests",
  requireAuth,
  requireRole("CUSTOMER", "TRADIE"),
  createRefundRequestController,
);
paymentRoutes.get(
  "/connect/status",
  requireAuth,
  requireRole("TRADIE"),
  getConnectStatusController,
);
paymentRoutes.get(
  "/payouts",
  requireAuth,
  requireRole("TRADIE"),
  listPayoutsController,
);

//Dynamics Routes
paymentRoutes.put(
  "/refund-requests/:id/respond",
  requireAuth,
  requireRole("CUSTOMER", "TRADIE"),
  respondToRefundRequestController,
);
paymentRoutes.put(
  "/refund-requests/:id/admin-review",
  requireAuth,
  requireRole("ADMIN"),
  adminReviewRefundRequestController,
);

paymentRoutes.get(
  "/:id/invoice",
  requireAuth,
  requireRole("CUSTOMER", "TRADIE"),
  downloadInvoiceController,
);
export default paymentRoutes;
