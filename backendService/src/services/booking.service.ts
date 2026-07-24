import {
  CreateBookingInput,
  ListbookingInput,
} from "../validators/booking.validator.js";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { Prisma } from "../generated/prisma/index.js";

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
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        tradie: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
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
