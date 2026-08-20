// app/jobs/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useBookingActions } from "@/hooks/useBookingActions";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { getAvailableActions } from "@/lib/booking-status";
import {
  BOOKING_STATUSES,
  type BookingStatusValue,
} from "@/lib/booking-status";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function formatTradeLabel(trade: string) {
  return trade
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function JobActionButtons({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatusValue;
}) {
  const router = useRouter();
  const { accept, decline, start, complete } = useBookingActions(bookingId);
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const availableActions = getAvailableActions(status, "TRADIE");
  if (availableActions.length === 0) return null;

  return (
    <div
      className="mt-3 flex flex-col gap-2"
      onClick={(e) => e.stopPropagation()}
    >
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
              size="sm"
              isLoading={decline.isPending}
              disabled={!declineReason.trim()}
              onClick={() => decline.mutate(declineReason)}
            >
              Confirm decline
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDecline(false)}
            >
              Cancel
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
                  size="sm"
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
                  size="sm"
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
                  size="sm"
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
                  size="sm"
                  isLoading={complete.isPending}
                  onClick={() => complete.mutate()}
                >
                  Mark complete
                </Button>
              );
            }
            return null;
          })}
          {status === "ACCEPTED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/jobs/${bookingId}`)}
            >
              Build quote
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function JobsList() {
  const [statusFilter, setStatusFilter] = useState<
    BookingStatusValue | undefined
  >();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useBookings(
    statusFilter,
    page,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Incoming Jobs</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setStatusFilter(undefined);
            setPage(1);
          }}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            !statusFilter
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 text-slate-600 hover:border-slate-400",
          )}
        >
          All
        </button>
        {BOOKING_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              statusFilter === s
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-600 hover:border-slate-400",
            )}
          >
            {s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size={28} />
          </div>
        ) : isError ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Something went wrong. Try again.
          </p>
        ) : data && data.data.bookings.length > 0 ? (
          <div
            className={cn(
              "flex flex-col gap-3",
              isFetching && "opacity-60 transition-opacity",
            )}
          >
            {data.data.bookings.map((booking) => (
              <Link key={booking.id} href={`/jobs/${booking.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {booking.job.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatTradeLabel(booking.job.category)}
                        </p>
                      </div>
                      <BookingStatus status={booking.status} />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {booking.job.suburb}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(booking.scheduledAt).toLocaleDateString(
                          "en-AU",
                          { dateStyle: "medium" },
                        )}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      From{" "}
                      <span className="font-medium">
                        {booking.customer.profile.firstName}{" "}
                        {booking.customer.profile.lastName}
                      </span>
                      {" · "}
                      Est. ${Number(booking.totalAmount).toFixed(2)}
                    </p>

                    <JobActionButtons
                      bookingId={booking.id}
                      status={booking.status}
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-slate-500">
            No jobs found.
          </p>
        )}

        {data && data.data.pagination.total > data.data.pagination.limit && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                page * data.data.pagination.limit >= data.data.pagination.total
              }
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <ProtectedRoute allowedRoles={["TRADIE"]}>
      <JobsList />
    </ProtectedRoute>
  );
}
