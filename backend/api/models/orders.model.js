import pool from "../../config/database.js";

class OrdersModel {
  async getAllOrders() {
    const [rows] = await pool.query(`SELECT * FROM ORDERS`);
    return rows;
  }

  async getOrderById(id) {
    const [rows] = await pool.query(`SELECT * FROM ORDERS WHERE OrderID = ?`, [
      id,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  async createTicketOrder(orderData) {
    const {
      customerId,
      showtimeId,
      seatNumbers,
      foodItems,
      voucherId,
      paymentMethod,
    } = orderData;

    // Use transaction to ensure data integrity
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Create the order record
      const [orderResult] = await connection.query(
        `INSERT INTO ORDERS (CustomerID, PaymentMethod, VoucherID, isTicket, Status) 
         VALUES (?, ?, ?, TRUE, 'Completed')`,
        [customerId, paymentMethod, voucherId || null]
      );

      const orderId = orderResult.insertId;

      // 2. Add seats to the order
      for (const seatNumber of seatNumbers) {
        await connection.query(
          `INSERT INTO SHOWTIME_SEAT (ShowTimeID, SeatNumber, OrderID, Price) 
           SELECT ?, ?, ?, 
           CASE 
             WHEN s.SeatType = 'VIP' THEN 120000 
             ELSE 90000 
           END
           FROM SEAT s
           WHERE s.SeatNumber = ?`,
          [showtimeId, seatNumber, orderId, seatNumber]
        );
      }

      // 3. Add food items if any
      let isFood = false;
      if (foodItems && foodItems.length > 0) {
        isFood = true;
        for (const item of foodItems) {
          await connection.query(
            `INSERT INTO FOOD_DRINK_ORDER (OrderID, ItemID, Quantity) 
             VALUES (?, ?, ?)`,
            [orderId, item.itemId, item.quantity]
          );
        }
      }

      // 4. Update the order to reflect it has food
      if (isFood) {
        await connection.query(
          `UPDATE ORDERS SET isFood = TRUE WHERE OrderID = ?`,
          [orderId]
        );
      }

      // 5. Apply voucher discount if any
      if (voucherId) {
        // Update voucher usage count
        await connection.query(
          `UPDATE VOUCHER SET UsedCount = UsedCount + 1 WHERE VoucherID = ?`,
          [voucherId]
        );
      }

      await connection.commit();

      // Return the created order
      const [orderRows] = await connection.query(
        `SELECT * FROM ORDERS WHERE OrderID = ?`,
        [orderId]
      );
      return orderRows[0];
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async createOrder(orderData) {
    // Basic order creation
    const { customerId, paymentMethod, voucherId } = orderData;

    const [result] = await pool.query(
      `INSERT INTO ORDERS (CustomerID, PaymentMethod, VoucherID, Status) 
       VALUES (?, ?, ?, 'Processing')`,
      [customerId, paymentMethod, voucherId || null]
    );

    return result.insertId;
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
}

export default new OrdersModel();
