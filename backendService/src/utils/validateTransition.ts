// utils/validateTransition.ts
import { BookingStatus } from "../generated/prisma/index.js";
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
