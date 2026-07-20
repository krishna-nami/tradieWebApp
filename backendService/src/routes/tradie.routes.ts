import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  getTradieByIdController,
  traideProfileConroller,
  updateProfileController,
} from "../controllers/tradie.controlers.js";

const tradieRoutes = Router();

//public Routes
tradieRoutes.get("/:id", getTradieByIdController);

//Protected Routes
tradieRoutes.post(
  "/profile",
  requireAuth,
  requireRole("TRADIE"),
  traideProfileConroller,
);

tradieRoutes.put(
  "/profile",
  requireAuth,
  requireRole("TRADIE"),
  updateProfileController,
);
// tradieRoutes.post("/specilisations");
// tradieRoutes.delete("/specilisation/:id");
// tradieRoutes.post("/documents");

export default tradieRoutes;
