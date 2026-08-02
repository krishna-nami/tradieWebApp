import { Request, Response } from "express";
import {
  CreateQuoteInput,
  createQuoteSchema,
  DeclineParamsInput,
  declineQuoteSchema,
  QuoteParamsInput,
  quoteParamsSchema,
  UpdateQuoteInput,
  updateQuoteSchema,
} from "../validators/quote.validator.js";
import { validateRequest } from "../utils/validateRequest.js";
import { getBookingSchema } from "../validators/booking.validator.js";
import * as quoteService from "../services/quote.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createQuoteController = async (req: Request, res: Response) => {
  const tradieId = req.user.id;
  const bookingIdData = validateRequest(getBookingSchema, req.params);

  const data: CreateQuoteInput = validateRequest(createQuoteSchema, req.body);

  const quote = await quoteService.createQuoteService(
    bookingIdData.id,
    tradieId,
    data,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Booking Completed Successfully", quote));
};

//update quote service
export const updateQuotecontroller = async (req: Request, res: Response) => {
  const tradieId = req.user.id;
  const data: UpdateQuoteInput = validateRequest(updateQuoteSchema, req.body);
  const quoteId: QuoteParamsInput = validateRequest(
    quoteParamsSchema,
    req.params,
  );

  const updatedQuote = await quoteService.updateQuoteService(
    quoteId.id,
    tradieId,
    data,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Quote Updated Successfully", updatedQuote));
};
export const sendQuoteController = async (req: Request, res: Response) => {
  const traideId = req.user.id;
  const quoteId: QuoteParamsInput = validateRequest(
    quoteParamsSchema,
    req.params,
  );

  const quote = await quoteService.sendQuoteService(quoteId.id, traideId);

  return res.status(200).json(new ApiResponse(200, " Quote sent", quote));
};

export const acceptQuoteController = async (req: Request, res: Response) => {
  const customerId = req.user.id;
  const quoteId = validateRequest(quoteParamsSchema, req.params);
  const updatedQuote = await quoteService.acceptQuoteService(
    quoteId.id,
    customerId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Quote Accepted", updatedQuote));
};
export const declineQuoteControler = async (req: Request, res: Response) => {
  const customerId = req.user.id;
  const declineData: DeclineParamsInput = validateRequest(
    declineQuoteSchema,
    req.body,
  );
  const quoteData: QuoteParamsInput = validateRequest(
    quoteParamsSchema,
    req.params,
  );

  const declineQuote = await quoteService.declineQuoteService(
    quoteData.id,
    declineData.reason,
    customerId,
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        " Quote Declined with reason Successfully",
        declineQuote,
      ),
    );
};
