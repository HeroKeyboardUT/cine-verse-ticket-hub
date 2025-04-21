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
    const { name, openingHours, closingHours, location, phoneNumbers } = cinema;
    try {
      const [result] = await pool.query(
        `INSERT INTO CINEMA (Name, OpeningHours, ClosingHours, Location) 
          VALUES (?, ?, ?, ?)`,
        [name, openingHours, closingHours, location]
      );
      const cinemaId = result.insertId;
      if (phoneNumbers && Array.isArray(phoneNumbers) && phoneNumbers.length > 0) {
        for (const phone of phoneNumbers) {
          await pool.query(
            "INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES (?, ?)",
            [phone, cinemaId]
          );
        }
      }
    } catch (error) {
      throw new Error(`Không thể tạo rạp chiếu phim: ${error.message}`);
    }
  }

  async updateCinema(id, cinema) {
    const { name, openingHours, closingHours, location, phoneNumbers } = cinema;
    try{
      await pool.query(
        `UPDATE CINEMA 
          SET Name = ?, OpeningHours = ?, ClosingHours = ?, Location = ? 
          WHERE CinemaID = ?`,
        [name, openingHours, closingHours, location, id]
      );

      await pool.query("DELETE FROM CINEMA_PHONE WHERE CinemaID = ?", [id]);
      if (phoneNumbers && Array.isArray(phoneNumbers) && phoneNumbers.length > 0) {
        for (const phone of phoneNumbers) {
          await pool.query(
            "INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES (?, ?)",
            [phone, id]
          );
        }
      }
    }
    catch (error) {
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
