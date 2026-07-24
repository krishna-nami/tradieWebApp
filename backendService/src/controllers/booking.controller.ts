import { Request, Response } from "express";
import {
  CreateBookingInput,
  createBookingSchema,
  ListbookingInput,
  listBookingSchema,
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

export const listbookingsController = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const role = req.user.role as "CUSTOMER" | "TRADIE";

  const filters: ListbookingInput = validateRequest(
    listBookingSchema,
    req.query,
  );
  const data = await bookingService.listbookingService(filters, userId, role);

  return res.status(200).json(new ApiResponse(200, "booking Fetched", data));
};
