// app/checkout/[bookingId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { createPaymentIntent } from "@/lib/services/payment";
import { StripeCheckout } from "@/components/payment/StripeCheckout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function CheckoutContent() {
  const params = useParams<{ bookingId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-intent", params.bookingId],
    queryFn: () => createPaymentIntent(params.bookingId),
    retry: false, // creating an intent has real side effects — don't silently retry on failure
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="py-16 text-center text-sm text-slate-500">
        Could not start checkout. This booking may already be paid, or its quote
        isn&apos;t accepted yet.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-slate-900">Complete payment</h1>
          <p className="text-sm text-slate-500">
            Total: ${Number(data.data.amount).toFixed(2)}
          </p>
        </CardHeader>
        <CardContent>
          <Elements
            stripe={getStripe()}
            options={{
              clientSecret: data.data.clientSecret,
              appearance: { theme: "stripe" },
            }}
          >
            <StripeCheckout bookingId={params.bookingId} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
