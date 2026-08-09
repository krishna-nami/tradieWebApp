// app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { MailCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { forgotPassword } from "@/lib/services/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation/auth";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data, variables) => {
      setSubmittedEmail(variables.email);
    },
    onError: (err) => {
      // Note: your backend never actually returns a "not found" error for this
      // endpoint (by design, to avoid leaking which emails are registered),
      // so this branch really only covers network/validation failures.
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong. Try again.")
        : "Something went wrong. Try again.";
      toast.error(message);
    },
  });

  if (submittedEmail) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader className="items-center">
            <MailCheck className="h-10 w-10 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">
              Check your email
            </h1>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              If an account exists for{" "}
              <span className="font-medium">{submittedEmail}</span>, we&apos;ve
              sent a link to reset your password.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm font-medium text-slate-900 hover:underline"
            >
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-xl font-bold text-slate-900">Forgot password?</h1>
          <p className="text-sm text-slate-500">
            Enter your email and we&apos;ll send you a link to reset it.
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="flex flex-col gap-4"
            noValidate
          >
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              isLoading={mutation.isPending}
              className="mt-2"
            >
              Send reset link
            </Button>
          </form>

          <Link
            href="/login"
            className="mt-4 flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
