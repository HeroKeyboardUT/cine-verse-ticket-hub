import pool from "../../config/database.js";

class ReportModel {
    async getStatisticReport() {
        const sql = `
        CALL GetCinemaStatistics(@tRevenue, @tTickets, @tMovies);
        SELECT 
        @tRevenue AS TotalRevenue,
        @tTickets AS TotalTicket, 
        @tMovies AS TotalMovie;
        `;
        const [rows] = await pool.query(sql);
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
        CALL TopCustomer(?);
        `;
        const [rows] = await pool.query(sql, [limit_count]);
        return rows[0];
    }
};

export default new ReportModel();