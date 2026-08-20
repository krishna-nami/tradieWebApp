// hooks/useQuoteActions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptQuote, declineQuote } from "@/lib/services/quote";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export function useQuoteActions(bookingId: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["bookings", bookingId] });

  const accept = useMutation({
    mutationFn: acceptQuote,
    onSuccess: () => {
      toast.success("Quote accepted");
      invalidate();
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Could not accept quote.")
        : "Something went wrong.";
      toast.error(message);
    },
  });

  const decline = useMutation({
    mutationFn: ({ quoteId, reason }: { quoteId: string; reason: string }) =>
      declineQuote(quoteId, reason),
    onSuccess: () => {
      toast.success("Quote declined");
      invalidate();
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Could not decline quote.")
        : "Something went wrong.";
      toast.error(message);
    },
  });

  return { accept, decline };
}
