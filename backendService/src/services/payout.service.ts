import { stripe } from "../config/stripe.js";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export const createPayoutForCompletedBooking = async (bookingId: string) => {
  const booking = await prisma?.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true, tradie: { include: { stripeAccount: true } } },
  });
  if (!booking) {
    throw new ApiError(404, " booking not found");
  }
  if (booking.status !== "COMPLETED") {
    throw new ApiError(400, "Booking is not completd yet");
  }
  if (!booking.payment || booking.payment.status !== "SUCCEEDED") {
    throw new ApiError(400, "No successful payment found for this booking");
  }
  if (!booking.tradie.stripeAccount?.stripeAccountId) {
    throw new ApiError(
      400,
      "Tradie has bot completed stripe connect onboarding",
    );
  }
  if (!booking.tradie.stripeAccount.payoutsEnabled) {
    throw new ApiError(
      400,
      " Tradie's stripe account is not yet enabled for payouts",
    );
  }

  const existingTransfer = await prisma?.payoutRecord.findUnique({
    where: { bookingId },
  });
  if (existingTransfer) {
    throw new ApiError(
      409,
      "A payout has alreay been created for this booking",
    );
  }

  const payoutAmountCents =
    Math.round(
      Number(booking.payment.amount) - Number(booking.payment.platformFee),
    ) * 100;

  const transfer = await stripe.transfers.create({
    amount: payoutAmountCents,
    currency: "aud",
    destination: booking.tradie.stripeAccount.stripeAccountId,
    metadata: { bookingId: booking.id },
  });

  return prisma?.payoutRecord.create({
    data: {
      bookingId: booking.id,
      tradieId: booking.tradieId,
      stripeTransferId: transfer.id,
      amount: payoutAmountCents / 100,
      status: "SUCCEEDED",
    },
  });
};

export const listPayoutsForTradieService = async (tradieId: string) => {
  const payouts = await prisma.payoutRecord.findMany({
    where: { tradieId },
    orderBy: { createdAt: "desc" },
    include: {
      booking: { include: { job: { select: { title: true } } } },
    },
  });

  const totalEarned = payouts.reduce((sum, p) => sum + Number(p.amount), 0);

  return { payouts, totalEarned };
};
