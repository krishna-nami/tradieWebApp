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
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ListbookingInput = z.infer<typeof listBookingSchema>;
