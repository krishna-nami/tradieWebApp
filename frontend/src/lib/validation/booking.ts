// lib/validation/booking.ts
import { z } from "zod";

export const bookingRequestSchema = z.object({
  title: z.string().min(1, "Give this job a short title").max(150),
  description: z.string().min(1, "Describe the work needed").max(2000),
  category: z.string().min(1, "Select a trade category"),
  suburb: z.string().min(1, "Suburb is required").max(50),
  state: z.string().min(1, "State is required").max(10),
  postcode: z.string().regex(/^\d{4}$/, "Postcode must be 4 digits"),
  scheduledAt: z.string().min(1, "Pick a date and time"),
  totalAmount: z
    .string()
    .min(1, "Enter an estimated budget")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Enter a valid positive amount",
    ),
  notes: z.string().max(500).optional(),
});

export type BookingRequestFormValues = z.infer<typeof bookingRequestSchema>;
