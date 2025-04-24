import pool from "../../config/database.js";

class VoucherModel {
  async getAllVouchers() {
    const [rows] = await pool.query(`SELECT * FROM VOUCHER`);
    return rows;
  }

  async getVoucherByCode(code) {
    const [rows] = await pool.query(`SELECT * FROM VOUCHER WHERE Code = ?`, [
      code,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  async getVoucherById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM VOUCHER WHERE VoucherID = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

export default new VoucherModel();
