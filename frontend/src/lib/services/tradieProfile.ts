// lib/services/tradieProfile.ts
import api, { setAccesstoken } from "@/lib/api";
import type {
  ApiResponse,
  DayAvailability,
  TradieFullProfile,
} from "@/lib/api-types";
import type { TradieProfileFormValues } from "@/lib/validation/tradieProfile";

interface TradieProfileData {
  id: string;
  trades: string[];
  bio?: string;
}
export const updateGenericProfile = (payload: {
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
}) =>
  api
    .put<ApiResponse<TradieFullProfile>>("/user/updateMe", payload)
    .then((res) => res.data);

// Assumes POST /tradie/profile — confirm actual path/method with your backend
export const createTradieProfile = (values: TradieProfileFormValues) =>
  api
    .post<ApiResponse<TradieProfileData>>("/tradies/profile", values)
    .then((res) => res.data);

export const updateTradieDetails = (payload: {
  bio?: string;
  licenceNo?: string;
  trades?: string[];
  isAvailable?: boolean;
}) =>
  api
    .put<ApiResponse<TradieFullProfile>>("/tradies/profile", payload)
    .then((res) => res.data);

export const addSpecialisation = (payload: {
  trade: string;
  yearsExperience?: number;
  certification?: string;
}) =>
  api
    .post<ApiResponse<unknown>>("/tradies/specialisations", payload)
    .then((res) => res.data);

export const removeSpecialisation = (id: string) =>
  api
    .delete<ApiResponse<unknown>>(`/tradies/specialisations/${id}`)
    .then((res) => res.data);

export const getAvailability = () =>
  api
    .get<ApiResponse<DayAvailability[]>>("/tradies/availability")
    .then((res) => res.data);

export const setAvailability = (availability: DayAvailability[]) =>
  api
    .put<
      ApiResponse<{ availability: DayAvailability[] }>
    >("/tradies/availability", { availability })
    .then((res) => res.data);
export { setAccesstoken };
