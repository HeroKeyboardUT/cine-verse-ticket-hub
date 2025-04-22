import SeatController from "../controllers/seat.controller.js";
import express from "express";

const seatRoute = express.Router();

// GET API
seatRoute.get("/:id", SeatController.getSeatById);
seatRoute.get("/showtimes/:id", SeatController.getSeatByShowTimeId);

// Create API
seatRoute.post("/", SeatController.createSeat);
seatRoute.get("/", SeatController.getAllSeats);

export default seatRoute;
