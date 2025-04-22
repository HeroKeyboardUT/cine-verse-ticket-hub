import pool from "../../config/database.js";

class showtimeModel {
  async getAllShowtimes() {
    const [rows] = await pool.query("SELECT * FROM SHOWTIME");
    return rows;
  }

  async getShowtimeById(movieId) {
    const [rows] = await pool.query(
      `
      SELECT 
        s.ShowTimeID,
        s.CinemaID,
        c.Name AS CinemaName,
        s.RoomNumber,
        r.Type AS RoomType,
        s.MovieID,
        m.Title AS MovieTitle,
        s.StartTime,
        s.EndTime,
        s.Duration,
        s.Format,
        s.Subtitle,
        s.Dub
      FROM SHOWTIME s
      JOIN CINEMA c ON s.CinemaID = c.CinemaID
      JOIN ROOM r ON s.CinemaID = r.CinemaID AND s.RoomNumber = r.RoomNumber
      JOIN MOVIE m ON s.MovieID = m.MovieID
      WHERE s.MovieID = ?
      `,
      [movieId]
    );
    return rows;
  }

  async createShowtime(showtime) {
    const { RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub } =
      showtime;
    await pool.query(
      "INSERT INTO SHOWTIME (RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub]
    );
  }

  async updateShowtime(id, showtime) {
    const { RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub } =
      showtime;
    await pool.query(
      "UPDATE SHOWTIME SET RoomID = ?, MovieID = ?, StartTime = ?, Duration = ?, Format = ?, Subtitle = ?, Dub = ? WHERE ShowtimeID = ?",
      [RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub, id]
    );
  }

  async deleteShowtime(id) {
    try {
      await pool.query("DELETE FROM SHOWTIME_SEAT WHERE ShowtimeID = ?", [id]);
    } catch (error) {
      throw new Error(`Không thể xóa suất chiếu: ${error.message}`);
    }
    try {
      await pool.query("DELETE FROM SHOWTIME WHERE ShowtimeID = ?", [id]);
    } catch (error) {
      throw new Error(`Không thể xóa suất chiếu: ${error.message}`);
    }
  }
}

export default new showtimeModel();
