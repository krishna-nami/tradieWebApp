import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { RegisterInput } from "../validators/auth.validator.js";
import { prisma } from "../config/db.js";
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
  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
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

  return { user, accesstoken, refreshtoken };
};
