// src/validators/email.validator.ts
import { z } from "zod";

const baseEmailSchema = z.object({ to: z.email() });

export const emailJobSchemas = {
  WELCOME: baseEmailSchema.extend({
    firstName: z.string().min(1),
  }),
  VERIFY_EMAIL: baseEmailSchema.extend({
    firstName: z.string().min(1),
    verifyUrl: z.url(),
  }),
  PASSWORD_RESET: baseEmailSchema.extend({
    firstName: z.string().min(1),
    resetUrl: z.url(),
  }),
  BOOKING_REQUESTED: baseEmailSchema.extend({
    tradieFirstName: z.string().min(1),
    jobTitle: z.string().min(1),
    customerName: z.string().min(1),
    bookingUrl: z.url(),
  }),
  BOOKING_CONFIRMED: baseEmailSchema.extend({
    firstName: z.string().min(1),
    jobTitle: z.string().min(1),
    scheduledAt: z.string().min(1),
    bookingUrl: z.url(),
  }),
  BOOKING_COMPLETED: baseEmailSchema.extend({
    firstName: z.string().min(1),
    jobTitle: z.string().min(1),
    bookingUrl: z.url(),
  }),
  PAYMENT_RECEIPT: baseEmailSchema.extend({
    firstName: z.string().min(1),
    jobTitle: z.string().min(1),
    amount: z.string().min(1),
    invoiceUrl: z.url(),
  }),
} as const;
