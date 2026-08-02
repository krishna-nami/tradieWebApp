// validators/quote.validator.ts
import { z } from "zod";

const lineItemSchema = z.object({
  description: z.string().min(1).max(200),
  quantity: z.coerce.number().int().positive().default(1),
  unitPrice: z.coerce.number().positive(),
});

export const createQuoteSchema = z.object({
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
});

export const updateQuoteSchema = z.object({
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line items is required"),
});
export const quoteParamsSchema = z.object({
  id: z.uuid({ error: "Invalid quote ID" }),
});
export const declineQuoteSchema = z.object({
  reason: z.string().min(1, "A reason to decline this quote").max(300),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type QuoteParamsInput = z.infer<typeof quoteParamsSchema>;
export type DeclineParamsInput = z.infer<typeof declineQuoteSchema>;
