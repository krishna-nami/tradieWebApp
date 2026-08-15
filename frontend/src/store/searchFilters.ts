// store/searchFilters.ts
import { create } from "zustand";

interface SearchFiltersState {
  tradieType: string; // '' = any
  suburb: string;
  radiusKm: number;
  lat: number | null;
  lng: number | null;
  page: number;
  setFilters: (
    partial: Partial<
      Pick<SearchFiltersState, "tradieType" | "suburb" | "radiusKm">
    >,
  ) => void;
  setLocation: (lat: number, lng: number) => void;
  clearLocation: () => void;
  setPage: (page: number) => void;
}

export const useSearchFilters = create<SearchFiltersState>((set) => ({
  tradieType: "",
  suburb: "",
  radiusKm: 25,
  lat: null,
  lng: null,
  page: 1,
  setFilters: (partial) => set({ ...partial, page: 1 }), // any filter change resets to page 1
  setLocation: (lat, lng) => set({ lat, lng, page: 1 }),
  clearLocation: () => set({ lat: null, lng: null, page: 1 }),
  setPage: (page) => set({ page }),
}));
