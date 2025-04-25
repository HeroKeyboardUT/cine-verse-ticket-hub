import pool from "../../config/database.js";

class OrdersModel {
  async getAllOrders() {
    const [rows] = await pool.query(`SELECT * FROM ORDERS`);
    return rows;
  }

  async getOrderById(id) {
    const [rows] = await pool.query(
      `
      SELECT * FROM ORDERS WHERE OrderID = ?
      `,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createOrder(orderData) {
    // Basic order creation
    const { customerId, paymentMethod, voucherId } = orderData;

    const [result] = await pool.query(
      `INSERT INTO ORDERS (CustomerID, PaymentMethod, VoucherID, Status) 
       VALUES (?, ?, ?, 'Processing')`,
      [customerId, paymentMethod, voucherId || null]
    );

    // Dùng SELECT để lấy lại OrderID đã tạo
    const [orderRows] = await pool.query(
      `SELECT * FROM ORDERS WHERE OrderID = (SELECT CONCAT('ORD', LPAD(Counter, 3, '0')) FROM ID_COUNTER WHERE Prefix = 'ORD')`
    );

    return orderRows[0];
  }

  async createFoodOrder(orderData) {
    const { orderId, foodId, quantity } = orderData;

    await pool.query(
      `INSERT INTO FOOD_DRINK_ORDER (OrderID, ItemID, Quantity) 
       VALUES (?, ?, ?)`,
      [orderId, foodId, quantity]
    );
  }

  async createTicketOrder(orderData) {
    const { orderId, showtimeId, seatNumber } = orderData;

    await pool.query(
      `
      UPDATE SHOWTIME_SEAT 
      SET OrderID = ?
      WHERE ShowtimeID = ? AND SeatNumber = ? AND OrderID IS NULL 
      `,
      [orderId, showtimeId, seatNumber]
    );
  }

  async updateOrder(id, orderData) {
    const { status, totalPrice } = orderData;

    if (status) {
      await pool.query(`UPDATE ORDERS SET Status = ? WHERE OrderID = ?`, [
        status,
        id,
      ]);
    }

    if (totalPrice) {
      await pool.query(`UPDATE ORDERS SET TotalPrice = ? WHERE OrderID = ?`, [
        totalPrice,
        id,
      ]);
    }
  }

  async deleteOrder(id) {
    await pool.query(`DELETE FROM ORDERS WHERE OrderID = ?`, [id]);
  }

  async getFoodByOrderId(orderId) {
    const [rows] = await pool.query(
      `SELECT * FROM FOOD_DRINK_ORDER WHERE OrderID = ?`,
      [orderId]
    );
    return rows;
  }

  async getTicketByOrderId(orderId) {
    const [rows] = await pool.query(
      `SELECT * FROM SHOWTIME_SEAT WHERE OrderID = ?`,
      [orderId]
    );
    return rows;
  }
  
  async updateOrderStatus(orderId, status) {
    await pool.query(
      `UPDATE ORDERS SET Status = ? WHERE OrderID = ?`,
      [status, orderId]
    );
  }
}

export default new OrdersModel();
