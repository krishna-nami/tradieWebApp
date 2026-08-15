// components/tradie/TradieCard.tsx
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { TradieSearchResult } from "@/lib/api-types";

function formatTradeLabel(trade: string) {
  return trade
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function TradieCard({ tradie }: { tradie: TradieSearchResult }) {
  const name = tradie.businessName || `${tradie.firstName} ${tradie.lastName}`;

  return (
    <Link href={`/tradie/${tradie.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex gap-4 p-4">
          <Avatar
            src={tradie.avatarUrl}
            name={`${tradie.firstName} ${tradie.lastName}`}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-slate-900">{name}</h3>
            {tradie.suburb && (
              <p className="flex items-center gap-1 text-sm text-slate-500">
                <MapPin size={14} />
                {tradie.suburb}
                {tradie.state ? `, ${tradie.state}` : ""}
              </p>
            )}
            {/* rating + hourlyRate go here once the backend exposes them */}
            {tradie.bio && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                {tradie.bio}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tradie.specialisations.slice(0, 3).map((s) => (
                <Badge key={s.trade}>{formatTradeLabel(s.trade)}</Badge>
              ))}
              {tradie.specialisations.length > 3 && (
                <Badge>+{tradie.specialisations.length - 3} more</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
