import { prisma } from "../config/db.js";
import { stripe } from "../config/stripe.js";
import { ApiError } from "../utils/ApiError.js";
const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT ?? 10);

export const createPaymentIntentService = async (
  bookingId: string,
  customerId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { quote: true, payment: true },
  });

  if (!booking) {
    throw new ApiError(400, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new ApiError(
      403,
      "You do not have permission to pay for this booking",
    );
  }

  if (booking.status !== "CONFIRMED") {
    throw new ApiError(
      400,
      `Cannot pay for a booking in ${booking.status} status`,
    );
  }

  if (!booking.quote || booking.quote.status !== "ACCEPTED") {
    throw new ApiError(400, "This booking has no accepted quote ot pay");
  }

  if (booking.payment) {
    throw new ApiError(409, "A payment already exist for this booking");
  }

  const amountCents = Math.round(Number(booking.quote.total) * 100);
  const platformFeeCents = Math.round(
    amountCents * (PLATFORM_FEE_PERCENT / 100),
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "aud",
    automatic_payment_methods: { enabled: true },
    metadata: { bookingId: booking.id },
  });

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      stripePaymentId: paymentIntent.id,
      amount: booking.quote.total,
      platformFee: platformFeeCents / 100,
      currency: "aud",
      status: "PENDING",
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentId: payment.id,
    amount: booking.quote.total,
  };
};

export const getConnectOnboardingLinkService = async (userId: string) => {
  let stripeAccount = await prisma.stripeAccount.findUnique({
    where: { userId },
  });

  if (!stripeAccount) {
    const account = await stripe.account.create({
      type: "express",
      country: "AU",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    stripeAccount = await prisma.stripeAccount.create({
      data: {
        userId,
        stripeAccountId: account.id,
        chargesEnabled: false,
        payoutsEnabled: false,
      },
    });
  }
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccount.stripeAccountId,
    refresh_url: `${process.env.FRONTEND_URL}/onboarding?refresh=true`,
    return_url: `${process.env.FRONTEND_URL}/onboarding?success=true`,
    type: "account_onboarding",
  });

  return { url: accountLink.url };
};
export const createRefundRequestService = async (
  paymentId: string,
  requesterId: string,
  reason: string,
  amountDollars: number,
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { booking: true },
  });
  if (!payment) throw new ApiError(404, " Payment not found");

  const isCustomer = payment.booking.customerId === requesterId;
  const isTradie = payment.booking.tradieId === requesterId;

  if (!isCustomer && !isTradie) {
    throw new ApiError(
      403,
      " You do not have permission to request a refund for this payment",
    );
  }
  if (payment.status !== "SUCCEEDED") {
    throw new ApiError(
      400,
      `Cannot request a refund for a payment with status ${payment.status}`,
    );
  }
  if (amountDollars <= 0 || amountDollars > Number(payment.amount)) {
    throw new ApiError(400, "Invalid refund amount");
  }
  const existingActive = await prisma.refundRequest.findFirst({
    where: {
      paymentId,
      status: { in: ["PENDING_APPROVAL", "PENDING_ADMIN", "APPROVED"] },
    },
  });
  if (existingActive) {
    throw new ApiError(
      409,
      "An active refund request already exists for this payment",
    );
  }

  return await prisma.refundRequest.create({
    data: {
      paymentId,
      bookingId: payment.booking.id,
      requestedBy: requesterId,
      reason,
      amount: amountDollars,
      status: "PENDING_APPROVAL",
    },
  });
};

export const respondToRefundRequestService = async (
  refundRequestId: string,
  responderId: string,
  approve: boolean,
  reason?: string,
) => {
  const request = await prisma.refundRequest.findUnique({
    where: { id: refundRequestId },
    include: { payment: { include: { booking: true } } },
  });

  if (!request) {
    throw new ApiError(404, " Refund not found");
  }
  if (request.status !== "PENDING_APPROVAL") {
    throw new ApiError(
      400,
      `Cannot respond to a request in ${request.status} status`,
    );
  }

  if (request.requestedBy === responderId) {
    throw new ApiError(403, "you cannot approve your own refund request");
  }
  const { customerId, tradieId } = request.payment.booking;
  const isParty = responderId === customerId || responderId === tradieId;

  if (!isParty) {
    throw new ApiError(403, " You are not a party to this booking");
  }

  return prisma.refundRequest.update({
    where: { id: refundRequestId },
    data: approve
      ? { status: "PENDING_ADMIN" }
      : { status: "REJECTED_BY_PARTY", partyRejectReason: reason ?? null },
  });
};

export const adminReviewRefundRequestService = async (
  refundRequestId: string,
  adminId: string,
  approve: boolean,
  reason?: string,
) => {
  const request = await prisma.refundRequest.findUnique({
    where: { id: refundRequestId },
    include: { payment: true },
  });

  if (!request) {
    throw new ApiError(404, "Refund request not found");
  }
  if (request.status !== "PENDING_ADMIN") {
    throw new ApiError(
      400,
      `cannot review a request in ${request.status} status`,
    );
  }
  if (!approve) {
    return prisma.refundRequest.update({
      where: { id: refundRequestId },
      data: {
        status: "REJECTED_BY_ADMIN",
        adminRejectReason: reason ?? null,
        adminApprovedBy: adminId,
      },
    });
  }
  const refund = await stripe.refunds.create({
    payment_intent: request.payment.stripePaymentId,
    amount: Math.round(Number(request.amount) * 100),
  });
  return prisma.refundRequest.update({
    where: { id: refundRequestId },
    data: {
      status: "APPROVED",
      adminApprovedBy: adminId,
      stripeRefundId: refund.id,
    },
  });
};
export const getConnectStatusService = async (userId: string) => {
  const stripeAccount = await prisma.stripeAccount.findUnique({
    where: { userId },
  });

  if (!stripeAccount) {
    return { onboarded: false, chargesEnabled: false, payoutsEnabled: false };
  }

  return {
    onboarded: true,
    chargesEnabled: stripeAccount.chargesEnabled,
    payoutsEnabled: stripeAccount.payoutsEnabled,
  };
};
