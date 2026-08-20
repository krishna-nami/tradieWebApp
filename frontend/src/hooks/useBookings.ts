// hooks/useBookings.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listBookings } from "@/lib/services/booking";
import type { BookingStatusValue } from "@/lib/booking-status";

import { getBookingById } from "@/lib/services/booking";

export function useBookings(status?: BookingStatusValue, page = 1) {
  return useQuery({
    queryKey: ["bookings", "list", status, page],
    queryFn: () => listBookings({ status, page, limit: 20 }),
    placeholderData: keepPreviousData,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
}
