import { Request, Response } from "express";

import { validateRequest } from "../utils/validateRequest.js";
import {
  CreateJobInput,
  createJobSchema,
} from "../validators/job.validator.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as jobService from "../services/job.service.js";

export const createJobController = async (req: Request, res: Response) => {
  const customerId = req.user.id;

  const data: CreateJobInput = validateRequest(createJobSchema, req.body);

  const job = await jobService.createJobService(data, customerId);

  return res.status(201).json(new ApiResponse(201, "job Created", job));
};
