import {
  TradieProfileInput,
  UpdateTraideProfileInput,
} from "../validators/tradie.validator.js";
import { prisma } from "../config/db.js";

import { Prisma } from "../generated/prisma/index.js";
import { ApiError } from "../utils/ApiError.js";

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
