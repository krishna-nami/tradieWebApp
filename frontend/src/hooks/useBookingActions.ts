// hooks/useBookingActions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  acceptBooking,
  declineBooking,
  cancelBooking,
  startBooking,
  completeBooking,
} from "@/lib/services/booking";

function handleError(err: unknown, fallback: string) {
  const message = isAxiosError(err)
    ? (err.response?.data?.message ?? fallback)
    : "Something went wrong.";
  toast.error(message);
}

export function useBookingActions(bookingId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["bookings", "list"] });
  };

  const accept = useMutation({
    mutationFn: (reason?: string) => acceptBooking(bookingId, reason),
    onSuccess: () => {
      toast.success("Booking accepted");
      invalidate();
    },
    onError: (err) => handleError(err, "Could not accept booking."),
  });

  const decline = useMutation({
    mutationFn: (declineReason: string) =>
      declineBooking(bookingId, declineReason),
    onSuccess: () => {
      toast.success("Booking declined");
      invalidate();
    },
    onError: (err) => handleError(err, "Could not decline booking."),
  });

  const cancel = useMutation({
    mutationFn: (cancelReason: string) =>
      cancelBooking(bookingId, cancelReason),
    onSuccess: () => {
      toast.success("Booking cancelled");
      invalidate();
    },
    onError: (err) => handleError(err, "Could not cancel booking."),
  });

  const start = useMutation({
    mutationFn: () => startBooking(bookingId),
    onSuccess: () => {
      toast.success("Job started");
      invalidate();
    },
    onError: (err) => handleError(err, "Could not start job."),
  });

  const complete = useMutation({
    mutationFn: () => completeBooking(bookingId),
    onSuccess: () => {
      toast.success("Job marked complete");
      invalidate();
    },
    onError: (err) => handleError(err, "Could not complete job."),
  });

  return { accept, decline, cancel, start, complete };
}
