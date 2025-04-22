import pool from "../../config/database.js";

class SeatModel {
  async getAllSeats() {
    const [rows] = await pool.query(`
        SELECT 
            SeatID, 
            SeatNumber, 
            RowNumber, 
            SeatType, 
            isAvailable, 
            MovieID, 
            CinemaID, 
            ShowTimeID
        FROM SEAT
        `);
    return rows;
  }

  async getSeatById(id) {
    const [rows] = await pool.query(
      `
        SELECT 
            SeatID, 
            SeatNumber, 
            RowNumber, 
            SeatType, 
            isAvailable, 
            MovieID, 
            CinemaID, 
            ShowTimeID
        FROM SEAT
        WHERE SeatID = ?
        `,
      [id]
    );
    return rows[0];
  }

  async getSeatByShowTimeId(showTimeId) {
    const [rows] = await pool.query(
      `
        SELECT 
            SeatNumber, 
            ShowTimeID
        FROM SEAT
        WHERE ShowTimeID = ?
        `,
      [showTimeId]
    );
    return rows;
  }

  async createSeat(seat) {
    const {
      SeatID,
      SeatNumber,
      RowNumber,
      SeatType,
      isAvailable,
      MovieID,
      CinemaID,
      ShowTimeID,
    } = seat;
    await pool.query(
      `
        INSERT INTO SEAT (SeatID, SeatNumber, RowNumber, SeatType, isAvailable, MovieID, CinemaID, ShowTimeID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        SeatID,
        SeatNumber,
        RowNumber,
        SeatType,
        isAvailable,
        MovieID,
        CinemaID,
        ShowTimeID,
      ]
    );
  }
}

export default SeatModel;
