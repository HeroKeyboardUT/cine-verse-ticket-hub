import FoodModel from "../models/food.model.js";

class FoodController {
  async getAllFood(req, res) {
    try {
      const food = await FoodModel.getAllFood();
      res.status(200).json(food);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving food", error: error.message });
    }
  }

  async getPopcornItems(req, res) {
    try {
      const popcornItems = await FoodModel.getPopcornItems();
      res.status(200).json(popcornItems);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving popcorn items",
        error: error.message,
      });
    }
  }

  async getDrinkItems(req, res) {
    try {
      const drinkItems = await FoodModel.getDrinkItems();
      res.status(200).json(drinkItems);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving drink items",
        error: error.message,
      });
    }
  }
  async getOtherItems(req, res) {
    try {
      const otherItems = await FoodModel.getOtherItems();
      res.status(200).json(otherItems);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving other items",
        error: error.message,
      });
    }
  }

  async getFoodById(req, res) {
    try {
      const foodId = req.params.id;
      const food = FoodModel.getFoodById(foodId);
      if (!food) {
        return res.status(404).json({ message: "Food not found" });
      }
      res.status(200).json(food);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving food", error });
    }
  }
  createFood(req, res) {}
  updateFood(req, res) {}
}
export default new FoodController();
