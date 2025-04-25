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
    const {
      showtimeId,
      movieId,
      seatNumbers,
      foodItems,
      voucherId,
      paymentMethod,
    } = req.body;
    const { CustomerID } = req.user;

    try {
      // 1. Tạo đơn hàng chính
      const order = await ordersModel.createOrder({
        customerId: CustomerID,
        paymentMethod,
        voucherId,
      });
      const orderID = order.OrderID;
      if (Array.isArray(foodItems) && foodItems.length > 0) {
        for (const foodItem of foodItems) {
          await ordersModel.createFoodOrder({
            orderId: orderID,
            foodId: foodItem.itemId,
            quantity: foodItem.quantity,
          });
        }
      }

      // 3. Thêm vé nếu có
      if (Array.isArray(seatNumbers) && seatNumbers.length > 0) {
        for (const seatNumber of seatNumbers) {
          await ordersModel.createTicketOrder({
            orderId: orderID,
            showtimeId,
            movieId,
            seatNumber,
          });
        }
      }

      //4. Cập nhật trạng thái order
      await ordersModel.updateOrder(orderID, {
        status: "Booked",
      });

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

  async getFoodByOrderId(req, res) {
    try {
      const foodItems = await OrdersModel.getFoodByOrderId(req.params.id);
      if (!foodItems) return res.status(404).json({ message: "Food not found" });
      res.status(200).json(foodItems);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving food items", error: error.message });
    }
  }

  async getTicketByOrderId(req, res) {  
    try {
      const tickets = await OrdersModel.getTicketByOrderId(req.params.id);
      if (!tickets) return res.status(404).json({ message: "Tickets not found" });
      res.status(200).json(tickets);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving tickets", error: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const orderId = req.params.id;
      const updatedOrder = await OrdersModel.updateOrderStatus(orderId, status);
      if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(updatedOrder);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating order status", error: error.message });
    }
  }
}

export default new OrdersController();
