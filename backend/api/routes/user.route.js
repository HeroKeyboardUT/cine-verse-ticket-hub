import userController from "../controllers/user.controller.js";
import express from "express";

const userRoute = express.Router();

// GET API
userRoute.get("/", userController.getAllUsers);
userRoute.get("/:id", userController.getUserById);
userRoute.get("/:id/orders", userController.getUserOrders);


// PUT API
userRoute.put("/:id", userController.updateUser);

// DELETE API
userRoute.delete("/:id", userController.deleteUser);
// Create API
userRoute.post("/", userController.createUser);

export default userRoute;
