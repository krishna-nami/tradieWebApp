import {
  CreateBookingInput,
  ListbookingInput,
} from "../validators/booking.validator.js";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { Prisma } from "../generated/prisma/index.js";
import { userSummarySelect } from "../utils/prismaSelects.js";
import { validateTransition } from "../utils/validateTransition.js";

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
  const updated = await prisma.$transaction(async (tx) => {
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
  return updated;
};
