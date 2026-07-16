import { Router } from "express";
import { getMeController } from "../controllers/user.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const userRouter = Router();
//these all are protected routes for requireAuth

userRouter.get("/me", requireAuth, getMeController);

export default userRouter;
