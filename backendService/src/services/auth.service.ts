import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { RegisterInput } from "../validators/auth.validator.js";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
const SALT_NUMBER = 12;

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};
export const userRegister = async (data: RegisterInput) => {
  const {
    email,
    password,
    role,
    firstName,
    abn,
    lastName,
    phone,
    addressLine1,
    state,
    postcode,
    addressLine2,
    suburb,
    licenceNo,
  } = data;
  const passwordHash = await bcrypt.hash(password, SALT_NUMBER);

  const emailVerifyToken = crypto.randomBytes(32).toString("hex");
  //email verify toekn last for 24 hours ~1d
  const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      emailVerifyToken,
      emailVerifyExpiry,
      role,
      profile: {
        create: {
          firstName,
          lastName,
          phone: phone ?? null,
          abn: abn ?? null,
          licenceNo: licenceNo ?? null,
          addressLine1: addressLine1 ?? null, // ← add
          addressLine2: addressLine2 ?? null, // ← add
          suburb: suburb ?? null, // ← add
          state: state ?? null, // ← add
          postcode: postcode ?? null,
        },
      },
    },
    include: {
      profile: true,
    },
  });
  const accesstoken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });
  const refreshtoken = generateRefreshToken({
    userId: user.id,
  });

  return { user, accesstoken, refreshtoken, emailVerifyToken };
};

//verify Email
export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token },
  });
  if (!user) {
    throw new ApiError(400, "Invalid verificaltion Token");
  }
  //check token has been expired or not
  if (!user.emailVerifyExpiry || user.emailVerifyExpiry < new Date()) {
    throw new ApiError(400, "Verfification token has expired");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpiry: null,
    },
  });

  return updatedUser;
};

export const resendVerificationtoken = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new ApiError(400, "User Account not found with this email");
  }

  if (user.isVerified) {
    throw new ApiError(400, " User is already verified");
  }
  const emailVerifyToken = crypto.randomBytes(32).toString("hex");
  const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifyExpiry, emailVerifyToken },
  });

  return { user, emailVerifyToken };
};
