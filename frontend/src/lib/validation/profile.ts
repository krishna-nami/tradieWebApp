// lib/validation/profile.ts
import { z } from "zod";

export const genericProfileSchema = z.object({
  firstName: z.string().min(2, "Min 2 characters").max(50),
  lastName: z.string().min(2, "Min 2 characters").max(50),
  phone: z
    .string()
    .regex(/^(\+61|0)[23478]\d{8}$/, "Invalid Australian phone number")
    .optional()
    .or(z.literal("")),
  addressLine1: z.string().max(100).optional(),
  addressLine2: z.string().max(100).optional(),
  suburb: z.string().max(50).optional(),
  state: z
    .enum(["ACT", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT"])
    .optional()
    .or(z.literal("")),
  postcode: z
    .string()
    .regex(/^\d{4}$/, "Must be 4 digits")
    .optional()
    .or(z.literal("")),
});
export type GenericProfileFormValues = z.infer<typeof genericProfileSchema>;

export const tradieDetailsSchema = z.object({
  bio: z.string().max(500, "Max 500 characters").optional(),
  licenceNo: z.string().max(50).optional(),
  isAvailable: z.boolean(),
});
export type TradieDetailsFormValues = z.infer<typeof tradieDetailsSchema>;
