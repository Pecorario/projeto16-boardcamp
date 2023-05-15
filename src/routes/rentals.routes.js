import { Router } from "express";
import { createRental, deleteRental, getRentalById, getAllRentals, returnRental } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalSchema } from "../schemas/rentals.schema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getAllRentals);
rentalsRouter.get("/rentals/:id", getRentalById);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;