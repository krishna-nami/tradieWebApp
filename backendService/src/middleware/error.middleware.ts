import { Response, Request, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statuscode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? null,
    });
  }
  return res.status(500).json({
    success: false,
    messsage: "Internal Server Error",
  });
};
