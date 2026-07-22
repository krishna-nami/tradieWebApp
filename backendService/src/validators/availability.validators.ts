import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const slotSchema = z
  .object({
    startTime: z
      .string()
      .regex(timeRegex, "Invalid time format, expected HH:mm"),
    endTime: z.string().regex(timeRegex, "Invalid time format, expected HH:mm"),
  })
  .refine((s) => s.startTime < s.endTime, {
    message: "start time must be before end time",
    path: ["startTime"],
  });

const daySchema = z
  .object({
    day: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]),
    slots: z.array(slotSchema).max(5, "too many slots for one day"),
  })
  .refine(
    (d) => {
      const sorted = [...d.slots].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        if (!prev || !curr) continue;
        if (curr.startTime < prev.endTime) return false;
      }
      return true;
    },
    { message: "Slots must not overlap", path: ["slots"] },
  );

export const availabilitySchema = z.object({
  availability: z.array(daySchema).length(7, "Must provide all 7 days"),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;
