import OrdersModel from "../models/orders.model.js";
import VoucherModel from "../models/voucher.model.js";

class OrdersController {
  async getAllOrders(req, res) {
    try {
      const orders = await OrdersModel.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving orders", error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await OrdersModel.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving order", error: error.message });
    }
  }

  async createTicketOrder(req, res) {
    try {
      const {
        customerId,
        showtimeId,
        seatNumbers,
        foodItems,
        voucherId,
        paymentMethod,
      } = req.body;

      // Validate required fields
      if (
        !customerId ||
        !showtimeId ||
        !seatNumbers ||
        seatNumbers.length === 0 ||
        !paymentMethod
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate voucher if provided
      let voucherData = null;
      if (voucherId) {
        voucherData = await VoucherModel.getVoucherById(voucherId);
        if (!voucherData) {
          return res.status(400).json({ message: "Invalid voucher" });
        }

        // Additional voucher validation can be done here
      }

      // Create the order
      const order = await OrdersModel.createTicketOrder({
        customerId,
        showtimeId,
        seatNumbers,
        foodItems,
        voucherId: voucherData?.VoucherID,
        paymentMethod,
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating ticket order:", error);
      res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const newOrderId = await OrdersModel.createOrder(req.body);
      res.status(201).json({ orderId: newOrderId });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      await OrdersModel.updateOrder(req.params.id, req.body);
      res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating order", error: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      await OrdersModel.deleteOrder(req.params.id);
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting order", error: error.message });
    }
  }
}

export default new OrdersController();
