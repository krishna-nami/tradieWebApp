// components/booking/AddressFields.tsx
"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface AddressFieldsProps<T extends FieldValues = any> {
  control: Control<T>;
  prefix?: string;
}

export function AddressFields<T extends FieldValues>({
  control,
  prefix = "",
}: AddressFieldsProps<T>) {
  const suburbName = prefix ? `${prefix}.suburb` : "suburb";
  const stateName = prefix ? `${prefix}.state` : "state";
  const postcodeName = prefix ? `${prefix}.postcode` : "postcode";

  return (
    <div className="grid grid-cols-3 gap-3">
      <Controller
        name={suburbName as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Suburb</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="e.g. Sydney"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name={stateName as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>State</FieldLabel>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name={postcodeName as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Postcode</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              maxLength={4}
              placeholder="e.g. 2000"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
