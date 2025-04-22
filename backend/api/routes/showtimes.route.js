import showtimeController from "../controllers/showtime.controller.js";
import express from "express";

const showtimeRoute = express.Router();

// GET API
showtimeRoute.get("/:id", showtimeController.getShowtimeById);

// Create API

// PUT API
showtimeRoute.put("/:id", showtimeController.updateShowtime);

// DELETE API
showtimeRoute.delete("/:id", showtimeController.deleteShowtime);
showtimeRoute.post("/", showtimeController.createShowtime);
showtimeRoute.get("/", showtimeController.getAllShowtimes);

export default showtimeRoute;
