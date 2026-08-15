// hooks/useTradieSearch.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchTradies } from "@/lib/services/tradie";
import { useSearchFilters } from "@/store/searchFilters";
import { useDebouncedValue } from "./useDebouncedValue";

export function useTradieSearch() {
  const { tradieType, suburb, radiusKm, lat, lng, page } = useSearchFilters();
  const debouncedSuburb = useDebouncedValue(suburb, 400);

  const params = {
    tradieType: tradieType || undefined,
    suburb: debouncedSuburb || undefined,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
    radiusKm: lat !== null && lng !== null ? radiusKm : undefined, // only send if we have a real location
    page,
    limit: 20,
  };

  return useQuery({
    queryKey: ["tradies", "search", params],
    queryFn: () => searchTradies(params),
    placeholderData: keepPreviousData, // avoids loading flash when paging/filtering
  });
}
