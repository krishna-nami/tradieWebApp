import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { Prisma } from "../generated/prisma/index.js";
import {
  CreateQuoteInput,
  UpdateQuoteInput,
} from "../validators/quote.validator.js";
import { calculateGstFee } from "../utils/fees.js";
import { validateQuoteTransition } from "../utils/validateTransition.js";

export const createQuoteService = async (
  bookingId: string,
  tradieId: string,
  data: CreateQuoteInput,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { quote: true },
  });
  if (!booking) {
    throw new ApiError(404, "Booking Not Found");
  }
  if (booking.tradieId !== tradieId) {
    throw new ApiError(
      403,
      "You do not have permission to create a quote for this booking",
    );
  }
  if (booking.status !== "ACCEPTED") {
    throw new ApiError(
      400,
      `Cannot create a quote for a bookig in ${booking.status} status`,
    );
  }
  if (booking.quote) {
    throw new ApiError(400, " A Quote already exist for this Booking");
  }

  const lineItemswithAmount = data.lineItems.map((items) => ({
    description: items.description,
    quantity: items.quantity,
    unitPrice: new Prisma.Decimal(items.unitPrice),
    amount: new Prisma.Decimal(
      Math.round(items.quantity * items.unitPrice * 100) / 100,
    ),
  }));
  const subtotalNumber = lineItemswithAmount.reduce(
    (sum, item) => sum + item.amount.toNumber(),
    0,
  );

  const { gst, total } = calculateGstFee(subtotalNumber);

  const quote = await prisma.quote.create({
    data: {
      bookingId,
      status: "DRAFT",
      subtotal: new Prisma.Decimal(subtotalNumber),
      gst: new Prisma.Decimal(gst),
      total: new Prisma.Decimal(total),
      lineItems: { create: lineItemswithAmount },
    },
    include: { lineItems: true },
  });
  return quote;
};
export const updateQuoteService = async (
  quoteId: string,
  tradieId: string,
  data: UpdateQuoteInput,
) => {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { booking: true },
  });

  if (!quote) {
    throw new ApiError(404, " Quote Not found");
  }

  if (quote.booking.tradieId !== tradieId) {
    throw new ApiError(403, " You are not authorized to update this quote");
  }
  if (quote.status !== "DRAFT") {
    throw new ApiError(400, ` cannot Update a quote in ${quote.status} status`);
  }
  const lineItemsWithAmount = data.lineItems.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: new Prisma.Decimal(item.unitPrice),
    amount: new Prisma.Decimal(
      Math.round(item.quantity * item.unitPrice * 100) / 100,
    ),
  }));

  const subtotalNumber = lineItemsWithAmount.reduce(
    (sum, item) => sum + item.amount.toNumber(),
    0,
  );

  const { gst, total } = calculateGstFee(subtotalNumber);

  const updatedQuote = await prisma.$transaction(async (tx) => {
    await tx.quoteLineItem.deleteMany({ where: { quoteId } });
    return tx.quote.update({
      where: { id: quoteId },
      data: {
        subtotal: new Prisma.Decimal(subtotalNumber),
        gst: new Prisma.Decimal(gst),
        total: new Prisma.Decimal(total),
        lineItems: { create: lineItemsWithAmount },
      },
      include: { lineItems: true },
    });
  });

  return updatedQuote;
};

export const sendQuoteService = async (id: string, tradieId: string) => {
  const QUOTE_EXPIRY_DAYS = 7;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { booking: true, lineItems: true },
  });
  if (!quote) {
    throw new ApiError(404, " Quote not Found");
  }
  if (quote.booking.tradieId !== tradieId) {
    throw new ApiError(403, " You do not have Permission to send this quote");
  }
  validateQuoteTransition(quote.status, "SENT");

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + QUOTE_EXPIRY_DAYS);
  const updatedQuote = await prisma.quote.update({
    where: { id },
    data: { status: "SENT", expiresAt },
    include: { lineItems: true },
  });

  return updatedQuote;
};
export const acceptQuoteService = async (id: string, customerId: string) => {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { booking: true, lineItems: true },
  });
  if (!quote) {
    throw new ApiError(404, "Quote not found");
  }
  if (quote.booking.customerId !== customerId) {
    throw new ApiError(403, " You do not have permission to accept this quote");
  }

  if (
    quote.status === "SENT" &&
    quote.expiresAt &&
    quote.expiresAt < new Date()
  ) {
    await prisma.quote.update({ where: { id }, data: { status: "EXPIRED" } });
    throw new ApiError(400, "This quote has expired");
  }

  validateQuoteTransition(quote.status, "ACCEPTED");

  const updatedQuote = await prisma.$transaction(async (tx) => {
    const acceptedQuote = await tx.quote.update({
      where: { id },
      data: { status: "ACCEPTED" },
      include: { lineItems: true },
    });
    await tx.booking.update({
      where: { id: quote.bookingId },
      data: { status: "CONFIRMED", totalAmount: quote.total },
    });
    await tx.bookingStatusHistory.create({
      data: {
        bookingId: quote.bookingId,
        fromStatus: quote.booking.status,
        toStatus: "CONFIRMED",
        changedBy: customerId,
        reason: "ustomer accepted the quote",
      },
    });
    return acceptedQuote;
  });
  return updatedQuote;
};

export const declineQuoteService = async (
  id: string,
  reason: string,
  customerId: string,
) => {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { booking: true },
  });
  if (!quote) {
    throw new ApiError(404, "Quote Not Found");
  }
  if (quote.booking.customerId !== customerId) {
    throw new ApiError(
      403,
      "You do not have permission to decline this booking",
    );
  }
  if (
    quote.status === "SENT" &&
    quote.expiresAt &&
    quote.expiresAt < new Date()
  ) {
    await prisma.quote.update({ where: { id }, data: { status: "EXPIRED" } });
    throw new ApiError(400, "This quote have been expired");
  }
  validateQuoteTransition(quote.status, "DECLINED");
  const updatedQuote = await prisma.quote.update({
    where: { id },
    data: { status: "DECLINED", declinedReason: reason },
    include: { lineItems: true },
  });
  return { ...updatedQuote, declinedReason: reason };
};
