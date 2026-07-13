import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

interface AccessTokenPayload {
  userId: string;
  role: string;
}
interface RefreshTokenPayload {
  userId: string;
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new ApiError(400, "Token is empty");
  }
  return (
    jwt.sign(payload, ACCESS_TOKEN_SECRET),
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};
export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  if (!REFRESH_TOKEN_SECRET) {
    throw new ApiError(400, "RefreshToken is Empty");
  }
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};
// ─── VERIFY tokens ─────────────────────────────────────────────────

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new ApiError(400, "Token is empty");
  }

  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  if (!REFRESH_TOKEN_SECRET) {
    throw new ApiError(400, "Token is empty");
  }
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
};
