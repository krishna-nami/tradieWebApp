// hooks/useAuthCheck.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/services/auth";
import { useAuthStore } from "@/store/authStore";

export function useAuthCheck() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: hasHydrated && isAuthenticated, // only bother asking if we think we're logged in
    retry: false, // a 401 here means "not logged in", not "network blip" — don't retry
    staleTime: 5 * 60 * 1000, // trust it for 5 min before re-checking
  });
}
