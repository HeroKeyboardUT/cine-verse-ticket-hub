import ordersModel from "../models/orders.model.js";
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

  async createOrder(req, res) {
    const { showtimeId, movieId, seatNumbers, foodItems, voucherId, paymentMethod } = req.body;
    const { CustomerID } = req.user;
  
    try {
      // 1. Tạo đơn hàng chính
      const order = await ordersModel.createOrder({
        customerId: CustomerID,
        paymentMethod,
        voucherId,
      });
      const orderID = order.OrderID;
      // 2. Thêm món ăn nếu có
      if (Array.isArray(foodItems) && foodItems.length > 0) {
        const foodPromises = foodItems.map(foodItem =>
          ordersModel.createFoodOrder({
            orderId: orderID,
            foodId: foodItem.itemId,
            quantity: foodItem.quantity,
          })
        );
        await Promise.all(foodPromises);
      }
  
      // 3. Thêm vé nếu có
      if (Array.isArray(seatNumbers) && seatNumbers.length > 0) {
        const ticketPromises = seatNumbers.map(seatNumber =>
          ordersModel.createTicketOrder({
            orderId: orderID,
            showtimeId,
            movieId,
            seatNumber,
          })
        );
        await Promise.all(ticketPromises);
      }
  
      // 4. Trả về orderId nếu tất cả thành công
      res.status(201).json({ orderId: orderID });
  
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        message: "Failed to create full order",
        error: error.message,
      });
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
