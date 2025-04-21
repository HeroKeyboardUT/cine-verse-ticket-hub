import showtimeController from "../controllers/showtime.controller.js";
import express from "express";

const showtimeRoute = express.Router();

// GET API
showtimeRoute.get("/", showtimeController.getAllShowtimes);
showtimeRoute.get("/:id", showtimeController.getShowtimeById);

// Create API
showtimeRoute.post("/", showtimeController.createShowtime);

// PUT API
showtimeRoute.put("/:id", showtimeController.updateShowtime);

// DELETE API
showtimeRoute.delete("/:id", showtimeController.deleteShowtime);

export default showtimeRoute;
