// app/search/page.tsx
"use client";

import { LocateFixed } from "lucide-react";
import { useSearchFilters } from "@/store/searchFilters";
import { useTradieSearch } from "@/hooks/useTradieSearch";
import { TradieCard } from "@/components/tradie/TradieCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRADE_CATEGORIES } from "@/lib/validation/tradieProfile";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const {
    tradieType,
    suburb,
    radiusKm,
    lat,
    setFilters,
    setLocation,
    clearLocation,
  } = useSearchFilters();
  const { data, isLoading, isFetching, isError } = useTradieSearch();

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords.latitude, pos.coords.longitude),
      () => {}, // silently ignore denial for now
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Find a Tradie</h1>

      <div className="mt-4 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Trade type
          </label>
          <Select
            value={tradieType || "any"}
            onValueChange={(v) =>
              setFilters({ tradieType: v === "any" || v === null ? "" : v })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Any trade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any trade</SelectItem>
              {TRADE_CATEGORIES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t
                    .split("_")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Suburb</label>
          <Input
            value={suburb}
            onChange={(e) => setFilters({ suburb: e.target.value })}
            placeholder="e.g. Canberra"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Radius {lat !== null ? `— ${radiusKm}km` : ""}
          </label>
          {lat === null ? (
            <Button
              variant="outline"
              size="sm"
              className="mt-1 w-full"
              onClick={handleUseLocation}
            >
              <LocateFixed size={14} className="mr-1.5" />
              Use my location
            </Button>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <Slider
                value={[radiusKm]}
                onValueChange={(v) =>
                  setFilters({ radiusKm: Array.isArray(v) ? v[0] : v })
                }
                min={5}
                max={200}
                step={5}
              />
              <button
                onClick={clearLocation}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size={28} />
          </div>
        ) : isError ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Something went wrong. Try again.
          </p>
        ) : data && data.data.results.length > 0 ? (
          <div
            className={cn(
              "grid gap-4 sm:grid-cols-2",
              isFetching && "opacity-60 transition-opacity",
            )}
          >
            {data.data.results.map((t) => (
              <TradieCard key={t.id} tradie={t} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-slate-500">
            No tradies found. Try widening your search.
          </p>
        )}
      </div>
    </div>
  );
}
