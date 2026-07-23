import { Request, Response } from "express";
import {
  CreateBookingInput,
  createBookingSchema,
} from "../validators/booking.validator.js";
import { validateRequest } from "../utils/validateRequest.js";
import * as bookingService from "../services/booking.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createBookingController = async (req: Request, res: Response) => {
  const customerId = req.user.id;

  const data: CreateBookingInput = validateRequest(
    createBookingSchema,
    req.body,
  );

  const booking = await bookingService.createbookingService(data, customerId);

  return res.status(201).json(new ApiResponse(201, "Booking Created", booking));
};
