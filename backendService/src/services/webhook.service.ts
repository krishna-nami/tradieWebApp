import Stripe from "stripe";
import { prisma } from "../config/db.js";

export const processStripeEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSucceeded(intent);
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(intent);
      break;
    }
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await handlePaymentUpdated(account);
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      await handleChargeRefunded(charge);
      break;
    }
    default:
      console.log(`unhandled webhook event type:${event.type}`);
  }
};

async function handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId: intent.id },
  });
  if (!payment) {
    console.error(`No payment record found for PaymentIntent ${intent.id}`);
    return;
  }
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCEEDED" },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    }),
  ]);
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId: intent.id },
  });
  if (!payment) {
    console.error(`No Payment record found for PaymentIntent ${intent.id}`);
    return;
  }
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED" },
  });
}
async function handlePaymentUpdated(account: Stripe.Account) {
  await prisma.stripeAccount.updateMany({
    where: { stripeAccountId: account.id },
    data: {
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    },
  });
}
async function handleChargeRefunded(charge: Stripe.Charge) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId: charge.payment_intent as string },
  });
  if (!payment) return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "REFUNDED" },
    }),
    prisma.refundRequest.updateMany({
      where: { paymentId: payment.id, status: "APPROVED" },
      data: { status: "PROCESSED" },
    }),
  ]);
}
