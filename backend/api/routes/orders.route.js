import ordersController from "../controllers/orders.controller.js";
import express from "express";

const orderRoute = express.Router();

// GET API
orderRoute.get("/", ordersController.getAllOrders);
orderRoute.get("/:id", ordersController.getOrderById);

// POST API
orderRoute.post("/", ordersController.createOrder);
orderRoute.post("/ticket", ordersController.createTicketOrder);

// PUT API
orderRoute.put("/:id", ordersController.updateOrder);

// DELETE API
orderRoute.delete("/:id", ordersController.deleteOrder);

export default orderRoute;
