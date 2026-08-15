import { useQuery } from "@tanstack/react-query";
import { getTradieById } from "@/lib/services/tradie";

export function useTradie(id: string) {
  return useQuery({
    queryKey: ["tradies", id],
    queryFn: () => getTradieById(id),
    enabled: !!id,
  });
}
