// app/bookings/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { BookingStatus } from "@/components/booking/BookingStatus";
import {
  BOOKING_STATUSES,
  type BookingStatusValue,
} from "@/lib/booking-status";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { cn } from "@/lib/utils";

function formatTradeLabel(trade: string) {
  return trade
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function BookingsList() {
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
      <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>

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
              <Link key={booking.id} href={`/bookings/${booking.id}`}>
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
                      With{" "}
                      <span className="font-medium">
                        {booking.tradie.profile.firstName}{" "}
                        {booking.tradie.profile.lastName}
                      </span>
                      {" · "}${Number(booking.totalAmount).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-slate-500">
            No bookings found.
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

export default function BookingsPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <BookingsList />
    </ProtectedRoute>
  );
}
