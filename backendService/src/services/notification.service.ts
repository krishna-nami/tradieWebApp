import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { EMAIL_JOB_NAMES, QUEUE_NAMES } from "../config/queue.definitions.js";

const emailQueue = redisConnection
  ? new Queue(QUEUE_NAMES.EMAIL, { connection: redisConnection })
  : null;

const enqueueEmail = (name: string, data: Record<string, unknown>) => {
  if (!emailQueue) {
    console.warn(`Notifications disabled(no REDIS_URL)-skipped ${name}`);

    return Promise.resolve();
  }

  return emailQueue.add(name, data);
};
export const notificationClient = {
  sendWelcomeEmail: (to: string, firstName: string) =>
    enqueueEmail(EMAIL_JOB_NAMES.WELCOME, { to, firstName }),

  sendVerifyEmail: (to: string, firstName: string, verifyUrl: string) =>
    enqueueEmail(EMAIL_JOB_NAMES.VERIFY_EMAIL, { to, firstName, verifyUrl }),

  sendPasswordResetEmail: (to: string, firstName: string, resetUrl: string) =>
    enqueueEmail(EMAIL_JOB_NAMES.PASSWORD_RESET, { to, firstName, resetUrl }),

  sendBookingRequestedEmail: (
    to: string,
    tradieFirstName: string,
    jobTitle: string,
    customerName: string,
    bookingUrl: string,
  ) =>
    enqueueEmail(EMAIL_JOB_NAMES.BOOKING_REQUESTED, {
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
    enqueueEmail(EMAIL_JOB_NAMES.BOOKING_CONFIRMED, {
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
    enqueueEmail(EMAIL_JOB_NAMES.BOOKING_COMPLETED, {
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
    enqueueEmail(EMAIL_JOB_NAMES.PAYMENT_RECEIPT, {
      to,
      firstName,
      jobTitle,
      amount,
      invoiceUrl,
    }),
};
