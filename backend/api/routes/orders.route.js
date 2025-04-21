import ordersController from "../controllers/orders.controller.js";
import express from "express";

const orderRoute = express.Router();

// GET API
orderRoute.get("/", ordersController.getAllOrders);
orderRoute.get("/:id", ordersController.getOrderById);

// Create API
orderRoute.post("/", ordersController.createOrder);

// PUT API
orderRoute.put("/:id", ordersController.updateOrder);

// DELETE API
orderRoute.delete("/:id", ordersController.deleteOrder);

export default route;
