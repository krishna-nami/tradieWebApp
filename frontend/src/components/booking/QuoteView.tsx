// components/booking/QuoteView.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { Quote } from "@/lib/api-types";
import { useQuoteActions } from "@/hooks/useQuoteActions";

const QUOTE_STATUS_LABEL: Record<Quote["status"], string> = {
  DRAFT: "Draft",
  SENT: "Awaiting your response",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  EXPIRED: "Expired",
};

export function QuoteView({
  quote,
  bookingId,
  readOnly = false,
}: {
  quote: Quote;
  bookingId: string;
  readOnly: boolean;
}) {
  const { accept, decline } = useQuoteActions(bookingId);
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const isExpired = quote.expiresAt
    ? new Date(quote.expiresAt) < new Date()
    : false;
  const canRespond = !readOnly && quote.status === "SENT" && !isExpired;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Quote</h2>
        <Badge
          variant={
            quote.status === "ACCEPTED"
              ? "success"
              : quote.status === "DECLINED"
                ? "danger"
                : "default"
          }
        >
          {QUOTE_STATUS_LABEL[quote.status]}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="divide-y divide-slate-100">
          {quote.lineItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 text-sm"
            >
              <div>
                <p className="text-slate-900">{item.description}</p>
                <p className="text-slate-400">
                  {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                </p>
              </div>
              <p className="font-medium text-slate-900">
                ${Number(item.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 border-t border-slate-200 pt-3 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>${Number(quote.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GST (10%)</span>
            <span>${Number(quote.gst).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${Number(quote.total).toFixed(2)}</span>
          </div>
        </div>

        {quote.expiresAt && (
          <p className="mt-2 text-xs text-slate-400">
            {isExpired ? "Expired on" : "Valid until"}{" "}
            {new Date(quote.expiresAt).toLocaleDateString("en-AU", {
              dateStyle: "medium",
            })}
          </p>
        )}

        {canRespond && (
          <div className="mt-4 flex flex-col gap-2">
            {!showDeclineInput ? (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  isLoading={accept.isPending}
                  onClick={() => accept.mutate(quote.id)}
                >
                  Accept quote
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeclineInput(true)}
                >
                  Decline
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Reason for declining"
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    isLoading={decline.isPending}
                    disabled={!declineReason.trim()}
                    onClick={() =>
                      decline.mutate({
                        quoteId: quote.id,
                        reason: declineReason,
                      })
                    }
                  >
                    Confirm decline
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeclineInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
