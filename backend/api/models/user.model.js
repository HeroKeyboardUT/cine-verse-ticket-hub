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
    if (rows.length === 0) {
      throw new Error(`Không tìm thấy khách hàng với ID ${id}`);
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
  }

  async getCustomerOrders(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        OrderID, 
        OrderDate, 
        Status, 
        TotalPrice, 
        PaymentMethod, 
        isTicket, 
        isFood 
      FROM \`ORDERS\`
      WHERE CustomerID = ?
    `,
      [id]
    );
    return rows.map((order) => {
      let orderTime = null;
      if (order.Date && order.Time) {
        const dateTimeString = `${order.Date} ${order.Time}`;
        const parsedDate = new Date(dateTimeString);
        if (!isNaN(parsedDate.getTime())) {
          orderTime = parsedDate.toISOString();
        }
      }
      return {
        ...order,
        orderTime,
      };
    });
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
