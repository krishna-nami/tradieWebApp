import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/db.js";
import { UpdateUserInput } from "../validators/auth.validator.js";
import { Prisma } from "../generated/prisma/index.js";

export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const updateUserService = async (
  data: UpdateUserInput,
  userId: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
    },
  });
  const {
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    state,
    postcode,
    phone,
    suburb,
  } = data;

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        update: {
          firstName,
          lastName,
          addressLine1,
          addressLine2,
          phone,
          postcode,
          state,
          suburb,
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
        },
      },
    },
  });

  return updatedUser;
};
