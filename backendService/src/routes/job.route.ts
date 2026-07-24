import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { createJobController } from "../controllers/job.controller.js";
const jobRoutes = Router();

jobRoutes.post(
  "/createJob",
  requireAuth,
  requireRole("CUSTOMER"),
  createJobController,
);
export default jobRoutes;
