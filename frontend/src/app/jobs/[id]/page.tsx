// app/jobs/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, Calendar, DollarSign, User } from "lucide-react";
import { useBooking } from "@/hooks/useBookings";
import { useBookingActions } from "@/hooks/useBookingActions";
import { getAvailableActions } from "@/lib/booking-status";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { StatusTimeline } from "@/components/booking/StatusTimeline";
import { QuoteView } from "@/components/booking/QuoteView";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function JobDetailContent() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBooking(params.id);
  const { accept, decline, start, complete, cancel } = useBookingActions(
    params.id,
  );

  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="py-16 text-center text-sm text-slate-500">Job not found.</p>
    );
  }

  const booking = data.data;
  const availableActions = getAvailableActions(booking.status, "TRADIE");
  const canBuildQuote = booking.status === "ACCEPTED" && !booking.quote;

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
              <User size={14} /> {booking.customer.profile.firstName}{" "}
              {booking.customer.profile.lastName}
            </span>
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

      {/* Status action buttons */}
      {availableActions.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            {showDecline ? (
              <div className="flex flex-col gap-2">
                <Input
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Reason for declining"
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    isLoading={decline.isPending}
                    disabled={!declineReason.trim()}
                    onClick={() => decline.mutate(declineReason)}
                  >
                    Confirm decline
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDecline(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : showCancel ? (
              <div className="flex flex-col gap-2">
                <Input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for cancelling"
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    isLoading={cancel.isPending}
                    disabled={!cancelReason.trim()}
                    onClick={() => cancel.mutate(cancelReason)}
                  >
                    Confirm cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancel(false)}
                  >
                    Back
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableActions.map((action) => {
                  if (action.key === "accept") {
                    return (
                      <Button
                        key="accept"
                        isLoading={accept.isPending}
                        onClick={() => accept.mutate(undefined)}
                      >
                        Accept
                      </Button>
                    );
                  }
                  if (action.key === "decline") {
                    return (
                      <Button
                        key="decline"
                        variant="outline"
                        onClick={() => setShowDecline(true)}
                      >
                        Decline
                      </Button>
                    );
                  }
                  if (action.key === "start") {
                    return (
                      <Button
                        key="start"
                        isLoading={start.isPending}
                        onClick={() => start.mutate()}
                      >
                        Start job
                      </Button>
                    );
                  }
                  if (action.key === "complete") {
                    return (
                      <Button
                        key="complete"
                        isLoading={complete.isPending}
                        onClick={() => complete.mutate()}
                      >
                        Mark complete
                      </Button>
                    );
                  }
                  if (action.key === "cancel") {
                    return (
                      <Button
                        key="cancel"
                        variant="outline"
                        onClick={() => setShowCancel(true)}
                      >
                        Cancel
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quote: builder if none exists yet and booking is accepted, otherwise show what was sent */}
      {canBuildQuote && (
        <div className="mt-4">
          <QuoteBuilder bookingId={booking.id} />
        </div>
      )}

      {booking.quote && (
        <div className="mt-4">
          <QuoteView quote={booking.quote} bookingId={booking.id} readOnly />
        </div>
      )}

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

export default function JobDetailPage() {
  return (
    <ProtectedRoute allowedRoles={["TRADIE"]}>
      <JobDetailContent />
    </ProtectedRoute>
  );
}
