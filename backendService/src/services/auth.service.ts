import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import {
  ChangePasswordInput,
  ForgetPasswordInput,
  RegisterInput,
  ResetPasswordInput,
} from "../validators/auth.validator.js";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

const SALT_NUMBER = 12;
const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000;

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
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

export const userLogin = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });
  if (!user) {
    throw new ApiError(401, "Invalid User name or Password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Name or Password");
  }
  if (!user.isVerified) {
    throw new ApiError(400, "Please Verifify your account");
  }
  const accessToken = generateAccessToken({ userId: user.id, role: user.role });

  const refreshToken = generateRefreshToken({ userId: user.id });

  return { user, accessToken, refreshToken };
};
export const forgetPasswordService = async (data: ForgetPasswordInput) => {
  const { email } = data;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(400, "There is no account with this email");
  }
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResettoken: hashedToken,
      passwordResetExpiry: new Date(Date.now() + RESET_TOKEN_EXPIRY_MS),
    },
  });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  //Push to que- notidication microservices and send email from Resend
};

export const resetPasswordService = async (data: ResetPasswordInput) => {
  const { token, password } = data;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResettoken: hashedToken,
      passwordResetExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, " Reset Token is invalid or has expired");
  }

  const hashPassword = await bcrypt.hash(password, SALT_NUMBER);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashPassword,
      passwordResettoken: null,
      passwordResetExpiry: null,
    },
  });
};
export const changePasswordService = async (
  data: ChangePasswordInput,
  userId: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(404, "User not Found");
  }
  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Current Password is incorrect");
  }
  const isSame = await bcrypt.compare(data.newPassword, user.password);
  if (isSame) {
    throw new ApiError(
      400,
      "New Password must be different than current password",
    );
  }
  const hashPassword = await bcrypt.hash(data.newPassword, SALT_NUMBER);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashPassword },
  });
};
