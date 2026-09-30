import { emailJobSchemas } from "../validators/email.validator.js";

import type { z } from "zod";

type WelcomeData = z.infer<typeof emailJobSchemas.WELCOME>;
type VerifyEmailData = z.infer<typeof emailJobSchemas.VERIFY_EMAIL>;
type PasswordResetData = z.infer<typeof emailJobSchemas.PASSWORD_RESET>;
type BookingRequestedData = z.infer<typeof emailJobSchemas.BOOKING_REQUESTED>;
type BookingConfirmedData = z.infer<typeof emailJobSchemas.BOOKING_CONFIRMED>;
type BookingCompletedData = z.infer<typeof emailJobSchemas.BOOKING_COMPLETED>;
type PaymentReceiptData = z.infer<typeof emailJobSchemas.PAYMENT_RECEIPT>;

const wrapper = (content: string) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #0f172a;">
    <h2 style="color: #0f172a;">Tradie<span style="color:#f59e0b;">Hub</span></h2>
    ${content}
    <p style="margin-top: 32px; font-size: 12px; color: #94a3b8;">
      TradieHub — Trusted local tradies, booked in minutes.
    </p>
  </div>
`;

export const emailTemplates = {
  welcome: ({ firstName }: WelcomeData) => ({
    subject: "Welcome to TradieHub",
    html: wrapper(`
      <p>Hi ${firstName},</p>
      <p>Welcome to TradieHub! Your account is ready to go.</p>
    `),
  }),
  verifyEmail: ({ firstName, verifyUrl }: VerifyEmailData) => ({
    subject: "Verify your TradieHub account",
    html: wrapper(`
      <p>Hi ${firstName},</p>
      <p>Please verify your email address to activate your account:</p>
      <p><a href="${verifyUrl}" style="color:#f59e0b;">Verify email</a></p>
    `),
  }),
  passwordReset: ({ firstName, resetUrl }: PasswordResetData) => ({
    subject: "Reset your TradieHub password",
    html: wrapper(`
      <p>Hi ${firstName},</p>
      <p>We received a request to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="color:#f59e0b;">Reset password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `),
  }),
  bookingRequested: ({
    tradieFirstName,
    jobTitle,
    customerName,
    bookingUrl,
  }: BookingRequestedData) => ({
    subject: `New booking request: ${jobTitle}`,
    html: wrapper(`
      <p>Hi ${tradieFirstName},</p>
      <p>${customerName} has requested a booking for "${jobTitle}".</p>
      <p><a href="${bookingUrl}" style="color:#f59e0b;">View job</a></p>
    `),
  }),

  bookingConfirmed: ({
    firstName,
    jobTitle,
    scheduledAt,
    bookingUrl,
  }: BookingConfirmedData) => ({
    subject: `Booking confirmed: ${jobTitle}`,
    html: wrapper(`
      <p>Hi ${firstName},</p>
      <p>Your booking for "${jobTitle}" is confirmed for ${scheduledAt}.</p>
      <p><a href="${bookingUrl}" style="color:#f59e0b;">View booking</a></p>
    `),
  }),
  bookingCompleted: ({
    firstName,
    jobTitle,
    bookingUrl,
  }: BookingCompletedData) => ({
    subject: `Job completed: ${jobTitle}`,
    html: wrapper(`
      <p>Hi ${firstName},</p>
      <p>"${jobTitle}" has been marked as completed.</p>
      <p><a href="${bookingUrl}" style="color:#f59e0b;">View booking</a></p>
    `),
  }),
  paymentReceipt: ({
    firstName,
    jobTitle,
    amount,
    invoiceUrl,
  }: PaymentReceiptData) => ({
    subject: `Receipt for ${jobTitle}`,
    html: wrapper(`
      <p>Hi ${firstName},</p>
      <p>Your payment of $${amount} for "${jobTitle}" was successful.</p>
      <p><a href="${invoiceUrl}" style="color:#f59e0b;">Download invoice</a></p>
    `),
  }),
};
