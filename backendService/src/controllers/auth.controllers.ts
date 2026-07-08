import { Response, Request } from "express";
import { RegisterInput, registerSchema } from "../validators/auth.validator.js";
import { ApiError } from "../utils/ApiError.js";
import * as austhService from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse({ body: req.body });
  if (!result.success) {
    throw new ApiError(400, "Validation Failed", result.error.issues);
  }
  const data: RegisterInput = result.data.body;
  const existUser = await austhService.findUserByEmail(data.email);
  if (existUser) {
    throw new ApiError(409, "This account is Already Exist");
  }
};
export const login = (req: Request, res: Response) => {};
export const logout = (req: Request, res: Response) => {};
export const refreshToken = (req: Request, res: Response) => {};
