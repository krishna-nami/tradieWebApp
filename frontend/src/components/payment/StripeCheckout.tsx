// components/payment/StripeCheckout.tsx
"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function StripeCheckout({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/${bookingId}/success`,
      },
    });

    // confirmPayment only returns here if there's an immediate error
    // (e.g. card declined synchronously) — success redirects to return_url
    if (error) {
      toast.error(error.message ?? "Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!stripe}
        className="mt-2"
      >
        Pay now
      </Button>
    </form>
  );
}
