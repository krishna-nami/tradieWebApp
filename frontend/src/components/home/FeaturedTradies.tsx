// components/home/FeaturedTradies.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { searchTradies } from "@/lib/services/tradie";
import { TradieCard } from "@/components/tradie/TradieCard";
import { Spinner } from "@/components/ui/Spinner";

export function FeaturedTradies() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tradies", "featured"],
    queryFn: () => searchTradies({ page: 1, limit: 8 }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size={24} />
      </div>
    );
  }

  if (isError || !data || data.data.results.length === 0) {
    return null; // quietly hide the section rather than show an empty/broken carousel
  }

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
      {data.data.results.map((tradie) => (
        <div key={tradie.id} className="w-72 shrink-0 snap-start">
          <TradieCard tradie={tradie} />
        </div>
      ))}
    </div>
  );
}
