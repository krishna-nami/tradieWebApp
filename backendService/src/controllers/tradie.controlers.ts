import { Request, Response } from "express";
import {
  AddSpecialisationInput,
  addSpecialisationSchema,
  specialisationParamsSchema,
  TradieProfileInput,
  tradieProfileSchema,
  UpdateTraideProfileInput,
} from "../validators/tradie.validator.js";
import { ApiError } from "../utils/ApiError.js";
import { validateRequest } from "../utils/validateRequest.js";
import * as tradieService from "../services/tradie.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  AvailabilityInput,
  availabilitySchema,
} from "../validators/availability.validators.js";
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

export const setAvailabilityController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(401, " You are Unauthorized");
  }

  const data: AvailabilityInput = validateRequest(availabilitySchema, req.body);

  const availability = await tradieService.setAvailabilityService(data, userId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Availability updated", availability));
};

export const getAvailabilityController = async (
  req: Request,
  res: Response,
) => {
  const id = req.user.id;
  console.log("Id is ", id);
  if (!id) {
    throw new ApiError(401, "You are unauthorized");
  }
  const availability = await tradieService.getAvailabilityService(id);
  return res
    .status(200)
    .json(new ApiResponse(200, "Availability fetched", availability));
};

export const addSpecilisationController = async (
  req: Request,
  res: Response,
) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, " You are Unauthorized");
  }
  const data: AddSpecialisationInput = validateRequest(
    addSpecialisationSchema,
    req.body,
  );

  const specialisation = await tradieService.addSpecialisationService(
    data,
    user.id,
  );
  return res
    .status(201)
    .json(new ApiResponse(201, "Specialisation added", specialisation));
};

export const removeSpecialisationController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user.id;
  const { id } = validateRequest(specialisationParamsSchema, req.params);

  const result = await tradieService.removeSpecialisationService(id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, `${result.trade} Specialisation removed`, result),
    );
};
