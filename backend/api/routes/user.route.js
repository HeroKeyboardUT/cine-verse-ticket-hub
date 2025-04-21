import userController from "../controllers/user.controller.js";
import express from "express";

const userRoute = express.Router();

// GET API
userRoute.get("/", userController.getAllUsers);
userRoute.get("/:id", userController.getUserById);
userRoute.get("/:id/orders", userController.getUserOrders);

// Create API
userRoute.post("/", userController.createUser);

// PUT API
userRoute.put("/:id", userController.updateUser);

// DELETE API
userRoute.delete("/:id", userController.deleteUser);

export default userRoute;
