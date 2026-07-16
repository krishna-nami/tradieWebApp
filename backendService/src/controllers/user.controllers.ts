import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { getMeService, updateUserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  updateProfileSchema,
  UpdateUserInput,
} from "../validators/auth.validator.js";
import { validateRequest } from "../utils/validateRequest.js";

export const getMeController = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "You are unauthorized");
  }

  const user = await getMeService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched Successfully", user));
};
export const updateUserController = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "You are unauthorized");
  }
  const data: UpdateUserInput = validateRequest(updateProfileSchema, req.body);

  const updatedUser = await updateUserService(data, userId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Profile update successfully", updatedUser));
};
