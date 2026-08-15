// lib/api-types.ts — shared wrapper type
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
export interface RegisterData {
  user: {
    id: string;
    email: string;
    role: "CUSTOMER" | "TRADIE";
    isVerified: boolean;
    proflie: {
      // matches backend typo — fix both sides together once corrected
      firstName?: string;
      lastName?: string;
      phone: string | null;
    };
  };
  accesstoken: string; // lowercase, matches backend — fix once corrected
}
export interface TradieSpecialisation {
  trade: string;
  yearsExperience: number | null;
}
export interface TradieSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  suburb: string | null;
  state: string | null;
  businessName: string | null;
  latitude: number | null;
  longitude: number | null;
  specialisations: TradieSpecialisation[];
}
export interface SearchTradiesData {
  results: TradieSearchResult[];
  pagination: { page: number; limit: number; total: number };
}

export interface TradieDetail {
  userId: string;
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  licenceNo: string | null;
  suburb: string | null;
  state: string | null;
  isAvailable: boolean;
  businessName: string | null;
  latitude: number | null;
  longitude: number | null;
  specialisations: TradieSpecialisation[]; // already defined earlier, from search types
}
