import api from "@/lib/api";
import type { ApiResponse, Quote } from "@/lib/api-types";

interface LineItemPayload {
  description: string;
  quantity: number;
  unitPrice: number;
}

export const acceptQuote = (quoteId: string) =>
  api
    .put<ApiResponse<Quote>>(`/quote/quotes/${quoteId}/accept`)
    .then((res) => res.data);

export const declineQuote = (quoteId: string, reason: string) =>
  api
    .put<ApiResponse<Quote>>(`/quote/quotes/${quoteId}/decline`, { reason })
    .then((res) => res.data);

export const createQuote = (bookingId: string, lineItems: LineItemPayload[]) =>
  api
    .post<
      ApiResponse<Quote>
    >(`/quote/bookings/${bookingId}/quote`, { lineItems })
    .then((res) => res.data);

export const updateQuote = (quoteId: string, lineItems: LineItemPayload[]) =>
  api
    .put<ApiResponse<Quote>>(`/quote/quotes/${quoteId}`, { lineItems })
    .then((res) => res.data);

export const sendQuote = (quoteId: string) =>
  api
    .put<ApiResponse<Quote>>(`/quote/quotes/${quoteId}/send`)
    .then((res) => res.data);
