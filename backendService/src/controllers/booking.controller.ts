import { Request, Response } from "express";
import {
  acceptBookingSchema,
  CancelBookingInput,
  cancelBookingSchema,
  CreateBookingInput,
  createBookingSchema,
  DeclineBookingInput,
  declineBookingSchema,
  GetBookingInput,
  getBookingSchema,
  ListbookingInput,
  listBookingSchema,
} from "../validators/booking.validator.js";
import { validateRequest } from "../utils/validateRequest.js";
import * as bookingService from "../services/booking.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//Create a booking  by a customer
export const createBookingController = async (req: Request, res: Response) => {
  const customerId = req.user.id;

  const data: CreateBookingInput = validateRequest(
    createBookingSchema,
    req.body,
  );

  const booking = await bookingService.createbookingService(data, customerId);

  return res.status(201).json(new ApiResponse(201, "Booking Created", booking));
};

//Let all booking for a user
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

// Get A booking Controller
export const getBookingByIdController = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const role = req.user.role as "TRADIE" | "CUSTOMER";
  const data: GetBookingInput = validateRequest(getBookingSchema, req.params);

  const booking = await bookingService.getBookingByIdService(
    data.id,
    userId,
    role,
  );

  return res.status(200).json(new ApiResponse(200, "Booking Fetched", booking));
};
//accept a booking
export const acceptBookingController = async (req: Request, res: Response) => {
  const tradieId = req.user.id;

  const data: GetBookingInput = validateRequest(getBookingSchema, req.params);
  const { reason } = validateRequest(acceptBookingSchema, req.body);
  const booking = await bookingService.acceptBookingService(
    data.id,
    tradieId,
    reason,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Booking Accepted", booking));
};

//Decline a Booking
export const declineBookingController = async (req: Request, res: Response) => {
  const tradieId = req.user.id;

  const data: GetBookingInput = validateRequest(getBookingSchema, req.params);
  const reasonData: DeclineBookingInput = validateRequest(
    declineBookingSchema,
    req.body,
  );
  const booking = await bookingService.declineBookingService(
    data.id,
    tradieId,
    reasonData.declineReason,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Booking Declined Successfully", booking));
};

//cancel a Booking
export const cancelBookingController = async (req: Request, res: Response) => {
  const user = req.user;
  const data: GetBookingInput = validateRequest(getBookingSchema, req.params);
  const reason: CancelBookingInput = validateRequest(
    cancelBookingSchema,
    req.body,
  );
  const booking = await bookingService.cancelBookingService(
    data.id,
    user,
    reason.cancelReason,
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Booking Canceled Successfully with reason",
        booking,
      ),
    );
};
//Start a booking
export const startBookingController = async (req: Request, res: Response) => {
  const tradieId = req.user.id;

  const data: GetBookingInput = validateRequest(getBookingSchema, req.params);

  const booking = await bookingService.startbookingService(data.id, tradieId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Booking Started Successfully", booking));
};

export const completeBookingController = async (
  req: Request,
  res: Response,
) => {
  const tradieId = req.user.id;
  const data: GetBookingInput = validateRequest(getBookingSchema, req.params);

  const booking = await bookingService.completeBookingService(
    data.id,
    tradieId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Booking Completed Successfully", booking));
};
