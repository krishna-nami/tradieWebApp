import { Router } from "express";
import {
  login,
  logout,
  register,
  resendVerification,
  verifyEmail,
} from "../controllers/auth.controllers.js";
const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/verify-email/:token", verifyEmail);
authRoutes.post("/resent-verification", resendVerification);
authRoutes.post("/logout", logout);

export default authRoutes;
