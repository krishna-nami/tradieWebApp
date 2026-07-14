import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/index.js";
import { ApiError } from "../utils/ApiError.js";
export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "You are unauthorized");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to access this resource",
      );
    }
    next();
  };
};
