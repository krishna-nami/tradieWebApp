import {
  CreateBookingInput,
  ListbookingInput,
} from "../validators/booking.validator.js";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { Prisma } from "../generated/prisma/index.js";
import { userSummarySelect } from "../utils/prismaSelects.js";
import { validateTransition } from "../utils/validateTransition.js";
import { AuthUser } from "../types/auth.js";
import { createPayoutForCompletedBooking } from "./payout.service.js";

//Creating a booking
export const createbookingService = async (
  data: CreateBookingInput,
  customerId: string,
) => {
  const job = await prisma.job.findUnique({ where: { id: data.jobId } });
  if (!job) {
    throw new ApiError(404, "Job not Found");
  }

  if (job.customerId !== customerId) {
    throw new ApiError(403, "You do not have permission to book this job");
  }
  if (!job.tradieId) {
    throw new ApiError(400, "HTis job has no traide assigned yet");
  }
  if (job.status !== "ASSIGNED") {
    throw new ApiError(
      400,
      `Cannot create a booking for a job in ${job.status} status`,
    );
  }
  const existingBooking = await prisma.booking.findUnique({
    where: { jobId: data.jobId },
  });
  if (existingBooking) {
    throw new ApiError(409, "A booking already exists for this job");
  }

  const booking = await prisma.$transaction(async (tx) => {
    const created = await tx.booking.create({
      data: {
        jobId: data.jobId,
        customerId,
        tradieId: job.tradieId!,
        scheduledAt: data.scheduledAt,
        totalAmount: data.totalAmount,
        notes: data.notes ?? null,
        status: "PENDING",
      },
    });
    await tx.bookingStatusHistory.create({
      data: {
        bookingId: created.id,
        fromStatus: null,
        toStatus: "PENDING",
        changedBy: customerId,
        reason: "Booking created",
      },
    });
    await tx.job.update({
      where: { id: data.jobId },
      data: { status: "BOOKED" },
    });

    return created;
  });
  return booking;
};

//Listing Booking with paginations
export const listbookingService = async (
  filters: ListbookingInput,
  userId: string,
  role: "CUSTOMER" | "TRADIE",
) => {
  const where: Prisma.BookingWhereInput =
    role === "CUSTOMER" ? { customerId: userId } : { tradieId: userId };
  if (filters.status) {
    where.status = filters.status;
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      orderBy: { createdAt: "desc" },
      include: {
        job: { select: { title: true, category: true, suburb: true } },
        customer: {
          select: userSummarySelect,
        },
        tradie: {
          select: userSummarySelect,
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);
  return {
    bookings,
    pagination: { page: filters.page, limit: filters.limit, total },
  };
};

//Getting Booking by User or Tradie
export const getBookingByIdService = async (
  bookingId: string,
  userId: string,
  role: "TRADIE" | "CUSTOMER",
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      job: {
        select: {
          title: true,
          description: true,
          category: true,
          suburb: true,
          state: true,
          postcode: true,
          budgetMin: true,
          budgetMax: true,
        },
      },
      customer: { select: userSummarySelect },
      tradie: { select: userSummarySelect },
      quote: {
        include: { lineItems: true },
      },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isOwner =
    (role === "CUSTOMER" && booking.customerId === userId) ||
    (role === "TRADIE" && booking.tradieId === userId);
  if (!isOwner) {
    throw new ApiError(403, "You do not have permission to view this booking");
  }

  return booking;
};

//Acceping a Booking Service
export const acceptBookingService = async (
  id: string,
  tradieId: string,
  reason?: string,
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    throw new ApiError(404, "Booking Not Found");
  }
  if (booking.tradieId !== tradieId) {
    throw new ApiError(
      403,
      "You do not have permission to accept this booking",
    );
  }
  validateTransition(booking.status, "ACCEPTED");
  const updatedBooking = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });
    await tx.bookingStatusHistory.create({
      data: {
        bookingId: id,
        fromStatus: booking.status,
        toStatus: "ACCEPTED",
        changedBy: tradieId,
        reason: reason ?? "Tradie accepted the booking",
      },
    });
    return result;
  });
  return updatedBooking;
};
export const declineBookingService = async (
  id: string,
  tradieId: string,
  reason: string,
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    throw new ApiError(404, "Booking Not found");
  }

  if (booking.tradieId !== tradieId) {
    throw new ApiError(
      403,
      " You do not have permession to delcine this booking",
    );
  }
  validateTransition(booking.status, "DECLINED");
  const updatedBooking = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({
      where: { id },
      data: { status: "DECLINED", declineReason: reason },
    });
    await tx.bookingStatusHistory.create({
      data: {
        bookingId: id,
        fromStatus: booking.status,
        toStatus: "DECLINED",
        changedBy: tradieId,
        reason,
      },
    });
    return result;
  });
  return updatedBooking;
};
//Cancel Booking Service
export const cancelBookingService = async (
  id: string,
  user: AuthUser,
  reason: string,
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    throw new ApiError(404, "Booking Not Found");
  }
  if (booking.tradieId !== user.id && booking.customerId !== user.id) {
    throw new ApiError(
      403,
      " You do not have permession to cancel this booking",
    );
  }
  validateTransition(booking.status, "CANCELLED");
  const updatedBooking = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({
      where: { id },
      data: { status: "CANCELLED", cancelReason: reason },
    });

    await tx.bookingStatusHistory.create({
      data: {
        bookingId: id,
        fromStatus: booking.status,
        toStatus: "CANCELLED",
        changedBy: user.id,
        reason,
      },
    });

    return result;
  });

  return updatedBooking;
};

//Starting Booking Servie
export const startbookingService = async (id: string, tradieId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    throw new ApiError(404, "Booking Not Found");
  }
  if (booking.tradieId !== tradieId) {
    throw new ApiError(
      403,
      " You do not have permession to start this booking",
    );
  }
  validateTransition(booking.status, "IN_PROGRESS");
  const updatedBooking = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({
      where: { id },
      data: { status: "IN_PROGRESS" },
    });

    await tx.bookingStatusHistory.create({
      data: {
        bookingId: id,
        fromStatus: booking.status,
        toStatus: "IN_PROGRESS",
        changedBy: tradieId,
        reason: "Tradie started the Job",
      },
    });

    return result;
  });

  return updatedBooking;
};
//complete Bookings
export const completeBookingService = async (id: string, traideId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    throw new ApiError(404, "Booking Not Found");
  }
  if (booking.tradieId !== traideId) {
    throw new ApiError(
      403,
      "You do not have permession to access this booking",
    );
  }
  validateTransition(booking.status, "COMPLETED");
  const updatedBooking = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
    await tx.bookingStatusHistory.create({
      data: {
        bookingId: id,
        fromStatus: booking.status,
        toStatus: "COMPLETED",
        changedBy: traideId,
        reason: "Tradie successfully completed this job",
      },
    });
    return result;
  });
  // Trigger payout after the transaction commits — if this fails, the
  // booking is still correctly marked COMPLETED; payout can be retried separately.
  try {
    await createPayoutForCompletedBooking(id);
  } catch (err) {
    console.error(`Payout Failed for boooking ${id}`, err);
    // Not re-thrown — job completion shouldn't fail just because payout had an issue
  }
  return updatedBooking;
};
