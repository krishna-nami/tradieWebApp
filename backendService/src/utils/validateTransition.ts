// utils/validateTransition.ts
import { BookingStatus, QuoteStatus } from "../generated/prisma/index.js";
import { ApiError } from "./ApiError.js";

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["ACCEPTED", "DECLINED", "CANCELLED"],
  ACCEPTED: ["CONFIRMED", "CANCELLED"], // CONFIRMED only reachable via quote accept, not this endpoint
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  DECLINED: [],
  CANCELLED: [],
};
const ALLOWED_QUOTE_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  DRAFT: ["SENT"],
  SENT: ["ACCEPTED", "DECLINED", "EXPIRED"],
  ACCEPTED: [],
  DECLINED: [],
  EXPIRED: [],
};

export const validateTransition = (
  current: BookingStatus,
  next: BookingStatus,
): void => {
  const allowed = ALLOWED_TRANSITIONS[current];

  if (!allowed.includes(next)) {
    throw new ApiError(
      400,
      `Cannot transition booking from ${current} to ${next}`,
    );
  }
};
export const validateQuoteTransition = (
  current: QuoteStatus,
  next: QuoteStatus,
): void => {
  const allowed = ALLOWED_QUOTE_TRANSITIONS[current];
  if (!allowed.includes(next)) {
    throw new ApiError(
      400,
      `Cannot transition quote from ${current} status to ${next} status`,
    );
  }
};
