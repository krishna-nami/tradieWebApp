// lib/services/tradie.ts
import api from "@/lib/api";
import type {
  ApiResponse,
  SearchTradiesData,
  TradieDetail,
} from "@/lib/api-types";

export interface SearchTradiesParams {
  tradieType?: string;
  suburb?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}

export const searchTradies = (params: SearchTradiesParams) =>
  api
    .get<ApiResponse<SearchTradiesData>>("/tradies/search", { params })
    .then((res) => res.data);

export const getTradieById = (id: string) =>
  api.get<ApiResponse<TradieDetail>>(`/tradies/${id}`).then((res) => res.data);
