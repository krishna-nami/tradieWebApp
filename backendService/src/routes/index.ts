import { Router } from "express";
import authRoutes from "./auth.routes.js";
import tradieRoutes from "./tradie.routes.js";
import userRoutes from "./user.routes.js";
import jobRoutes from "./job.route.js";
import bookingRoutes from "./booking.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tradies", tradieRoutes);
router.use("/booking", bookingRoutes);
router.use("/job", jobRoutes);
export default router;
