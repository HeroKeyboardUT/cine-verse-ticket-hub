import pool from "../../config/database.js";

class CinemaModel {
  async getAllCinemas() {
    const [rows] = await pool.query(`
      SELECT 
        c.CinemaID AS id,
        c.Name AS name,
        TIME_FORMAT(c.OpeningHours, '%H:%i') AS openingHours,
        TIME_FORMAT(c.ClosingHours, '%H:%i') AS closingHours,
        c.Location AS location,
        GROUP_CONCAT(cp.PhoneNumber) AS phoneNumbers
      FROM CINEMA c
      LEFT JOIN CINEMA_PHONE cp ON c.CinemaID = cp.CinemaID
      GROUP BY c.CinemaID
    `);
    return rows.map((cinema) => ({
      ...cinema,
      phoneNumbers: cinema.phoneNumbers
        ? cinema.phoneNumbers.split(",").map((phone) => phone.trim())
        : [],
    }));
  }

  async getCinemaById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        c.CinemaID AS id,
        c.Name AS name,
        TIME_FORMAT(c.OpeningHours, '%H:%i') AS openingHours,
        TIME_FORMAT(c.ClosingHours, '%H:%i') AS closingHours,
        c.Location AS location,
        GROUP_CONCAT(cp.PhoneNumber) AS phoneNumbers
      FROM CINEMA c
      LEFT JOIN CINEMA_PHONE cp ON c.CinemaID = cp.CinemaID
      WHERE c.CinemaID = ?
      GROUP BY c.CinemaID
    `,
      [id]
    );
    if (rows.length === 0) {
      throw new Error(`Không tìm thấy rạp chiếu phim với ID ${id}`);
    }
    const cinema = rows[0];
    return {
      ...cinema,
      phoneNumbers: cinema.phoneNumbers
        ? cinema.phoneNumbers.split(",").map((phone) => phone.trim())
        : [],
    };
  }

  async createCinema(cinema) {
    try {
      // Lấy và tăng ID
      const [[{ Counter = 0 } = {}]] = await pool.query(
        "SELECT Counter FROM ID_COUNTER WHERE Prefix = 'CIN' FOR UPDATE"
      );
      const newCounter = Counter + 1;
      const cinemaId = `CIN${String(newCounter).padStart(3, "0")}`;
      await pool.query(
        "REPLACE INTO ID_COUNTER (Prefix, Counter) VALUES ('CIN', ?)",
        [newCounter]
      );

      // Insert cinema
      await pool.query(
        `INSERT INTO CINEMA ( Name, OpeningHours, ClosingHours, Location) 
         VALUES ( ?, ?, ?, ?)`,
        [cinema.Name, cinema.OpeningHours, cinema.ClosingHours, cinema.Location]
      );

      if (
        cinema.PhoneNumbers &&
        Array.isArray(cinema.PhoneNumbers) &&
        cinema.PhoneNumbers.length > 0
      ) {
        for (const phone of cinema.PhoneNumbers) {
          await pool.query(
            "INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES (?, ?)",
            [phone, cinemaId]
          );
        }
      }
    } catch (err) {
      throw new Error(`Tạo rạp thất bại: ${err.message}`);
    }
  }

  async updateCinema(id, cinema) {
    try {
      await pool.query(
        `UPDATE CINEMA 
          SET Name = ?, OpeningHours = ?, ClosingHours = ?, Location = ? 
          WHERE CinemaID = ?`,
        [
          cinema.Name,
          cinema.OpeningHours,
          cinema.ClosingHours,
          cinema.Location,
          id,
        ]
      );
      await pool.query("DELETE FROM CINEMA_PHONE WHERE CinemaID = ?", [id]);
      if (
        cinema.PhoneNumbers &&
        Array.isArray(cinema.PhoneNumbers) &&
        cinema.PhoneNumbers.length > 0
      ) {
        for (const phone of cinema.PhoneNumbers) {
          await pool.query(
            "INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES (?, ?)",
            [phone, id]
          );
        }
      }
    } catch (error) {
      throw new Error(`Không thể cập nhật rạp chiếu phim: ${error.message}`);
    }
  }

  async deleteCinema(id) {
    try {
      await pool.query("DELETE FROM SEAT WHERE CinemaID = ?", [id]);
      await pool.query(
        `DELETE FROM SHOWTIME_SEAT
          WHERE ShowTimeID IN (
              SELECT ShowTimeID FROM SHOWTIME WHERE CinemaID = ?
          );`,
        [id]
      );
      await pool.query("DELETE FROM SHOWTIME WHERE CinemaID = ?", [id]);
      await pool.query("DELETE FROM ROOM WHERE CinemaID = ?", [id]);
      await pool.query("DELETE FROM CINEMA_PHONE WHERE CinemaID = ?", [id]);
      await pool.query("DELETE FROM CINEMA WHERE CinemaID = ?", [id]);
    } catch (error) {
      throw new Error(`Không thể xóa rạp chiếu phim: ${error.message}`);
    }
  }
}

export default new CinemaModel();
