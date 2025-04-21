import pool from "../../config/database.js";

class showtimeModel {
  async getAllShowtimes() {
    const [rows] = await pool.query("SELECT * FROM SHOWTIME");
    return rows;
  }

  async getShowtimeById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM SHOWTIME WHERE ShowtimeID = ?",
      [id]
    );
    return rows[0];
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
