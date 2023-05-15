import { Router } from "express";
import { createGame, deleteGame, editGameById, getGameById, getAllGames } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/games.schema.js";

const gamesRouter = Router();

gamesRouter.get("/games", getAllGames);
gamesRouter.get("/games/:id", getGameById);
gamesRouter.post("/games", validateSchema(gameSchema), createGame);
gamesRouter.delete("/games/:id", deleteGame);
gamesRouter.put("/games/:id", validateSchema(gameSchema), editGameById);

export default gamesRouter;