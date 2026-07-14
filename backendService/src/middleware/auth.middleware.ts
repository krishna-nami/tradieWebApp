import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "You are unauthorized");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Token is Missing");
    }
    const payload = verifyAccessToken(token);
    const { userId } = payload;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(401, "You are unauthorized");
    }
    req.user = {
      id: user.id,
      email: user.email,
      isEmailVerified: user.isVerified,
      role: user.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, " token has expired"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, " Invalid Token"));
    }

    next(error);
  }
};
