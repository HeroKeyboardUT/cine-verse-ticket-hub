
import pool from "../../config/database.js";

class OrderModel {
  async getAllOrders() {
    const [rows] = await pool.query("SELECT * FROM ORDERS");
    return rows;
  }

  async getOrderById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM ORDERS WHERE OrderID = ?",
      [id]
    );
    return rows[0];
  }

  async getOrdersByCustomerId(customerId) {
    const [rows] = await pool.query(
      "SELECT * FROM ORDERS WHERE CustomerID = ?",
      [customerId]
    );
    return rows;
  }

  async createOrder(order) {
    const { OrderID, PaymentMethod, TotalPrice, VoucherID, CustomerID, isTicket, isFood } = order;
    await pool.query(
      "INSERT INTO ORDERS (OrderID, PaymentMethod, TotalPrice, VoucherID, CustomerID, isTicket, isFood) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [OrderID, PaymentMethod, TotalPrice, VoucherID, CustomerID, isTicket, isFood]
    );
    return { OrderID };
  }

  async updateOrder(id, order) {
    const { Status, PaymentMethod, TotalPrice, VoucherID } = order;
    await pool.query(
      "UPDATE ORDERS SET Status = ?, PaymentMethod = ?, TotalPrice = ?, VoucherID = ? WHERE OrderID = ?",
      [Status, PaymentMethod, TotalPrice, VoucherID, id]
    );
  }

  async deleteOrder(id) {
    // Delete related food order entries
    await pool.query("DELETE FROM FOOD_DRINK_ORDER WHERE OrderID = ?", [id]);
    // Delete related showtime seat entries
    await pool.query("DELETE FROM SHOWTIME_SEAT WHERE OrderID = ?", [id]);
    // Delete the order
    await pool.query("DELETE FROM ORDERS WHERE OrderID = ?", [id]);
  }
}

export default new OrderModel();
