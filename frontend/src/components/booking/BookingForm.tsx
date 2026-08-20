// components/booking/BookingForm.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import {
  bookingRequestSchema,
  type BookingRequestFormValues,
} from "@/lib/validation/booking";
import { useCreateBookingRequest } from "@/hooks/useCreateBookingRequest";
import { AddressFields } from "@/components/booking/AddressFields";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormProps {
  tradieId: string;
  tradieTrades: string[];
}

function formatTradeLabel(trade: string) {
  if (!trade) return "";
  return trade
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function BookingForm({ tradieId, tradieTrades }: BookingFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const mutation = useCreateBookingRequest(tradieId);

  const { control, handleSubmit, reset } = useForm<BookingRequestFormValues>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      category: tradieTrades[0] ?? "",
      suburb: "",
      state: "",
      postcode: "",
      scheduledAt: "",
      totalAmount: "",
      notes: "",
    },
  });

  const onSubmit = (values: BookingRequestFormValues) => {
    setSubmitError(null);
    mutation.mutate(values, {
      onSuccess: (data) => {
        toast.success("Booking request sent!");
        reset();
        router.push(`/bookings/${data.data.id}`);
      },
      onError: (err) => {
        const message = isAxiosError(err)
          ? (err.response?.data?.message ?? "Could not send booking request.")
          : "Something went wrong. Try again.";
        setSubmitError(message);
        toast.error(message);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Job title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="e.g. Fix leaking kitchen tap"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Trade category</FieldLabel>
            <Select
              value={field.value || ""}
              onValueChange={(v) => field.onChange(v ?? "")}
            >
              <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Select a trade" />
              </SelectTrigger>
              <SelectContent>
                {tradieTrades.map((t) => (
                  <SelectItem key={t} value={t}>
                    {formatTradeLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Describe the work</FieldLabel>
            <textarea
              {...field}
              id={field.name}
              rows={4}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="What needs doing? Include any relevant details..."
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <AddressFields control={control} />

      <Controller
        name="scheduledAt"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Preferred date & time</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="datetime-local"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="totalAmount"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Estimated budget (AUD)</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              min={0}
              step="0.01"
              placeholder="e.g. 250"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            <p className="text-xs text-slate-400">
              This is a starting estimate — the tradie will send a formal quote
              once they accept.
            </p>
          </Field>
        )}
      />

      <Controller
        name="notes"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Additional notes (optional)
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {submitError && (
        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
          {submitError}
        </div>
      )}

      <Button
        type="submit"
        isLoading={mutation.isPending}
        className="mt-2"
        disabled={mutation.isPending}
      >
        Send booking request
      </Button>
    </form>
  );
}
