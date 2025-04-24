import FoodController from "../controllers/food.controller.js";
import express from "express";

const FoodRoute = express.Router();

// Routes for specific food types must come BEFORE the :id route
FoodRoute.get("/popcorn", FoodController.getPopcornItems);
FoodRoute.get("/drinks", FoodController.getDrinkItems);
FoodRoute.get("/others", FoodController.getOtherItems);
// Other generic routes
FoodRoute.get("/", FoodController.getAllFood);
FoodRoute.get("/:id", FoodController.getFoodById);
FoodRoute.post("/", FoodController.createFood);
FoodRoute.put("/:id", FoodController.updateFood);

export default FoodRoute;
