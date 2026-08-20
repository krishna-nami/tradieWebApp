// app/book/[tradieId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { useTradie } from "@/hooks/useTradie";
import { BookingForm } from "@/components/booking/BookingForm";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function BookTradiePage() {
  const params = useParams<{ tradieId: string }>();
  const { data, isLoading, isError } = useTradie(params.tradieId);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Request a booking</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size={28} />
          </div>
        ) : isError || !data ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Tradie not found.
          </p>
        ) : (
          <>
            <Card className="mt-4">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar
                  src={data.data.avatarUrl}
                  name={`${data.data.firstName} ${data.data.lastName}`}
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {data.data.businessName ||
                      `${data.data.firstName} ${data.data.lastName}`}
                  </p>
                  {data.data.suburb && (
                    <p className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin size={14} />
                      {data.data.suburb}
                      {data.data.state ? `, ${data.data.state}` : ""}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">
                  Job details
                </h2>
              </CardHeader>
              <CardContent>
                <BookingForm
                  tradieId={data.data.userId}
                  tradieTrades={data.data.specialisations.map((s) => s.trade)}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
