// app/earnings/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { listPayouts } from "@/lib/services/payment";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function EarningsContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["payouts"],
    queryFn: listPayouts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  const payouts = data?.data.payouts ?? [];
  const totalEarned = data?.data.totalEarned ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Earnings</h1>

      <Card className="mt-4 border-slate-900 bg-slate-900">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-slate-900">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total earned</p>
            <p className="text-3xl font-bold text-white">
              ${totalEarned.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Per-job breakdown
        </h2>
        {payouts.length === 0 ? (
          <p className="mt-4 py-8 text-center text-sm text-slate-400">
            No payouts yet — they&apos;ll show up here once you complete paid
            jobs.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {payouts.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {p.booking.job.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString("en-AU", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    ${Number(p.amount).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EarningsPage() {
  return (
    <ProtectedRoute allowedRoles={["TRADIE"]}>
      <EarningsContent />
    </ProtectedRoute>
  );
}
