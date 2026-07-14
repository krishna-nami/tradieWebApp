import rateLimit from "express-rate-limit";
("express-rate-limit");

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many attempts, please try again later",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
