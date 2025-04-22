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
      IF(SS.SeatNumber IS NULL, 'available', 'occupied') AS status,
      
      -- Tính giá dựa trên loại ghế và định dạng suất chiếu
      ROUND(
          CASE 
              WHEN S.SeatType = 'standard' THEN 90000
              WHEN S.SeatType = 'vip' THEN 120000
              ELSE 100000  -- fallback
          END 
          * 
          CASE 
              WHEN ST.Format IN ('4DX', 'IMAX') THEN 1.5
              ELSE 1
          END
      , 0) AS Price

      FROM SEAT S
      JOIN SHOWTIME ST ON S.CinemaID = ST.CinemaID AND S.RoomNumber = ST.RoomNumber
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
