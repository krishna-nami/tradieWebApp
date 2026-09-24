// components/booking/PaymentDetails.tsx
import { CheckCircle2, Clock, XCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BookingDetail } from "@/lib/api-types";

const STATUS_CONFIG: Record<
  NonNullable<BookingDetail["payment"]>["status"],
  {
    label: string;
    icon: React.ElementType;
    variant: "success" | "warning" | "danger" | "default";
  }
> = {
  PENDING: { label: "Payment pending", icon: Clock, variant: "warning" },
  PROCESSING: { label: "Processing", icon: Clock, variant: "warning" },
  SUCCEEDED: { label: "Paid", icon: CheckCircle2, variant: "success" },
  FAILED: { label: "Payment failed", icon: XCircle, variant: "danger" },
  REFUNDED: { label: "Refunded", icon: RefreshCcw, variant: "default" },
};

export function PaymentDetails({
  payment,
}: {
  payment: NonNullable<BookingDetail["payment"]>;
}) {
  const config = STATUS_CONFIG[payment.status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Payment</h2>
        <Badge variant={config.variant} className="flex items-center gap-1">
          <Icon size={12} /> {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Amount paid</span>
          <span className="font-medium text-slate-900">
            ${Number(payment.amount).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Date</span>
          <span className="text-slate-700">
            {new Date(payment.updatedAt).toLocaleString("en-AU", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Reference</span>
          <span className="font-mono text-xs text-slate-500">
            {payment.stripePaymentId.slice(0, 20)}...
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
