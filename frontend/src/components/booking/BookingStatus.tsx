// components/booking/BookingStatus.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  BOOKING_STATUS_CONFIG,
  type BookingStatusValue,
} from "@/lib/booking-status";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarCheck,
  Wrench,
  Ban,
} from "lucide-react";

// Map statuses to icons
const STATUS_ICONS: Record<BookingStatusValue, React.ElementType> = {
  PENDING: Clock,
  ACCEPTED: Loader2,
  CONFIRMED: CalendarCheck,
  IN_PROGRESS: Wrench,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
  DECLINED: Ban,
};

// Map statuses to descriptions
const STATUS_DESCRIPTIONS: Record<BookingStatusValue, string> = {
  PENDING: "Waiting for tradie to respond",
  ACCEPTED: "Tradie has accepted your job",
  CONFIRMED: "Job confirmed and scheduled",
  IN_PROGRESS: "Work is currently in progress",
  COMPLETED: "Job completed successfully",
  CANCELLED: "Booking was cancelled",
  DECLINED: "Tradie declined the job",
};

interface BookingStatusProps {
  status: BookingStatusValue;
  className?: string;
  showIcon?: boolean;
  showDescription?: boolean;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function BookingStatus({
  status,
  className,
  showIcon = true,
  showDescription = false,
  size = "md",
  animate = true,
}: BookingStatusProps) {
  const config = BOOKING_STATUS_CONFIG[status];
  const Icon = STATUS_ICONS[status];
  const description = STATUS_DESCRIPTIONS[status];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const isAnimated = animate && (status === "PENDING" || status === "ACCEPTED");

  return (
    <div className="flex flex-col gap-1">
      <span
        className={cn(
          "inline-flex items-center rounded-full font-medium border transition-all duration-200",
          sizeClasses[size],
          config.className,
          // Add border based on status for better visibility
          status === "PENDING" && "border-amber-200",
          status === "ACCEPTED" && "border-blue-200",
          status === "CONFIRMED" && "border-emerald-200",
          status === "IN_PROGRESS" && "border-indigo-200",
          status === "COMPLETED" && "border-green-200",
          status === "CANCELLED" && "border-slate-200",
          status === "DECLINED" && "border-red-200",
          // Hover effect
          "hover:scale-105 hover:shadow-sm",
          className,
        )}
      >
        {showIcon && (
          <Icon
            className={cn(
              iconSizes[size],
              isAnimated && status === "ACCEPTED" && "animate-spin",
              isAnimated && status === "PENDING" && "animate-pulse",
            )}
          />
        )}
        {config.label}
      </span>

      {showDescription && (
        <p className="text-xs text-slate-500 ml-1">{description}</p>
      )}
    </div>
  );
}
