// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { setAccesstoken } from "@/lib/api";
import { loginUser as _unused, registerUser } from "@/lib/services/auth"; // adjust path to wherever loginUser/registerUser actually live
import { createTradieProfile } from "@/lib/services/tradieProfile";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/auth";
import {
  tradieProfileSchema,
  TRADE_CATEGORIES,
  type TradieProfileFormValues,
} from "@/lib/validation/tradieProfile";
import type { ApiResponse, RegisterData } from "@/lib/api-types";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/Spinner";

const AU_STATES = [
  "ACT",
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
] as const;

type Step = "account" | "tradie-profile";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get("role");
  const initilaRole = roleFromUrl === "tradie" ? "TRADIE" : "CUSTOMER";
  const [showAddress, setShowAddress] = useState(false);
  const [step, setStep] = useState<Step>("account");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  // ---------- Step 1: Account ----------
  const accountForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: initilaRole,
      password: "",
      confirmPassword: "",
      addressLine1: "",
      addressLine2: "",
      suburb: "",
      state: "",
      postcode: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data, variables) => {
      setPendingEmail(variables.email);

      if (variables.role === "TRADIE") {
        // Temporarily hold the token in memory ONLY to authenticate the
        // profile-setup call — never persisted to Zustand/localStorage.
        setAccesstoken(data.data.accesstoken);
        setStep("tradie-profile");
      } else {
        toast.success(data.message);
        router.push(
          `/verify-email?email=${encodeURIComponent(variables.email)}`,
        );
      }
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Registration failed. Try again.")
        : "Something went wrong. Try again.";
      toast.error(message);
    },
  });

  // ---------- Step 2: Tradie profile ----------
  const tradieForm = useForm<TradieProfileFormValues>({
    resolver: zodResolver(tradieProfileSchema),
    defaultValues: { abn: "", licenceNo: "", trades: [], bio: "" },
  });

  const tradieProfileMutation = useMutation({
    mutationFn: createTradieProfile,
    onSuccess: () => {
      setAccesstoken(null); // clear — we still don't auto-login per your earlier call
      toast.success("Profile created — verify your email to finish up.");
      router.push(`/verify-email?email=${encodeURIComponent(pendingEmail)}`);
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? "Could not save your trade profile.")
        : "Something went wrong. Try again.";
      toast.error(message);
    },
  });

  const skipProfileSetup = () => {
    setAccesstoken(null);
    router.push(`/verify-email?email=${encodeURIComponent(pendingEmail)}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-lg">
        {step === "account" ? (
          <>
            <CardHeader>
              <h1 className="text-xl font-bold text-slate-900">
                Create your account
              </h1>
              <p className="text-sm text-slate-500">
                Join TradieHub as a customer or tradie
              </p>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={accountForm.handleSubmit((v) =>
                  registerMutation.mutate(v),
                )}
                className="flex flex-col gap-4"
                noValidate
              >
                <Controller
                  name="role"
                  control={accountForm.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>I am a</FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-2 gap-3"
                      >
                        <label className="flex items-center gap-2 rounded-md border border-slate-300 p-3 text-sm has-[[data-state=checked]]:border-slate-900">
                          <RadioGroupItem value="CUSTOMER" />
                          Customer
                        </label>
                        <label className="flex items-center gap-2 rounded-md border border-slate-300 p-3 text-sm has-[[data-state=checked]]:border-slate-900">
                          <RadioGroupItem value="TRADIE" />
                          Tradie
                        </label>
                      </RadioGroup>
                    </Field>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Controller
                    name="firstName"
                    control={accountForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={accountForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="email"
                  control={accountForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="phone"
                  control={accountForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Phone (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="tel"
                        placeholder="04XX XXX XXX"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="addressLine1"
                  control={accountForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Address line 1 (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="addressLine2"
                  control={accountForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Address line 2 (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="grid grid-cols-3 gap-3">
                  <Controller
                    name="suburb"
                    control={accountForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Suburb (optional)
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="state"
                    control={accountForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>State</FieldLabel>
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            {AU_STATES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="postcode"
                    control={accountForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Postcode (optional)
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          maxLength={4}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="password"
                  control={accountForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={accountForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Confirm password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id={field.name}
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          aria-label={
                            showConfirm ? "Hide password" : "Show password"
                          }
                          tabIndex={-1}
                        >
                          {showConfirm ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Button
                  type="submit"
                  isLoading={registerMutation.isPending}
                  className="mt-2"
                >
                  Continue
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-slate-900 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <h1 className="text-xl font-bold text-slate-900">
                Set up your trade profile
              </h1>
              <p className="text-sm text-slate-500">
                Helps customers find and trust you. You can edit this later.
              </p>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={tradieForm.handleSubmit((v) =>
                  tradieProfileMutation.mutate(v),
                )}
                className="flex flex-col gap-4"
                noValidate
              >
                <Controller
                  name="trades"
                  control={tradieForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Your trades (select up to 10)</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {TRADE_CATEGORIES.map((trade) => {
                          const selected = field.value.includes(trade);
                          return (
                            <button
                              key={trade}
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  selected
                                    ? field.value.filter((t) => t !== trade)
                                    : [...field.value, trade],
                                )
                              }
                              className={cn(
                                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                                selected
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-300 text-slate-700 hover:border-slate-400",
                              )}
                            >
                              {selected && <Check size={14} />}
                              {trade.charAt(0) + trade.slice(1).toLowerCase()}
                            </button>
                          );
                        })}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="abn"
                  control={tradieForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        ABN (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="11 digit ABN"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="licenceNo"
                  control={tradieForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Licence number (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="bio"
                  control={tradieForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Bio (optional)
                      </FieldLabel>
                      <textarea
                        {...field}
                        id={field.name}
                        rows={3}
                        maxLength={500}
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Tell customers a bit about your experience..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="mt-2 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={skipProfileSetup}
                  >
                    Skip for now
                  </Button>
                  <Button
                    type="submit"
                    isLoading={tradieProfileMutation.isPending}
                    className="flex-1"
                  >
                    Finish setup
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Spinner size={28} />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
