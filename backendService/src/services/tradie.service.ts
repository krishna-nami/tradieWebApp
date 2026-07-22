import {
  AddSpecialisationInput,
  TradieProfileInput,
  UpdateTraideProfileInput,
} from "../validators/tradie.validator.js";
import { prisma } from "../config/db.js";

import { Prisma } from "../generated/prisma/index.js";
import { ApiError } from "../utils/ApiError.js";
import { AvailabilityInput } from "../validators/availability.validators.js";

export const traideProfileService = async (
  data: TradieProfileInput,
  userId: string,
) => {
  const { abn, trades, licenceNo, bio } = data;

  const createdTradie = await prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        update: {
          abn,
          trades,
          licenceNo,
          bio,
        } as Prisma.ProfileUpdateWithoutUserInput,
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          addressLine1: true,
          addressLine2: true,
          state: true,
          postcode: true,
          phone: true,
          suburb: true,
          licenceNo: true,
          bio: true,
          trades: true,
          abn: true,
        },
      },
    },
  });
  return createdTradie;
};
export const updateTradieProfileService = async (
  data: UpdateTraideProfileInput,
  userId: string,
) => {
  const { bio, licenceNo, trades, isAvailable } = data;

  const updatedTradie = await prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        update: {
          trades,
          licenceNo,
          bio,
          isAvailable,
        } as Prisma.ProfileUpdateWithoutUserInput,
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          addressLine1: true,
          addressLine2: true,
          state: true,
          postcode: true,
          phone: true,
          suburb: true,
          licenceNo: true,
          bio: true,
          trades: true,
          abn: true,
          isAvailable: true,
        },
      },
    },
  });
  return updatedTradie;
};

export const getTradieByIdService = async (tradieId: string) => {
  const tradie = await prisma.user.findUnique({
    where: { id: tradieId, role: "TRADIE" },
    select: {
      id: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          avatarUrl: true,
          bio: true,
          trades: true,
          licenceNo: true,
          suburb: true,
          state: true,
          isAvailable: true, // ← new
        },
      },
    },
  });

  if (!tradie) {
    throw new ApiError(404, "Tradie not Found");
  }
  return tradie;
};

export const setAvailabilityService = async (
  data: AvailabilityInput,
  id: string,
) => {
  const profile = await prisma.profile.findUnique({ where: { userId: id } });
  if (!profile) {
    throw new ApiError(404, " Traide profile not found");
  }
  const slotsCreate = data.availability.flatMap((day) => {
    return day.slots.map((slot) => ({
      profileId: profile.id,
      day: day.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));
  });
  await prisma.$transaction([
    prisma.tradieAvailabilitySlot.deleteMany({
      where: { profileId: profile.id },
    }),
    prisma.tradieAvailabilitySlot.createMany({ data: slotsCreate }),
  ]);
  return getAvailabilityService(id);
};
export const getAvailabilityService = async (id: string) => {
  console.log(id);
  if (!id) {
    console.log("Id not forunt");
  }
  const profile = await prisma.profile.findUnique({ where: { userId: id } });
  if (!profile) {
    throw new ApiError(404, " Tradie not Found Now");
  }
  const slots = await prisma.tradieAvailabilitySlot.findMany({
    where: { profileId: profile.id },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
  const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
  return DAYS.map((day) => ({
    day,
    slots: slots
      .filter((s) => s.day === day)
      .map((s) => ({ startTime: s.startTime, endTime: s.endTime })),
  }));
};

export const addSpecialisationService = async (
  data: AddSpecialisationInput,
  userId: string,
) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    throw new ApiError(404, "Tradie profile not found");
  }

  const existing = await prisma.tradieSpecialisation.findUnique({
    where: { profileId_trade: { profileId: profile.id, trade: data.trade } },
  });
  if (existing) {
    throw new ApiError(409, "This specialisation already exists");
  }

  const specialisation = await prisma.tradieSpecialisation.create({
    data: {
      profileId: profile.id,
      trade: data.trade,
      yearsExperience: data.yearsExperience ?? null,
      certification: data.certification ?? null,
    },
  });

  return specialisation;
};

export const removeSpecialisationService = async (
  specialisationId: string,
  userId: string,
) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    throw new ApiError(404, "Tradie profile not found");
  }

  const specialisation = await prisma.tradieSpecialisation.findUnique({
    where: { id: specialisationId },
  });

  if (!specialisation) {
    throw new ApiError(404, "Specialisation not found");
  }

  // ownership check — critical, prevents tradie A deleting tradie B's specialisation
  if (specialisation.profileId !== profile.id) {
    throw new ApiError(
      403,
      "You do not have permission to delete this specialisation",
    );
  }

  await prisma.tradieSpecialisation.delete({ where: { id: specialisationId } });

  return { id: specialisationId, trade: specialisation.trade };
};
