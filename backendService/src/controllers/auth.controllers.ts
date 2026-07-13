import { Response, Request } from "express";
import {
  loginSchema,
  RegisterInput,
  registerSchema,
} from "../validators/auth.validator.js";
import { ApiError } from "../utils/ApiError.js";
import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse({ body: req.body });
  if (!result.success) {
    throw new ApiError(400, "Validation Failed", result.error.issues);
  }
  const data: RegisterInput = result.data.body;
  const existUser = await authService.findUserByEmail(data.email);
  if (existUser) {
    throw new ApiError(409, "This account is Already Exist");
  }
  //create a user
  const { user, accesstoken, refreshtoken, emailVerifyToken } =
    await authService.userRegister(data);

  //In this section, we will use bullMQ to queue to send send email.
  // 4. TODO: Send verification email via BullMQ notification service
  // await notificationClient.sendEmail({
  //   to: user.email,
  //   subject: "Verify your TradieHub account",
  //   token: emailVerifyToken,
  // });

  console.info(`Email verify token for ${user.email}: ${emailVerifyToken}`);

  //set refresh token in httpOnly cookie

  res.cookie("refreshToken", refreshtoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      "AccountCreated Successfully. Please verify you email",
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          proflie: {
            firstName: user.profile?.firstName,
            lastName: user.profile?.lastName,
            phone: user.profile?.phone ?? null,
          },
        },
        accesstoken,
      },
    ),
  );
};

//verify Email after user click verification email
export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token) {
    throw new ApiError(400, "Verification tokwn is required");
  }

  await authService.verifyEmail(token);
  return res
    .status(200)
    .json(new ApiResponse(200, "email Verified Successfully", null));
};

//Resend Verfiication Email;:
export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const { emailVerifyToken, user } =
    await authService.resendVerificationtoken(email);
  //send Email is via BullMQ.
  console.info(`New Verification token for ${user.email}: ${emailVerifyToken}`);

  return res
    .status(200)
    .json(new ApiResponse(200, "Verification email sent", null));
};

// Login User
export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Please fill email or password corectly");
  }

  const { email, password } = result.data.body;

  const { user, accessToken, refreshToken } = await authService.userLogin(
    email,
    password,
  );

  //set refresh Token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 4. Send response
  return res.status(200).json(
    new ApiResponse(200, "Login successful", {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          phone: user.profile?.phone ?? null,
        },
      },
      accessToken,
    }),
  );
};
export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NPTE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, " Log-out Out Successfully", null));
};
