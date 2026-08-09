// lib/validation/tradieProfile.ts
import { z } from "zod";

export const TRADE_CATEGORIES = [
  "electrical",
  "plumbing",
  "painting",
  "carpentry",
  "landscaping",
  "roofing",
  "tiling",
  "general_handyman",
] as const;

export const tradieProfileSchema = z.object({
  abn: z
    .string()
    .regex(/^\d{11}$/, "ABN must be exactly 11 digits")
    .optional()
    .or(z.literal("")),
  licenceNo: z.string().max(50, "Licence number too long").optional(),
  trades: z
    .array(z.enum(TRADE_CATEGORIES))
    .min(1, "Select at least one trade")
    .max(10, "You can select up to 10 trades"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export type TradieProfileFormValues = z.infer<typeof tradieProfileSchema>;
