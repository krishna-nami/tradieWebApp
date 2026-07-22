import { z } from "zod";

const TRADE_CATEGORIES = [
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
    .regex(/^\d{11}$/, { error: "ABN must be exactly 11 digit" })
    .optional(),
  licenceNo: z
    .string()
    .max(50, { error: "Licesne number too long" })
    .optional(),

  trades: z
    .array(z.enum(TRADE_CATEGORIES))
    .min(1, { error: "At least one trade must be selected" })
    .max(10, { error: "You can select up to 10 trades" }),

  bio: z
    .string()
    .max(500, { error: "Bio must be less than 500 characters" })
    .optional(),
});
export const updateTradieProfileSchema = z.object({
  bio: z
    .string()
    .max(500, { error: "Bio must be less than 500 characters" })
    .optional(),
  trades: z
    .array(z.enum(TRADE_CATEGORIES))
    .min(1, { error: "At least one trade must be selected" })
    .max(10, { error: "You can select up to 10 trades" })
    .optional(),
  licenceNo: z
    .string()
    .max(50, { error: "Licence number too long" })
    .optional(),
  isAvailable: z.boolean().optional(),
});

export const addSpecialisationSchema = z.object({
  trade: z.string({ error: "Please enter valid Trade" }).min(2).max(50).trim(),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  certification: z.string().max(100).optional(),
});

export const specialisationParamsSchema = z.object({
  id: z.uuid({ error: "Invalid specialisation ID" }),
});

export type TradieProfileInput = z.infer<typeof tradieProfileSchema>;
export type UpdateTraideProfileInput = z.infer<
  typeof updateTradieProfileSchema
>;
export type AddSpecialisationInput = z.infer<typeof addSpecialisationSchema>;
export type SpecialisationParamsInput = z.infer<
  typeof specialisationParamsSchema
>;
