// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { useBookingStats } from "@/hooks/useBookingStats";
import { useBookings } from "@/hooks/useBookings";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const STAT_CARDS: {
  status: "PENDING" | "ACCEPTED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED";
  label: string;
}[] = [
  { status: "PENDING", label: "New requests" },
  { status: "ACCEPTED", label: "Awaiting quote" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "COMPLETED", label: "Completed" },
];

function formatTradeLabel(trade: string) {
  return trade
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function DashboardContent() {
  const { counts, isLoading: statsLoading } = useBookingStats();
  // Upcoming = confirmed jobs with a scheduled date, most imminent first
  const { data: upcomingData, isLoading: upcomingLoading } = useBookings(
    "CONFIRMED",
    1,
  );
  const { data: pendingData, isLoading: pendingLoading } = useBookings(
    "PENDING",
    1,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STAT_CARDS.map(({ status, label }) => (
          <Link key={status} href={`/jobs?status=${status}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-slate-900">
                  {statsLoading ? "—" : counts[status]}
                </p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">New requests</h2>
          <Link
            href="/jobs?status=PENDING"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            View all
          </Link>
        </div>
        <div className="mt-3">
          {pendingLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size={24} />
            </div>
          ) : pendingData && pendingData.data.bookings.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pendingData.data.bookings.slice(0, 3).map((booking) => (
                <Link key={booking.id} href={`/jobs/${booking.id}`}>
                  <Card className="border-amber-200 transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {booking.job.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            From {booking.customer.profile.firstName}{" "}
                            {booking.customer.profile.lastName}
                          </p>
                        </div>
                        <BookingStatus status={booking.status} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-4 text-sm text-slate-400">
              No new requests right now.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Upcoming jobs
          </h2>
          <Link
            href="/jobs"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            View all
          </Link>
        </div>

        <div className="mt-3">
          {upcomingLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size={24} />
            </div>
          ) : upcomingData && upcomingData.data.bookings.length > 0 ? (
            <div className="flex flex-col gap-3">
              {upcomingData.data.bookings
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.scheduledAt).getTime() -
                    new Date(b.scheduledAt).getTime(),
                )
                .slice(0, 5)
                .map((booking) => (
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
                            {new Date(booking.scheduledAt).toLocaleString(
                              "en-AU",
                              { dateStyle: "medium", timeStyle: "short" },
                            )}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-slate-400">
              <Briefcase className="mb-2 h-8 w-8" />
              <p className="text-sm">No upcoming confirmed jobs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["TRADIE"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
