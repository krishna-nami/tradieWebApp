import { BookingStatusValue } from "./booking-status";

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
// lib/api-types.ts — add
export interface Job {
  id: string;
  customerId: string;
  tradieId: string | null;
  title: string;
  description: string;
  category: string;
  suburb: string;
  state: string;
  postcode: string;
  budgetMin: number | null;
  budgetMax: number | null;
  scheduledAt: string | null;
  status: string;
}

export interface Booking {
  id: string;
  jobId: string;
  customerId: string;
  tradieId: string;
  scheduledAt: string;
  totalAmount: number;
  notes: string | null;
  status: string;
}
export interface BookingUserSummary {
  id: string;
  email: string;
  profile: { firstName: string; lastName: string };
}

export interface BookingListItem {
  id: string;
  jobId: string;
  customerId: string;
  tradieId: string;
  status: BookingStatusValue;
  scheduledAt: string;
  totalAmount: string; // Prisma Decimal serializes as string over JSON
  notes: string | null;
  declineReason: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  job: { title: string; category: string; suburb: string };
  customer: BookingUserSummary;
  tradie: BookingUserSummary;
}
export interface ListBookingsData {
  bookings: BookingListItem[];
  pagination: { page: number; limit: number; total: number };
}

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string; // Decimal → string over JSON
  amount: string;
}

export interface Quote {
  id: string;
  bookingId: string;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  subtotal: string;
  gst: string;
  total: string;
  expiresAt: string | null;
  declinedReason: string | null;
  lineItems: QuoteLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingDetail {
  id: string;
  jobId: string;
  customerId: string;
  tradieId: string;
  status: BookingStatusValue;
  scheduledAt: string;
  totalAmount: string;
  notes: string | null;
  declineReason: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  job: {
    title: string;
    description: string;
    category: string;
    suburb: string;
    state: string;
    postcode: string;
    budgetMin: string | null;
    budgetMax: string | null;
  };
  customer: BookingUserSummary;
  tradie: BookingUserSummary;
  quote: Quote | null;
  statusHistory: {
    id: string;
    fromStatus: BookingStatusValue | null;
    toStatus: BookingStatusValue;
    changedBy: string;
    reason: string | null;
    createdAt: string;
  }[];
}
// lib/api-types.ts — add
export interface TradieFullProfile {
  id: string;
  email: string;
  role: "CUSTOMER" | "TRADIE";
  profile: {
    firstName: string;
    lastName: string;
    addressLine1: string | null;
    addressLine2: string | null;
    state: string | null;
    postcode: string | null;
    phone: string | null;
    suburb: string | null;
    licenceNo: string | null;
    bio: string | null;
    abn: string | null;
    isAvailable: boolean;
    specialisations: {
      id: string;
      trade: string;
      yearsExperience: number | null;
      certification: string | null;
    }[];
  };
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}

export interface DayAvailability {
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  slots: AvailabilitySlot[];
}
