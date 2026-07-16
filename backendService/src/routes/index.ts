import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users");
router.use("/tradies");
export default router;
