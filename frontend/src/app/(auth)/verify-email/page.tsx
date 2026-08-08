// app/(auth)/verify-email/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="items-center">
          <MailCheck className="h-10 w-10 text-amber-500" />
          <h1 className="text-xl font-bold text-slate-900">Check your email</h1>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            We&apos;ve sent a verification link{" "}
            {email && (
              <>
                to <span className="font-medium">{email}</span>
              </>
            )}
            . Please verify your account before logging in.
          </p>
          <Button className="mt-6 w-full" onClick={() => router.push("/login")}>
            Go to login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
