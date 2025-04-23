import pool from "../../config/database.js";

class ManagerModel {
  async getMangerByUserName(un) {
    const [rows] = await pool.query(
      `
      SELECT * FROM MANAGER WHERE Username = ?
    `,
      [un]
    );
    return rows[0];
  }
};

export default new ManagerModel();