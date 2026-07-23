import { z } from "zod";

export const createJobSchema = z
  .object({
    title: z.string().min(5).max(150).trim(),
    description: z.string().min(20).max(2000).trim(),
    category: z.string().min(2).max(50).trim(),
    suburb: z.string().min(1).max(50).trim(),
    state: z.enum(["ACT", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT"]),
    postcode: z.string().regex(/^\d{4}$/, "Postcode must be 4 digits"),
    budgetMin: z.coerce.number().positive().optional(),
    budgetMax: z.coerce.number().positive().optional(),
    scheduledAt: z.coerce.date().optional(),
  })
  .refine((d) => !d.budgetMin || !d.budgetMax || d.budgetMin <= d.budgetMax, {
    message: "budgetMin must be less than or equal to budgetMax",
    path: ["budgetMin"],
  });
export type CreateJobInput = z.infer<typeof createJobSchema>;
