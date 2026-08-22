import { Router } from "express";
import {
  getMeController,
  updateUserController,
} from "../controllers/user.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const userRoutes = Router();
//these all are protected routes for requireAuth

userRoutes.get("/me", requireAuth, getMeController);
userRoutes.put("/updateMe", requireAuth, updateUserController);

export default userRoutes;
