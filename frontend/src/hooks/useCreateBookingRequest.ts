// hooks/useCreateBookingRequest.ts
import { useMutation } from "@tanstack/react-query";
import { createJob } from "@/lib/services/job";
import { createBooking } from "@/lib/services/booking";
import type { BookingRequestFormValues } from "@/lib/validation/booking";
import { toast } from "sonner";

export function useCreateBookingRequest(tradieId: string) {
  return useMutation({
    mutationFn: async (values: BookingRequestFormValues) => {
      let jobRes;

      try {
        jobRes = await createJob({
          title: values.title,
          description: values.description,
          category: values.category,
          suburb: values.suburb,
          state: values.state,
          postcode: values.postcode,
          budgetMax: Number(values.totalAmount),
          scheduledAt: new Date(values.scheduledAt).toISOString(),
          tradieId,
        });
        toast(`DEBUG: createJob succeeded, id=${jobRes.data.id}`);
      } catch (err) {
        toast.error(`DEBUG createJob FAILED: ${JSON.stringify(err)}`);
        throw err;
      }

      const bookingRes = await createBooking({
        jobId: jobRes.data.id,
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        totalAmount: Number(values.totalAmount),
        notes: values.notes,
      });

      return bookingRes;
    },
  });
}
