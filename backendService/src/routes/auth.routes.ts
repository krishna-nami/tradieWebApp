import { Router } from "express";
import {
  changePassword,
  forgetPassword,
  login,
  logout,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

import { authLimiter } from "../middleware/rateLimitter.middleware.js";
const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", authLimiter, login);
authRoutes.get("/verify-email/:token", verifyEmail);
authRoutes.post("/resent-verification", authLimiter, resendVerification);
authRoutes.post("/logout", logout);

//this is. for forget-password no auth
authRoutes.post("/forget-password", authLimiter, forgetPassword);
authRoutes.post("/reset-password", authLimiter, resetPassword);

// ///////// These are protected Routes /////////////////

//this is for change passoword //must be protected routes
authRoutes.post("/change-password", requireAuth, authLimiter, changePassword);

export default authRoutes;
