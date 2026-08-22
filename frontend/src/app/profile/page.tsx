// app/profile/page.tsx — new read-only view
"use client";

import Link from "next/link";
import { Pencil, MapPin, Phone, ShieldCheck, BadgeCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useQuery } from "@tanstack/react-query";
import { getAvailability } from "@/lib/services/tradieProfile";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const DAY_LABELS: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

function formatTradeLabel(trade: string) {
  return trade
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function ProfileViewContent() {
  const user = useAuthStore((s) => s.user);
  const { data: meData, isLoading } = useAuthCheck();
  const isTradie = user?.role === "TRADIE";

  const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
    queryKey: ["tradie", "availability"],
    queryFn: getAvailability,
    enabled: isTradie,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  const profile = meData?.data.profile;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <Link href="/profile/edit">
          <Button variant="outline" size="sm">
            <Pencil size={14} className="mr-1.5" /> Edit
          </Button>
        </Link>
      </div>

      <Card className="mt-4">
        <CardContent className="flex items-start gap-4 p-4">
          <Avatar
            src={profile?.avatarUrl}
            name={`${profile?.firstName} ${profile?.lastName}`}
            size="lg"
            className="h-20 w-20 text-2xl"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {profile?.firstName} {profile?.lastName}
              </h2>
              {isTradie &&
                (profile?.isAvailable ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <BadgeCheck size={12} /> Available
                  </Badge>
                ) : (
                  <Badge variant="default">Not available</Badge>
                ))}
            </div>

            <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500">
              {profile?.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {profile.phone}
                </span>
              )}
              {profile?.suburb && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {profile.suburb}
                  {profile.state ? `, ${profile.state}` : ""}{" "}
                  {profile.postcode ?? ""}
                </span>
              )}
              {isTradie && profile?.licenceNo && (
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} /> Licence No. {profile.licenceNo}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isTradie && (
        <>
          {profile?.bio && (
            <Card className="mt-4">
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">About</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{profile.bio}</p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">
                Specialisations
              </h2>
            </CardHeader>
            <CardContent>
              {profile?.specialisations &&
              profile.specialisations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.specialisations.map((spec) => (
                    <Badge key={spec.id} variant="accent">
                      {formatTradeLabel(spec.trade)}
                      {spec.yearsExperience != null &&
                        ` · ${spec.yearsExperience}yr`}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No specialisations added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">
                Availability
              </h2>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner size={20} />
                </div>
              ) : availabilityData &&
                availabilityData.data.some((d) => d.slots.length > 0) ? (
                <div className="flex flex-col gap-1 text-sm">
                  {availabilityData.data
                    .filter((d) => d.slots.length > 0)
                    .map((d) => (
                      <div
                        key={d.day}
                        className="flex justify-between text-slate-600"
                      >
                        <span className="font-medium">{DAY_LABELS[d.day]}</span>
                        <span>
                          {d.slots
                            .map((s) => `${s.startTime}–${s.endTime}`)
                            .join(", ")}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No availability set yet.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileViewContent />
    </ProtectedRoute>
  );
}
