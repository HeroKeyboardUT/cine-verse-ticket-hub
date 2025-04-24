import pool from "../../config/database.js";

class SeatModel {
  async getAllSeats() {
    const rows = await pool.query(
      `
      SELECT 
        SeatNumber, 
        ShowTimeID 
      FROM SHOWTIME_SEAT
    `
    );
    return rows;
  }

  async getSeatById(id) {}

  async getSeatByShowTimeId(showTimeId) {
    const [rows] = await pool.query(
      `
            SELECT 
          S.SeatNumber AS number,
          S.RoomNumber AS room,
          S.CinemaID AS cinema,
          S.SeatType,
          SS.Price AS Price,
          IF(SS.OrderID IS NULL, 'available', 'occupied') AS status

      FROM SEAT S
      JOIN SHOWTIME ST 
          ON S.CinemaID = ST.CinemaID AND S.RoomNumber = ST.RoomNumber
      LEFT JOIN SHOWTIME_SEAT SS 
          ON S.SeatNumber = SS.SeatNumber AND ST.ShowTimeID = SS.ShowTimeID

      WHERE ST.ShowTimeID = ?;
    `,
      [showTimeId]
    );
    return rows;
  }

  async createSeat(seat) {}
}

export default new SeatModel();
