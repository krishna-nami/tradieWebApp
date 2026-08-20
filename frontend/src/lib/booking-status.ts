// lib/booking-status.ts
export const BOOKING_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "CONFIRMED",
  "IN_PROGRESS",
  "CANCELLED",
  "DECLINED",
  "COMPLETED",
] as const;

const BOOKING_TRANSITIONS: Record<BookingStatusValue, BookingStatusValue[]> = {
  PENDING: ["ACCEPTED", "DECLINED", "CANCELLED"],
  ACCEPTED: ["CONFIRMED", "CANCELLED"], // CONFIRMED only happens via quote accept, not a direct action
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  DECLINED: [],
  CANCELLED: [],
};

export type BookingStatusValue = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_CONFIG: Record<
  BookingStatusValue,
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-800" },
  ACCEPTED: { label: "Accepted", className: "bg-blue-100 text-blue-800" },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-emerald-100 text-emerald-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-indigo-100 text-indigo-800",
  },
  CANCELLED: { label: "Cancelled", className: "bg-slate-200 text-slate-600" },
  DECLINED: { label: "Declined", className: "bg-red-100 text-red-800" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-800" },
};

export function getAvailableActions(
  status: BookingStatusValue,
  role: "CUSTOMER" | "TRADIE",
) {
  const actions: {
    key: "accept" | "decline" | "cancel" | "start" | "complete";
    label: string;
  }[] = [];

  if (role === "TRADIE") {
    if (status === "PENDING") {
      actions.push(
        { key: "accept", label: "Accept" },
        { key: "decline", label: "Decline" },
      );
    }
    if (status === "CONFIRMED") {
      actions.push({ key: "start", label: "Start job" });
    }
    if (status === "IN_PROGRESS") {
      actions.push({ key: "complete", label: "Mark complete" });
    }
  }

  // Either party can cancel, but only in states where cancellation still makes sense
  if (BOOKING_TRANSITIONS[status]?.includes("CANCELLED")) {
    actions.push({ key: "cancel", label: "Cancel" });
  }

  return actions;
}
