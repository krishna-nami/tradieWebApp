import { z } from "zod";
import { BookingStatus } from "../generated/prisma/index.js";

export const createBookingSchema = z.object({
  jobId: z.uuid({ error: "Invalid job Id" }),
  scheduledAt: z.coerce.date({ error: "Invalid scheduled date" }),
  totalAmount: z.coerce
    .number()
    .positive({ error: "total Amount must be Positive" }),
  notes: z.string().max(500).optional(),
});

export const listBookingSchema = z.object({
  status: z.enum(BookingStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const getBookingSchema = z.object({
  id: z.uuid({ error: "Invalid Booking Id" }),
});
export const acceptBookingSchema = z.object({
  reason: z.string().max(300).optional(),
});
export const declineBookingSchema = z.object({
  declineReason: z
    .string()
    .min(1, "A reason is required to decline this booking")
    .max(300),
});
export const idCheckSchema = z.object({
  id: z.uuid({ error: "Invalid ID" }),
});
export const cancelBookingSchema = z.object({
  cancelReason: z
    .string()
    .min(1, "A reason is required to cancel this booking")
    .max(300),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ListbookingInput = z.infer<typeof listBookingSchema>;
export type GetBookingInput = z.infer<typeof getBookingSchema>;
export type AcceptBookingInput = z.infer<typeof acceptBookingSchema>;
export type DeclineBookingInput = z.infer<typeof declineBookingSchema>;
export type IdCheckInput = z.infer<typeof idCheckSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
