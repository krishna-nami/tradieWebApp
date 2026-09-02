// validators/payment.validator.ts
import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  bookingId: z.uuid({ error: "Invalid booking ID" }),
});

export const paymentParamsSchema = z.object({
  id: z.uuid({ error: "Invalid payment ID" }),
});

export const bookingParamsSchema = z.object({
  id: z.uuid({ error: "Invalid booking ID" }),
});

export const createRefundRequestSchema = z.object({
  paymentId: z.uuid({ error: "Invalid payment ID" }),
  reason: z.string().min(1, "A reason is required").max(300),
  amount: z.coerce.number().positive({ error: "Amount must be positive" }),
});

export const refundRequestParamsSchema = z.object({
  id: z.uuid({ error: "Invalid refund request ID" }),
});

export const respondToRefundRequestSchema = z.object({
  approve: z.boolean({ error: "approve must be true or false" }),
  reason: z.string().max(300).optional(),
});

export const adminReviewRefundRequestSchema = z.object({
  approve: z.boolean({ error: "approve must be true or false" }),
  reason: z.string().max(300).optional(),
});

export type CreatePaymentIntentInput = z.infer<
  typeof createPaymentIntentSchema
>;
export type PaymentParamsInput = z.infer<typeof paymentParamsSchema>;
export type BookingParamsInput = z.infer<typeof bookingParamsSchema>;
export type CreateRefundRequestInput = z.infer<
  typeof createRefundRequestSchema
>;
export type RefundRequestParamsInput = z.infer<
  typeof refundRequestParamsSchema
>;
export type RespondToRefundRequestInput = z.infer<
  typeof respondToRefundRequestSchema
>;
export type AdminReviewRefundRequestInput = z.infer<
  typeof adminReviewRefundRequestSchema
>;
