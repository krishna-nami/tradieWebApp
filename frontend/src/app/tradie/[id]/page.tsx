// app/tradie/[id]/page.tsx — updated to match flat shape
"use client";

import { useParams } from "next/navigation";
import { MapPin, BadgeCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useTradie } from "@/hooks/useTradie";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

function formatTradeLabel(trade: string) {
  return trade
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function TradieProfilePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTradie(params.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-slate-500">Tradie not found.</p>
        <Link
          href="/search"
          className="mt-4 inline-block text-sm font-medium text-slate-900 hover:underline"
        >
          Back to search
        </Link>
      </div>
    );
  }

  const tradie = data.data; // flat now — no .profile nesting
  const name = tradie.businessName || `${tradie.firstName} ${tradie.lastName}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar
              src={tradie.avatarUrl}
              name={`${tradie.firstName} ${tradie.lastName}`}
              size="lg"
              className="h-20 w-20 text-2xl"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                {tradie.isAvailable ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <BadgeCheck size={12} /> Available
                  </Badge>
                ) : (
                  <Badge variant="default">Not currently available</Badge>
                )}
              </div>

              {tradie.suburb && (
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin size={14} />
                  {tradie.suburb}
                  {tradie.state ? `, ${tradie.state}` : ""}
                </p>
              )}

              {tradie.licenceNo && (
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <ShieldCheck size={14} />
                  Licence No. {tradie.licenceNo}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {tradie.specialisations.map((s) => (
                  <Badge key={s.trade} variant="accent">
                    {formatTradeLabel(s.trade)}
                    {s.yearsExperience != null && ` · ${s.yearsExperience}yr`}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {tradie.bio && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <h2 className="text-sm font-semibold text-slate-900">About</h2>
              <p className="mt-1 text-sm text-slate-600">{tradie.bio}</p>
            </div>
          )}

          <div className="mt-6 border-t border-slate-100 pt-4">
            <Link href={`/book/${tradie.id}`}>
              <Button
                className="w-full sm:w-auto"
                disabled={!tradie.isAvailable}
              >
                {tradie.isAvailable
                  ? "Book this tradie"
                  : "Currently unavailable"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Reviews (ReviewList) and a real slot-based availability grid still need
          their own backend endpoints — isAvailable here is just a boolean toggle */}
    </div>
  );
}
