import cinemaController from "../controllers/cinema.controller.js";
import express from "express";

const cinemaRoute = express.Router();

// GET API
cinemaRoute.get("/", cinemaController.getAllCinemas);
cinemaRoute.get("/:id", cinemaController.getCinemaById);

// Create API
cinemaRoute.post("/", cinemaController.createCinema);

// PUT API
cinemaRoute.put("/:id", cinemaController.updateCinema);

// DELETE API
cinemaRoute.delete("/:id", cinemaController.deleteCinema);

export default cinemaRoute;
