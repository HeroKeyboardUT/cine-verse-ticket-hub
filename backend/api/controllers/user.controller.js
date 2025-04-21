import CustomerModel from "../models/user.model.js";

class userController {
  async getAllUsers(req, res) {
    try {
      const users = await CustomerModel.getAllCustomers();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving users", error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await CustomerModel.getCustomerById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving user", error: error.message });
    }
  }

  async getUserOrders(req, res) {
    try {
      const orders = await CustomerModel.getCustomerOrders(req.params.id);
      if (!orders) return res.status(404).json({ message: "Orders not found" });
      res.status(200).json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving orders", error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await CustomerModel.createCustomer(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await CustomerModel.updateCustomer(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await CustomerModel.deleteCustomer(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  }
}

export default new userController();
