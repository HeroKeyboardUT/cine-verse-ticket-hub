import pool from "../../config/database.js";

class CustomerModel {
  async getAllCustomers() {
    const [rows] = await pool.query(`
      SELECT 
        CustomerID, 
        FullName, 
        DateOfBirth, 
        Email, 
        PhoneNumber, 
        MembershipLevel, 
        RegistrationDate, 
        TotalSpent, 
        TotalOrders 
      FROM CUSTOMER
    `);
    return rows.map((customer) => ({
      ...customer,
      DateOfBirth: customer.DateOfBirth
        ? new Date(customer.DateOfBirth).toISOString()
        : null,
      RegistrationDate: customer.RegistrationDate
        ? new Date(customer.RegistrationDate).toISOString()
        : null,
    }));
  }

  async getCustomerById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        CustomerID, 
        FullName, 
        DateOfBirth, 
        Email, 
        PhoneNumber, 
        MembershipLevel, 
        RegistrationDate, 
        TotalSpent, 
        TotalOrders 
      FROM CUSTOMER 
      WHERE CustomerID = ?
    `,
      [id]
    );
    return rows.map((customer) => ({
      ...customer,
      DateOfBirth: customer.DateOfBirth
        ? new Date(customer.DateOfBirth).toISOString()
        : null,
      RegistrationDate: customer.RegistrationDate
        ? new Date(customer.RegistrationDate).toISOString()
        : null,
    }))[0];
  }

  async getCustomerOrders(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        o.OrderID,
        o.OrderDate,
        o.Status,
        o.TotalPrice,
        o.PaymentMethod,
        o.isTicket,
        o.isFood,        
        s.SeatNumber,
        sh.StartTime,
        sh.EndTime,
        sh.Format,        
        m.Title AS MovieTitle,
        r.RoomNumber,
        r.Type AS RoomType,
        c.Name AS CinemaName,
        c.Location AS CinemaLocation
      FROM ORDERS o
      LEFT JOIN SHOWTIME_SEAT s ON o.OrderID = s.OrderID
      LEFT JOIN SHOWTIME sh ON s.ShowTimeID = sh.ShowTimeID
      LEFT JOIN MOVIE m ON sh.MovieID = m.MovieID
      LEFT JOIN ROOM r ON sh.CinemaID = r.CinemaID AND sh.RoomNumber = r.RoomNumber
      LEFT JOIN CINEMA c ON r.CinemaID = c.CinemaID
      WHERE o.CustomerID = ?
      ORDER BY o.OrderDate DESC
    `,
      [id]
    );
    return rows.map((order) => ({
      ...order,
      OrderDate: order.OrderDate
        ? new Date(order.OrderDate).toISOString()
        : null,
      StartTime: order.StartTime
        ? new Date(order.StartTime).toISOString()
        : null,
      EndTime: order.EndTime ? new Date(order.EndTime).toISOString() : null,
    }));
  }

  async createCustomer(customer) {
    const { FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel } =
      customer;
    if (!FullName || !Email) {
      throw new Error("Thiếu thông tin bắt buộc: FullName, Email");
    }
    try {
      await pool.query(
        `
        INSERT INTO CUSTOMER (FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          FullName,
          DateOfBirth ? new Date(DateOfBirth) : null,
          Email,
          PhoneNumber || null,
          MembershipLevel || "Standard",
        ]
      );
    } catch (error) {
      throw new Error(`Không thể tạo khách hàng: ${error.message}`);
    }
  }

  async updateCustomer(id, customer) {
    const { FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel } =
      customer;
    if (!FullName || !Email) {
      throw new Error("Thiếu thông tin bắt buộc: FullName, Email");
    }
    try {
      await pool.query(
        `
        UPDATE CUSTOMER 
        SET FullName = ?, DateOfBirth = ?, Email = ?, PhoneNumber = ?, MembershipLevel = ? 
        WHERE CustomerID = ?
        `,
        [
          FullName,
          DateOfBirth ? new Date(DateOfBirth) : null,
          Email,
          PhoneNumber || null,
          MembershipLevel || "Standard",
          id,
        ]
      );
    } catch (error) {
      throw new Error(`Không thể cập nhật khách hàng: ${error.message}`);
    }
  }

  async deleteCustomer(id) {
    try {
      await pool.query("DELETE FROM ORDERS WHERE CustomerID = ?", [id]);
      await pool.query(`DELETE FROM CUSTOMER WHERE CustomerID = ?`, [id]);
    } catch (error) {
      throw new Error(`Không thể xóa khách hàng: ${error.message}`);
    }
  }
}

export default new CustomerModel();
