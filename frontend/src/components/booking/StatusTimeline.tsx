// components/booking/StatusTimeline.tsx
import {
  Check,
  Clock,
  XCircle,
  Loader2,
  CalendarCheck,
  Wrench,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BOOKING_STATUS_CONFIG,
  type BookingStatusValue,
} from "@/lib/booking-status";

// Map statuses to icons
const STATUS_ICONS: Record<BookingStatusValue, React.ElementType> = {
  PENDING: Clock,
  ACCEPTED: Loader2,
  CONFIRMED: CalendarCheck,
  IN_PROGRESS: Wrench,
  COMPLETED: Check,
  CANCELLED: XCircle,
  DECLINED: Ban,
};

interface StatusHistoryEntry {
  id: string;
  fromStatus: BookingStatusValue | null;
  toStatus: BookingStatusValue;
  changedBy: string;
  reason: string | null;
  createdAt: string;
}

interface StatusTimelineProps {
  history: StatusHistoryEntry[];
  currentStatus?: BookingStatusValue;
  variant?: "full" | "compact";
  className?: string;
  showChangedBy?: boolean;
  maxItems?: number;
}

export function StatusTimeline({
  history,
  currentStatus,
  variant = "full",
  className,
  showChangedBy = true,
  maxItems,
}: StatusTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
        <Clock className="w-8 h-8 mb-2" />
        <p className="text-sm">No status history yet</p>
      </div>
    );
  }

  // Sort events by timestamp (oldest first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // Limit history items if maxItems is provided
  const displayHistory = maxItems
    ? sortedHistory.slice(-maxItems)
    : sortedHistory;

  // Find index of current status (if provided)
  const currentIndex = currentStatus
    ? displayHistory.findIndex((e) => e.toStatus === currentStatus)
    : displayHistory.length - 1;

  const isCompact = variant === "compact";

  return (
    <ol className={cn("relative", isCompact ? "pl-3" : "pl-4", className)}>
      {/* Vertical connecting line */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200",
          isCompact ? "left-[9px]" : "left-[11px]",
        )}
      />

      {displayHistory.map((entry, index) => {
        const config = BOOKING_STATUS_CONFIG[entry.toStatus];
        const Icon = STATUS_ICONS[entry.toStatus];
        const isLast = index === displayHistory.length - 1;
        const isCurrent = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isPending = entry.toStatus === "PENDING";
        const isAnimated = isPending || entry.toStatus === "ACCEPTED";

        return (
          <li
            key={entry.id}
            className={cn(
              "relative",
              isCompact ? "pb-4" : "pb-6",
              isLast && "pb-0",
            )}
          >
            {/* Timeline dot with status indicator */}
            <span
              className={cn(
                "absolute flex items-center justify-center rounded-full border-2 border-white transition-all duration-300",
                isCompact ? "-left-[10px] h-3.5 w-3.5" : "-left-[13px] h-5 w-5",
                // Background color based on status
                isCompleted && "bg-green-500 border-green-500",
                isCurrent &&
                  !isCompleted &&
                  "bg-blue-500 border-blue-500 ring-4 ring-blue-100",
                !isCompleted &&
                  !isCurrent &&
                  config.className.replace(/text-.*?\s/, "").trim(),
                // Hover effect
                "hover:scale-110 cursor-pointer",
              )}
              title={`${config.label} - ${new Date(entry.createdAt).toLocaleString("en-AU")}`}
            >
              {isCompleted ? (
                <Check
                  className={cn(
                    "text-white",
                    isCompact ? "w-2 h-2" : "w-3 h-3",
                  )}
                />
              ) : isCurrent ? (
                <div
                  className={cn(
                    "bg-white rounded-full",
                    isCompact ? "w-1.5 h-1.5" : "w-2 h-2",
                    isAnimated && "animate-pulse",
                  )}
                />
              ) : (
                <Icon
                  className={cn(
                    "text-white",
                    isCompact ? "w-2 h-2" : "w-3 h-3",
                    entry.toStatus === "ACCEPTED" && "animate-spin",
                  )}
                />
              )}
            </span>

            {/* Content */}
            <div className={cn("flex flex-col", isCompact ? "ml-3" : "ml-4")}>
              {/* Status label and timestamp */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "font-semibold",
                    isCurrent ? "text-blue-600" : "text-slate-900",
                    isCompact ? "text-xs" : "text-sm",
                  )}
                >
                  {config.label}
                </span>

                {/* From status (if available) */}
                {entry.fromStatus && !isCompact && (
                  <span className="text-xs text-slate-400">
                    (from {BOOKING_STATUS_CONFIG[entry.fromStatus].label})
                  </span>
                )}

                {/* Current indicator */}
                {isCurrent && !isCompleted && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}

                {/* Timestamp */}
                <span
                  className={cn(
                    "text-slate-400",
                    isCompact ? "text-[10px]" : "text-xs",
                  )}
                >
                  {new Date(entry.createdAt).toLocaleString("en-AU", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {/* Reason/note */}
              {entry.reason && (
                <p
                  className={cn(
                    "text-slate-600",
                    isCompact ? "text-xs mt-0.5" : "text-sm mt-0.5",
                  )}
                >
                  {entry.reason}
                </p>
              )}

              {/* Changed by */}
              {entry.changedBy && showChangedBy && (
                <p
                  className={cn(
                    "text-slate-400",
                    isCompact ? "text-[10px] mt-0.5" : "text-xs mt-0.5",
                  )}
                >
                  By: {entry.changedBy}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
