// hooks/useRecentSearches.ts
"use client";

import { useEffect, useState } from "react";

interface RecentSearch {
  tradeType: string;
  suburb: string;
  label: string;
}

const STORAGE_KEY = "tradiehub-recent-searches";
const MAX_RECENT = 5;

export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage
    }
  }, []);

  const addSearch = (search: RecentSearch) => {
    setRecent((prev) => {
      const deduped = prev.filter(
        (s) =>
          !(s.tradeType === search.tradeType && s.suburb === search.suburb),
      );
      const next = [search, ...deduped].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore quota/blocked errors
      }
      return next;
    });
  };

  return { recent, addSearch };
}
