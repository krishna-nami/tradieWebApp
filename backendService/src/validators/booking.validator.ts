import { z } from "zod";

export const createBookingSchema = z.object({
  jobId: z.uuid({ error: "Invalid job Id" }),
  scheduledAt: z.coerce.date({ error: "Invalid scheduled date" }),
  totalAmount: z.coerce
    .number()
    .positive({ error: "total Amount must be Positive" }),
  notes: z.string().max(500).optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
