import pool from "../../config/database.js";

class ReportModel {
  async getStatisticReport() {
    await pool.query(`
        CALL GetCinemaStatistics(@tRevenue, @tTickets, @tMovies)
        `);
    const [rows] = await pool.query(`
            SELECT 
        @tRevenue AS TotalRevenue,
        @tTickets AS TotalTicket, 
        @tMovies AS TotalMovie;
        `);
    return rows[0];
  }
  async getMonthlyRevenueReport() {
    const sql = `
        CALL RevenueByMonth();
        `;
    const [rows] = await pool.query(sql);
    return rows[0];
  }
  async getDailyRevenueReport() {
    const sql = `
        CALL RevenueByDay();
        `;
    const [rows] = await pool.query(sql);
    return rows[0];
  }
  async getMovieRevenueReport() {
    const sql = `
        CALL RevenueByMovie();
        `;
    const [rows] = await pool.query(sql);
    return rows[0];
  }
  async getTopCustomerReport(limit_count) {
    const sql = `
        CALL TopCustomers(?);
        `;
    const [rows] = await pool.query(sql, [limit_count]);
    return rows[0];
  }
  async getLocationRevenueReport(id) {
    const sql = `
        SELECT GetRevenueByLocation(?);
        `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  }
}

export default new ReportModel();
