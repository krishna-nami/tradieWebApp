// components/quote/QuoteBuilder.tsx
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import {
  quoteBuilderSchema,
  type QuoteBuilderFormValues,
} from "@/lib/validation/quote";
import { createQuote, sendQuote } from "@/lib/services/quote";
import { LineItemRow } from "./LineItemRow";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

function computeTotals(lineItems: QuoteBuilderFormValues["lineItems"]) {
  const subtotal = lineItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;
  return { subtotal, gst, total };
}

export function QuoteBuilder({ bookingId }: { bookingId: string }) {
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch } = useForm<QuoteBuilderFormValues>({
    resolver: zodResolver(quoteBuilderSchema),
    defaultValues: {
      lineItems: [
        { type: "LABOUR", description: "", quantity: "1", unitPrice: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });
  const watchedItems = watch("lineItems");
  const { subtotal, gst, total } = computeTotals(watchedItems);

  const createMutation = useMutation({
    mutationFn: (values: QuoteBuilderFormValues) =>
      createQuote(
        bookingId,
        values.lineItems.map((item) => ({
          description: `[${item.type === "LABOUR" ? "Labour" : "Material"}] ${item.description}`,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      ),
    onSuccess: async (data) => {
      toast.success("Quote saved as draft");
      // Immediately send it — a draft the customer never sees isn't useful on its own
      await sendMutation.mutateAsync(data.data.id);
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Could not create quote.")
        : "Something went wrong.";
      toast.error(message);
    },
  });

  const sendMutation = useMutation({
    mutationFn: sendQuote,
    onSuccess: () => {
      toast.success("Quote sent to customer");
      queryClient.invalidateQueries({ queryKey: ["bookings", bookingId] });
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Could not send quote.")
        : "Something went wrong.";
      toast.error(message);
    },
  });

  const onSubmit = (values: QuoteBuilderFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900">Build quote</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-2 px-1 text-xs font-medium text-slate-400">
            <span className="col-span-3">Type</span>
            <span className="col-span-4">Description</span>
            <span className="col-span-2">Qty</span>
            <span className="col-span-2">Unit price</span>
          </div>

          {fields.map((field, index) => (
            <LineItemRow
              key={field.id}
              index={index}
              control={control}
              remove={remove}
              canRemove={fields.length > 1}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() =>
              append({
                type: "LABOUR",
                description: "",
                quantity: "1",
                unitPrice: "",
              })
            }
          >
            <Plus size={14} className="mr-1" /> Add line item
          </Button>

          <div className="mt-2 space-y-1 border-t border-slate-200 pt-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (10%)</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={createMutation.isPending || sendMutation.isPending}
            className="mt-2"
          >
            Save & send quote
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
