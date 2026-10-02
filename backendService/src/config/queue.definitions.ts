export const QUEUE_NAMES = {
  EMAIL: "email-queue",
  SMS: "sms-queue",
} as const;

export const EMAIL_JOB_NAMES = {
  WELCOME: "welcome-email",
  VERIFY_EMAIL: "verify-email",
  PASSWORD_RESET: "password-reset-email",
  BOOKING_REQUESTED: "booking-requested-email",
  BOOKING_CONFIRMED: "booking-confirmed-email",
  BOOKING_COMPLETED: "booking-completed-email",
  PAYMENT_RECEIPT: "payment-receipt-email",
} as const;

export const SMS_JOB_NAMES = {
  BOOKING_CONFIRMED: "booking-confirmed-sms",
  BOOKING_REMINDER: "booking-reminder-sms",
  PAYOUT_SENT: "payout-sent-sms",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
export type EmailJobName =
  (typeof EMAIL_JOB_NAMES)[keyof typeof EMAIL_JOB_NAMES];
export type smsJobName = (typeof SMS_JOB_NAMES)[keyof typeof SMS_JOB_NAMES];
