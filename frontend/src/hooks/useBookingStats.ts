// hooks/useBookingStats.ts
import { useQueries } from "@tanstack/react-query";
import { listBookings } from "@/lib/services/booking";
import {
  BOOKING_STATUSES,
  type BookingStatusValue,
} from "@/lib/booking-status";

export function useBookingStats() {
  const results = useQueries({
    queries: BOOKING_STATUSES.map((status) => ({
      queryKey: ["bookings", "count", status],
      // limit: 1 — we only need pagination.total, not the actual rows
      queryFn: () => listBookings({ status, page: 1, limit: 1 }),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  const counts = BOOKING_STATUSES.reduce(
    (acc, status, i) => {
      acc[status] = results[i].data?.data.pagination.total ?? 0;
      return acc;
    },
    {} as Record<BookingStatusValue, number>,
  );

  return { counts, isLoading };
}
