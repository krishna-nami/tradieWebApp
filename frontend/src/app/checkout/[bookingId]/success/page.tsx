// app/checkout/[bookingId]/success/page.tsx
"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Download } from "lucide-react";
import { downloadInvoice } from "@/lib/services/payment";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function ReceiptContent() {
  const params = useParams<{ bookingId: string }>();
  const searchParams = useSearchParams();
  const redirectStatus = searchParams.get("redirect_status");
  const isSuccess = redirectStatus === "succeeded";

  const handleDownload = () => downloadInvoice(params.bookingId);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="items-center text-center">
          {isSuccess ? (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500" />
          )}
          <h1 className="mt-2 text-xl font-bold text-slate-900">
            {isSuccess ? "Payment successful" : "Payment not completed"}
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-slate-500">
            {isSuccess
              ? "Your booking is confirmed. Your tradie has been notified and can now start the job."
              : "Something went wrong processing your payment. You can try again from your bookings page."}
          </p>

          {isSuccess && (
            <Button
              variant="outline"
              onClick={handleDownload}
              className="w-full"
            >
              <Download size={16} className="mr-1.5" /> Download invoice
            </Button>
          )}

          <Link href={`/bookings/${params.bookingId}`} className="w-full">
            <Button className="w-full">View booking</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentReceiptPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Spinner size={28} />
          </div>
        }
      >
        <ReceiptContent />
      </Suspense>
    </ProtectedRoute>
  );
}
