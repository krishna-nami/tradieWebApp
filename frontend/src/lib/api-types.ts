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
