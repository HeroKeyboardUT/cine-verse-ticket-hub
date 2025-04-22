
import ordersModel from "../models/orders.model.js";

class OrdersController {
  async getAllOrders(req, res) {
    try {
      const orders = await ordersModel.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await ordersModel.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const order = req.body;
      const result = await ordersModel.createOrder(order);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const id = req.params.id;
      const order = req.body;
      await ordersModel.updateOrder(id, order);
      res.json({ message: "Order updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      await ordersModel.deleteOrder(req.params.id);
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new OrdersController();
