// components/profile/AvailabilityEditor.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { DayAvailability, AvailabilitySlot } from "@/lib/api-types";

const DAYS: DayAvailability["day"][] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];
const DAY_LABELS: Record<DayAvailability["day"], string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

export function AvailabilityEditor({
  initial,
  onSave,
  isSaving,
}: {
  initial: DayAvailability[];
  onSave: (availability: DayAvailability[]) => void;
  isSaving: boolean;
}) {
  const [days, setDays] = useState<DayAvailability[]>(() =>
    DAYS.map((day) => initial.find((d) => d.day === day) ?? { day, slots: [] }),
  );

  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof AvailabilitySlot,
    value: string,
  ) => {
    setDays((prev) => {
      const next = [...prev];
      const slots = [...next[dayIndex].slots];
      slots[slotIndex] = { ...slots[slotIndex], [field]: value };
      next[dayIndex] = { ...next[dayIndex], slots };
      return next;
    });
  };

  const addSlot = (dayIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      if (next[dayIndex].slots.length >= 5) return prev;
      next[dayIndex] = {
        ...next[dayIndex],
        slots: [
          ...next[dayIndex].slots,
          { startTime: "09:00", endTime: "17:00" },
        ],
      };
      return next;
    });
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      next[dayIndex] = {
        ...next[dayIndex],
        slots: next[dayIndex].slots.filter((_, i) => i !== slotIndex),
      };
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {days.map((day, dayIndex) => (
        <div key={day.day} className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-slate-900">{DAY_LABELS[day.day]}</p>
            <button
              type="button"
              onClick={() => addSlot(dayIndex)}
              disabled={day.slots.length >= 5}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 disabled:opacity-40"
            >
              <Plus size={12} /> Add slot
            </button>
          </div>

          {day.slots.length === 0 ? (
            <p className="mt-1 text-sm text-slate-400">Not available</p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {day.slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      updateSlot(
                        dayIndex,
                        slotIndex,
                        "startTime",
                        e.target.value,
                      )
                    }
                    className="w-32"
                  />
                  <span className="text-slate-400">to</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      updateSlot(dayIndex, slotIndex, "endTime", e.target.value)
                    }
                    className="w-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(dayIndex, slotIndex)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label="Remove slot"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button
        onClick={() => onSave(days)}
        isLoading={isSaving}
        className="mt-2 self-start"
      >
        Save availability
      </Button>
    </div>
  );
}
