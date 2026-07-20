// types/auth.ts
export interface AuthUser {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "TRADIE";
  isEmailVerified: boolean;
}
