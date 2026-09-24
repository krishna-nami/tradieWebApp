// app/bookings/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { MapPin, Calendar, DollarSign, User } from "lucide-react";
import { useBooking } from "@/hooks/useBookings";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { StatusTimeline } from "@/components/booking/StatusTimeline";
import { QuoteView } from "@/components/booking/QuoteView";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { PaymentDetails } from "@/components/booking/PaymentDetails";

function BookingDetailContent() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBooking(params.id);

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
        Booking not found.
      </p>
    );
  }

  const booking = data.data;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          {booking.job.title}
        </h1>
        <BookingStatus status={booking.status} />
      </div>

      <Card className="mt-4">
        <CardContent className="space-y-2 p-4 text-sm">
          <p className="text-slate-700">{booking.job.description}</p>
          <div className="flex flex-wrap gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {booking.job.suburb}, {booking.job.state}{" "}
              {booking.job.postcode}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(booking.scheduledAt).toLocaleString("en-AU", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={14} /> Est. $
              {Number(booking.totalAmount).toFixed(2)}
            </span>
          </div>
          {booking.notes && (
            <p className="text-slate-500">Notes: {booking.notes}</p>
          )}
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <User size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Tradie</p>
            <p className="font-medium text-slate-900">
              {booking.tradie.profile.firstName}{" "}
              {booking.tradie.profile.lastName}
            </p>
            <p className="text-xs text-slate-500">{booking.tradie.email}</p>
          </div>
        </CardContent>
      </Card>

      {booking.quote && (
        <div className="mt-4">
          <QuoteView quote={booking.quote} bookingId={booking.id} />
        </div>
      )}

      {/* {booking.quote?.status === "ACCEPTED" && (
        <div className="mt-4">
          <Link href={`/checkout/${booking.id}`}>
            <Button className="w-full">Pay now</Button>
          </Link>
        </div>
      )} */}
      {booking.payment ? (
        <div className="mt-4">
          <PaymentDetails payment={booking.payment} />
        </div>
      ) : booking.status === "CONFIRMED" &&
        booking.quote?.status === "ACCEPTED" ? (
        <div className="mt-4">
          <Link href={`/checkout/${booking.id}`}>
            <Button className="w-full">Pay now</Button>
          </Link>
        </div>
      ) : null}

      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">
            Status history
          </h2>
        </CardHeader>
        <CardContent>
          <StatusTimeline
            history={booking.statusHistory}
            currentStatus={booking.status}
            variant="compact"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <ProtectedRoute>
      <BookingDetailContent />
    </ProtectedRoute>
  );
}
