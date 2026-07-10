import { Response, Request, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? null,
    });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
