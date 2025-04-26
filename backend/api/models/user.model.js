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
        m.PosterURL AS PosterURL,
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
    const {
      FullName,
      DateOfBirth,
      Email,
      PhoneNumber,
      MembershipLevel,
      Password,
    } = customer;
    if (!FullName || !Email) {
      throw new Error("Thiếu thông tin bắt buộc: FullName, Email");
    }
    try {
      await pool.query(
        `
        INSERT INTO CUSTOMER (FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel, Password)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          FullName,
          DateOfBirth ? new Date(DateOfBirth) : null,
          Email,
          PhoneNumber || null,
          MembershipLevel || "Standard",
          Password || null,
        ]
      );
    } catch (error) {
      throw new Error(`Không thể tạo khách hàng: ${error.message}`);
    }
  }

  // New method to get customer by email
  async getCustomerByEmail(email) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          CustomerID, 
          FullName, 
          DateOfBirth, 
          Email, 
          PhoneNumber, 
          MembershipLevel, 
          Password,
          RegistrationDate, 
          TotalSpent, 
          TotalOrders 
        FROM CUSTOMER 
        WHERE Email = ?`,
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      const customer = rows[0];
      return {
        ...customer,
        DateOfBirth: customer.DateOfBirth
          ? new Date(customer.DateOfBirth).toISOString()
          : null,
        RegistrationDate: customer.RegistrationDate
          ? new Date(customer.RegistrationDate).toISOString()
          : null,
      };
    } catch (error) {
      throw new Error(`Error retrieving customer: ${error.message}`);
    }
  }

  // New method to update password
  async updatePassword(email, password) {
    try {
      const [result] = await pool.query(
        "UPDATE CUSTOMER SET Password = ? WHERE Email = ?",
        [password, email]
      );

      if (result.affectedRows === 0) {
        throw new Error("User not found");
      }

      return true;
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }

  // New method to find customer by ID with minimal fields
  async getCustomerAuthById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          CustomerID, 
          FullName, 
          Email, 
          MembershipLevel
        FROM CUSTOMER 
        WHERE CustomerID = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      throw new Error(`Error retrieving customer: ${error.message}`);
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
