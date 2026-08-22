// app/profile/page.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useProfileMutations } from "@/hooks/useProfileMutations";
import { getAvailability } from "@/lib/services/tradieProfile";
import { useQuery } from "@tanstack/react-query";

import {
  genericProfileSchema,
  type GenericProfileFormValues,
  tradieDetailsSchema,
  type TradieDetailsFormValues,
} from "@/lib/validation/profile";
import { TRADE_CATEGORIES } from "@/lib/validation/tradieProfile";
import { AvailabilityEditor } from "@/components/profile/AvailabilityEditor";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/Spinner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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

function formatTradeLabel(trade: string) {
  return trade
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function ProfileContent() {
  const user = useAuthStore((s) => s.user);
  const { data: meData, isLoading: meLoading } = useAuthCheck();
  const {
    saveGeneric,
    saveTradieDetails,
    addSpec,
    removeSpec,
    saveAvailability,
  } = useProfileMutations();

  const isTradie = user?.role === "TRADIE";

  // ---------- Generic profile form ----------
  const genericForm = useForm<GenericProfileFormValues>({
    resolver: zodResolver(genericProfileSchema),
    values: meData
      ? {
          firstName: meData.data.profile.firstName ?? "",
          lastName: meData.data.profile.lastName ?? "",
          phone: meData.data.profile.phone ?? "",
          addressLine1: meData.data.profile.addressLine1 ?? "",
          addressLine2: meData.data.profile.addressLine2 ?? "",
          suburb: meData.data.profile.suburb ?? "",
          state: (meData.data.profile.state ??
            "") as GenericProfileFormValues["state"],
          postcode: meData.data.profile.postcode ?? "",
        }
      : undefined,
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      suburb: "",
      state: "",
      postcode: "",
    },
  });

  // ---------- Tradie details form ----------
  const tradieForm = useForm<TradieDetailsFormValues>({
    resolver: zodResolver(tradieDetailsSchema),
    values: meData
      ? {
          bio: meData.data.profile.bio ?? "",
          licenceNo: meData.data.profile.licenceNo ?? "",
          isAvailable: meData.data.profile.isAvailable ?? true,
        }
      : undefined,

    defaultValues: { bio: "", licenceNo: "", isAvailable: true },
  });

  // ---------- Specialisations (add form) ----------
  const [newTrade, setNewTrade] = useState("");
  const [newYears, setNewYears] = useState("");
  const [newCert, setNewCert] = useState("");

  const handleAddSpec = () => {
    if (!newTrade) return;
    addSpec.mutate(
      {
        trade: newTrade,
        yearsExperience: newYears ? Number(newYears) : undefined,
        certification: newCert || undefined,
      },
      {
        onSuccess: () => {
          setNewTrade("");
          setNewYears("");
          setNewCert("");
        },
      },
    );
  };

  // ---------- Availability ----------
  const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
    queryKey: ["tradie", "availability"],
    queryFn: getAvailability,
    enabled: isTradie,
  });

  if (meLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>

      {/* Generic profile */}
      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">
            Basic details
          </h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={genericForm.handleSubmit((v) => saveGeneric.mutate(v))}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="firstName"
                control={genericForm.control}
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
                control={genericForm.control}
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
              name="phone"
              control={genericForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    placeholder="04XX XXX XXX"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="addressLine1"
                control={genericForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Address line 1</FieldLabel>
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
                control={genericForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Address line 2</FieldLabel>
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

            <div className="grid grid-cols-3 gap-3">
              <Controller
                name="suburb"
                control={genericForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Suburb</FieldLabel>
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
                control={genericForm.control}
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
                control={genericForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Postcode</FieldLabel>
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

            <Button
              type="submit"
              isLoading={saveGeneric.isPending}
              className="mt-2 self-start"
            >
              Save basic details
            </Button>
          </form>
        </CardContent>
      </Card>

      {isTradie && (
        <>
          {/* Tradie details */}
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">
                Trade details
              </h2>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={tradieForm.handleSubmit((v) =>
                  saveTradieDetails.mutate(v),
                )}
                className="flex flex-col gap-4"
                noValidate
              >
                <Controller
                  name="bio"
                  control={tradieForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                      <textarea
                        {...field}
                        id={field.name}
                        rows={3}
                        maxLength={500}
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                        Licence number
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
                  name="isAvailable"
                  control={tradieForm.control}
                  render={({ field }) => (
                    <Field>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        Currently accepting new jobs
                      </label>
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  isLoading={saveTradieDetails.isPending}
                  className="mt-2 self-start"
                >
                  Save trade details
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Specialisations */}
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">
                Specialisations
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {meData?.data.profile.specialisations?.map((spec: any) => (
                  <Badge
                    key={spec.id}
                    variant="accent"
                    className="flex items-center gap-1"
                  >
                    {formatTradeLabel(spec.trade)}
                    {spec.yearsExperience != null &&
                      ` · ${spec.yearsExperience}yr`}
                    <button
                      onClick={() => removeSpec.mutate(spec.id)}
                      aria-label="Remove"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Select
                  value={newTrade}
                  onValueChange={(v) => setNewTrade(v ?? "")}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADE_CATEGORIES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {formatTradeLabel(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newYears}
                  onChange={(e) => setNewYears(e.target.value)}
                  type="number"
                  placeholder="Years"
                  className="w-24"
                />
                <Input
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  placeholder="Certification (optional)"
                  className="w-48"
                />
                <Button
                  size="sm"
                  isLoading={addSpec.isPending}
                  disabled={!newTrade}
                  onClick={handleAddSpec}
                >
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">
                Availability
              </h2>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size={24} />
                </div>
              ) : (
                <AvailabilityEditor
                  initial={availabilityData?.data ?? []}
                  onSave={(availability) =>
                    saveAvailability.mutate(availability)
                  }
                  isSaving={saveAvailability.isPending}
                />
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
      <ProfileContent />
    </ProtectedRoute>
  );
}
