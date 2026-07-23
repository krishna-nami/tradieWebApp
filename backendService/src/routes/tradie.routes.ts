import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  addSpecilisationController,
  getAvailabilityController,
  getTradieByIdController,
  removeSpecialisationController,
  searchTradiesController,
  setAvailabilityController,
  traideProfileConroller,
  updateProfileController,
} from "../controllers/tradie.controlers.js";

const tradieRoutes = Router();

//public Routes

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
///Availability
tradieRoutes.put(
  "/availability",
  requireAuth,
  requireRole("TRADIE"),
  setAvailabilityController,
);

tradieRoutes.get(
  "/availability",
  requireAuth,
  requireRole("TRADIE"),
  getAvailabilityController,
);
tradieRoutes.post(
  "/specialisations",
  requireAuth,
  requireRole("TRADIE"),
  addSpecilisationController,
);
tradieRoutes.get("/search", searchTradiesController);

//. Dynamics Routes
tradieRoutes.delete(
  "/specialisations/:id",
  requireAuth,
  requireRole("TRADIE"),
  removeSpecialisationController,
);

tradieRoutes.get("/:id", getTradieByIdController);

export default tradieRoutes;
``;
