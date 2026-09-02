// app/onboarding/page.tsx
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, Clock, ExternalLink } from "lucide-react";
import {
  getConnectStatus,
  getConnectOnboardingLink,
} from "@/lib/services/payment";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function OnboardingContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["connect", "status"],
    queryFn: getConnectStatus,
  });

  const onboardMutation = useMutation({
    mutationFn: getConnectOnboardingLink,
    onSuccess: (data) => {
      window.location.href = data.data.url;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  const status = data?.data;
  const isFullySetUp = status?.chargesEnabled && status?.payoutsEnabled;

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Get paid with Stripe
      </h1>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Payout status
            </h2>
            {isFullySetUp ? (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 size={12} /> Ready
              </Badge>
            ) : (
              <Badge variant="warning" className="flex items-center gap-1">
                <Clock size={12} />{" "}
                {status?.onboarded ? "In progress" : "Not started"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Account created</span>
              <span
                className={
                  status?.onboarded ? "text-green-600" : "text-slate-400"
                }
              >
                {status?.onboarded ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Can accept charges</span>
              <span
                className={
                  status?.chargesEnabled ? "text-green-600" : "text-slate-400"
                }
              >
                {status?.chargesEnabled ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Can receive payouts</span>
              <span
                className={
                  status?.payoutsEnabled ? "text-green-600" : "text-slate-400"
                }
              >
                {status?.payoutsEnabled ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {!isFullySetUp && (
            <Button
              className="mt-4 w-full"
              isLoading={onboardMutation.isPending}
              onClick={() => onboardMutation.mutate()}
            >
              {status?.onboarded ? "Continue setup" : "Start onboarding"}
              <ExternalLink size={14} className="ml-1.5" />
            </Button>
          )}

          {!isFullySetUp && (
            <p className="mt-2 text-center text-xs text-slate-400">
              You&apos;ll be redirected to Stripe to verify your details.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={["TRADIE"]}>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
