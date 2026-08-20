// components/quote/LineItemRow.tsx
"use client";

import { Trash2 } from "lucide-react";
import {
  Controller,
  type Control,
  type UseFieldArrayRemove,
} from "react-hook-form";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import type { QuoteBuilderFormValues } from "@/lib/validation/quote";

interface LineItemRowProps {
  index: number;
  control: Control<QuoteBuilderFormValues>;
  remove: UseFieldArrayRemove;
  canRemove: boolean;
}

export function LineItemRow({
  index,
  control,
  remove,
  canRemove,
}: LineItemRowProps) {
  return (
    <div className="grid grid-cols-12 items-start gap-2 border-b border-slate-100 py-3">
      <div className="col-span-3">
        <Controller
          name={`lineItems.${index}.type`}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LABOUR">Labour</SelectItem>
                <SelectItem value="MATERIAL">Material</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="col-span-4">
        <Controller
          name={`lineItems.${index}.description`}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder="Description"
              aria-invalid={fieldState.invalid}
            />
          )}
        />
      </div>

      <div className="col-span-2">
        <Controller
          name={`lineItems.${index}.quantity`}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="number"
              min={1}
              placeholder="Qty"
              aria-invalid={fieldState.invalid}
            />
          )}
        />
      </div>

      <div className="col-span-2">
        <Controller
          name={`lineItems.${index}.unitPrice`}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="number"
              min={0}
              step="0.01"
              placeholder="Unit price"
              aria-invalid={fieldState.invalid}
            />
          )}
        />
      </div>

      <div className="col-span-1 flex justify-end pt-1.5">
        <button
          type="button"
          onClick={() => remove(index)}
          disabled={!canRemove}
          className="text-slate-400 hover:text-red-600 disabled:opacity-30"
          aria-label="Remove line item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
