import { Request, Response } from "express";

import * as paymentService from "../services/payment.service.js";
import { listPayoutsForTradieService } from "../services/payout.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateInvoicePdf } from "../services/pdf.service.js";
import { validateRequest } from "../utils/validateRequest.js";
import {
  adminReviewRefundRequestSchema,
  bookingParamsSchema,
  createPaymentIntentSchema,
  createRefundRequestSchema,
  refundRequestParamsSchema,
  respondToRefundRequestSchema,
} from "../validators/payment.validator.js";

export const createPaymentIntentController = async (
  req: Request,
  res: Response,
) => {
  const customerId = req.user.id;
  const { bookingId } = validateRequest(createPaymentIntentSchema, req.body);

  const result = await paymentService.createPaymentIntentService(
    bookingId,
    customerId,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Payment Intent created", result));
};

export const getConnectOnboardingLinkController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user.id;
  const result = await paymentService.getConnectOnboardingLinkService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Onboarding link generated", result));
};

export const createRefundRequestController = async (
  req: Request,
  res: Response,
) => {
  const requesterId = req.user.id;
  const { paymentId, reason, amount } = validateRequest(
    createRefundRequestSchema,
    req.body,
  );

  const result = await paymentService.createRefundRequestService(
    paymentId,
    requesterId,
    reason,
    amount,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Refund request created", result));
};
export const respondToRefundRequestController = async (
  req: Request,
  res: Response,
) => {
  const responderId = req.user.id;
  const { id } = validateRequest(refundRequestParamsSchema, req.params);

  const { approve, reason } = validateRequest(
    respondToRefundRequestSchema,
    req.body,
  );

  const result = await paymentService.respondToRefundRequestService(
    id,
    responderId,
    approve,
    reason,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Response recorded", result));
};
export const adminReviewRefundRequestController = async (
  req: Request,
  res: Response,
) => {
  const adminId = req.user.id;
  const { id } = validateRequest(refundRequestParamsSchema, req.params);
  const { approve, reason } = validateRequest(
    adminReviewRefundRequestSchema,
    req.body,
  );
  const result = await paymentService.adminReviewRefundRequestService(
    id,
    adminId,
    approve,
    reason,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Refund request reviewed", result));
};
export const downloadInvoiceController = async (
  req: Request,
  res: Response,
) => {
  const requesterId = req.user.id;
  const { id } = validateRequest(bookingParamsSchema, req.params);

  const pdfBuffer = await generateInvoicePdf(id, requesterId);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${id.slice(0, 8)}.pdf`,
  );
  res.send(pdfBuffer);
};

export const getConnectStatusController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user.id;
  const result = await paymentService.getConnectStatusService(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Connect status fetched", result));
};

export const listPayoutsController = async (req: Request, res: Response) => {
  const tradieId = req.user.id;
  const result = await listPayoutsForTradieService(tradieId);
  return res.status(200).json(new ApiResponse(200, "Payouts fetched", result));
};
