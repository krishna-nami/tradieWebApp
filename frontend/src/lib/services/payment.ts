import api from "@/lib/api";

import type { ApiResponse } from "../api-types";

interface PaymentIntentData {
  clientSecret: string;
  paymentId: string;
  amount: string;
}
interface ConnectStatus {
  onboarded: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

interface PayoutRecord {
  id: string;
  amount: string;
  status: string;
  createdAt: string;
  booking: { job: { title: string } };
}

export const createPaymentIntent = (bookingId: string) =>
  api
    .post<ApiResponse<PaymentIntentData>>("/payment/intent", { bookingId })
    .then((res) => res.data);
export const getConnectOnboardingLink = () =>
  api
    .get<ApiResponse<{ url: string }>>("/payment/connect/onboard")
    .then((res) => res.data);
export const downloadInvoice = async (bookingId: string) => {
  const response = await api.get(`/paymentt/${bookingId}/invoice`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${bookingId.slice(0, 8)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const getConnectStatus = () =>
  api
    .get<ApiResponse<ConnectStatus>>("/payment/connect/status")
    .then((res) => res.data);

export const listPayouts = () =>
  api
    .get<
      ApiResponse<{ payouts: PayoutRecord[]; totalEarned: number }>
    >("/payment/payouts")
    .then((res) => res.data);
