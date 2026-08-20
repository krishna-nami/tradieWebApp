// lib/services/booking.ts
import api from "@/lib/api";
import type {
  ApiResponse,
  Booking,
  BookingDetail,
  ListBookingsData,
} from "@/lib/api-types";
import { BookingStatusValue } from "../booking-status";

interface CreateBookingPayload {
  jobId: string;
  scheduledAt: string;
  totalAmount: number;
  notes?: string;
}
interface ListBookingsParams {
  status?: BookingStatusValue;
  page?: number;
  limit?: number;
}

export const createBooking = (payload: CreateBookingPayload) =>
  api
    .post<ApiResponse<Booking>>("/booking/create-booking", payload)
    .then((res) => res.data);

export const listBookings = (params: ListBookingsParams) =>
  api
    .get<ApiResponse<ListBookingsData>>("/booking/allBookings", { params })
    .then((res) => res.data);

export const getBookingById = (id: string) =>
  api
    .get<ApiResponse<BookingDetail>>(`/booking/bookings/${id}`)
    .then((res) => res.data);

export const acceptBooking = (id: string, reason?: string) =>
  api
    .put<ApiResponse<Booking>>(`/booking/bookings/${id}/accept`, { reason })
    .then((res) => res.data);

export const declineBooking = (id: string, declineReason: string) =>
  api
    .put<
      ApiResponse<Booking>
    >(`/booking/bookings/${id}/decline`, { declineReason })
    .then((res) => res.data);

export const cancelBooking = (id: string, cancelReason: string) =>
  api
    .put<
      ApiResponse<Booking>
    >(`/booking/bookings/${id}/cancel`, { cancelReason })
    .then((res) => res.data);

export const startBooking = (id: string) =>
  api
    .put<ApiResponse<Booking>>(`/booking/bookings/${id}/start`)
    .then((res) => res.data);

export const completeBooking = (id: string) =>
  api
    .put<ApiResponse<Booking>>(`/booking/bookings/${id}/complete`)
    .then((res) => res.data);
