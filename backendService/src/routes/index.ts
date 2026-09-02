import { Router } from "express";
import authRoutes from "./auth.routes.js";
import tradieRoutes from "./tradie.routes.js";
import userRoutes from "./user.routes.js";
import jobRoutes from "./job.route.js";
import bookingRoutes from "./booking.routes.js";
import quoteRoutes from "./quote.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/tradies", tradieRoutes);
router.use("/booking", bookingRoutes);
router.use("/job", jobRoutes);
router.use("/quote", quoteRoutes);
router.use("/payment", paymentRoutes);
export default router;
