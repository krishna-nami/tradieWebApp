import { Request, Response } from "express";
import {
  TradieProfileInput,
  tradieProfileSchema,
  UpdateTraideProfileInput,
} from "../validators/tradie.validator.js";
import { ApiError } from "../utils/ApiError.js";
import { validateRequest } from "../utils/validateRequest.js";
import * as tradieService from "../services/tradie.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const traideProfileConroller = async (req: Request, res: Response) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(403, "You are Unauthorized");
  }
  const data: TradieProfileInput = validateRequest(
    tradieProfileSchema,
    req.body,
  );

  const tradie = await tradieService.traideProfileService(data, userId);

  return res
    .status(201)
    .json(new ApiResponse(200, " Tradie profile Created", tradie));
};

export const updateProfileController = async (req: Request, res: Response) => {
  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(403, "You are Unauthorized");
  }
  const data: UpdateTraideProfileInput = validateRequest(
    tradieProfileSchema,
    req.body,
  );

  const updateTraide = await tradieService.updateTradieProfileService(
    data,
    userId,
  );
  return res
    .status(201)
    .json(
      new ApiResponse(200, "Tradie profile successfully updated", updateTraide),
    );
};

export const getTradieByIdController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    throw new ApiError(400, "Traide ID not found");
  }
  const tradie = await tradieService.getTradieByIdService(id);
  return res
    .status(200)
    .json(new ApiResponse(200, "Tradie profile fetched", tradie));
};
