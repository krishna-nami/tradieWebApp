import { Queue } from "bullmq";
import { EMAIL_JOB_NAMES, QUEUE_NAMES } from "./queue.definitions.js";
import { redisConnection } from "./redis.js";

const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: redisConnection,
});
//const smsQueue = new Queue(QUEUE_NAMES.SMS, { connection: redisConnection });

export const notificationClient = {
  sendWelcomeEmail: (to: string, firstName: string) =>
    emailQueue.add(EMAIL_JOB_NAMES.WELCOME, { to, firstName }),

  sendVerifyEmail: (to: string, firstName: string, verifyUrl: string) =>
    emailQueue.add(EMAIL_JOB_NAMES.VERIFY_EMAIL, { to, firstName, verifyUrl }),

  sendPasswordResetEmail: (to: string, firstName: string, resetUrl: string) =>
    emailQueue.add(EMAIL_JOB_NAMES.PASSWORD_RESET, { to, firstName, resetUrl }),

  sendBookingRequestedEmail: (
    to: string,
    tradieFirstName: string,
    jobTitle: string,
    customerName: string,
    bookingUrl: string,
  ) =>
    emailQueue.add(EMAIL_JOB_NAMES.BOOKING_REQUESTED, {
      to,
      tradieFirstName,
      jobTitle,
      customerName,
      bookingUrl,
    }),

  sendBookingConfirmedEmail: (
    to: string,
    firstName: string,
    jobTitle: string,
    scheduledAt: string,
    bookingUrl: string,
  ) =>
    emailQueue.add(EMAIL_JOB_NAMES.BOOKING_CONFIRMED, {
      to,
      firstName,
      jobTitle,
      scheduledAt,
      bookingUrl,
    }),
  sendBookingCompletedEmail: (
    to: string,
    firstName: string,
    jobTitle: string,
    bookingUrl: string,
  ) =>
    emailQueue.add(EMAIL_JOB_NAMES.BOOKING_COMPLETED, {
      to,
      firstName,
      jobTitle,
      bookingUrl,
    }),

  sendPaymentReceiptEmail: (
    to: string,
    firstName: string,
    jobTitle: string,
    amount: string,
    invoiceUrl: string,
  ) =>
    emailQueue.add(EMAIL_JOB_NAMES.PAYMENT_RECEIPT, {
      to,
      firstName,
      jobTitle,
      amount,
      invoiceUrl,
    }),
};
