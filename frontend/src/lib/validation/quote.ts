// lib/validation/quote.ts
import { z } from "zod";

export const lineItemFormSchema = z.object({
  type: z.enum(["LABOUR", "MATERIAL"]), // UI-only, folded into description on submit
  description: z.string().min(1, "Description is required").max(200),
  quantity: z.string().min(1, "Required"),
  unitPrice: z.string().min(1, "Required"),
});

export const quoteBuilderSchema = z.object({
  lineItems: z.array(lineItemFormSchema).min(1, "Add at least one line item"),
});

export type LineItemFormValues = z.infer<typeof lineItemFormSchema>;
export type QuoteBuilderFormValues = z.infer<typeof quoteBuilderSchema>;
