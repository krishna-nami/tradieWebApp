// lib/services/tradieProfile.ts
import api, { setAccesstoken } from "@/lib/api";
import type { ApiResponse } from "@/lib/api-types";
import type { TradieProfileFormValues } from "@/lib/validation/tradieProfile";

interface TradieProfileData {
  id: string;
  trades: string[];
  bio?: string;
}

// Assumes POST /tradie/profile — confirm actual path/method with your backend
export const createTradieProfile = (values: TradieProfileFormValues) =>
  api
    .post<ApiResponse<TradieProfileData>>("/tradie/profile", values)
    .then((res) => res.data);

export { setAccesstoken };
