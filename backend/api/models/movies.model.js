import pool from "../../config/database.js";

class MoviesModel {
  async getAllMovies() {
    const [rows] = await pool.query(`
      SELECT 
        m.*, 
        GROUP_CONCAT(mg.Genre) AS Genres
      FROM MOVIE m
      LEFT JOIN MOVIE_GENRE mg ON m.MovieID = mg.MovieID
      GROUP BY m.MovieID
    `);
    return rows;
  }

  async getMovieById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        m.*, 
        GROUP_CONCAT(mg.Genre) AS Genres
      FROM MOVIE m
      LEFT JOIN MOVIE_GENRE mg ON m.MovieID = mg.MovieID
      WHERE m.MovieID = ?
      GROUP BY m.MovieID
    `,
      [id]
    );
    return rows[0];
  }

  async getMovieShowtime(id) {
    const results = await pool.query(
      `
      SELECT
        m.MovieID,
        m.Title,
        s.ShowTimeID,
        s.StartTime,
        s.EndTime,
        s.CinemaID,
        s.Duration
      FROM MOVIE m
      JOIN SHOWTIME s ON m.MovieID = s.MovieID
      WHERE m.MovieID = ?
    `,
      [id]
    );
    return results[0];
  }

  async createMovie(movie) {
    const {
      Title,
      ReleaseDate,
      Duration,
      Language,
      Description,
      PosterURL,
      AgeRating,
      Studio,
      Country,
      Director,
      CustomerRating,
      isShow,
      Genres,
    } = movie;
    await pool.query(
      `
      INSERT INTO MOVIE (
          Title, ReleaseDate, Duration, Language, Description, 
          PosterURL, AgeRating, Studio, Country, Director, isShow
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        Title,
        ReleaseDate,
        Duration,
        Language,
        Description,
        PosterURL,
        AgeRating,
        Studio,
        Country,
        Director,
        CustomerRating,
        isShow,
      ]
    );

    // Then retrieve the new ID
    const [newMovieRow] = await pool.query(
      "SELECT MovieID FROM MOVIE WHERE Title = ? ORDER BY MovieID DESC LIMIT 1",
      [Title]
    );

    const newMovieId = newMovieRow[0].MovieID;

    // Add genres if provided
    if (Genres && newMovieId) {
      const genres =
        typeof Genres === "string"
          ? Genres.split(",").map((g) => g.trim())
          : Genres;

      for (const genre of genres) {
        if (genre) {
          await pool.query(
            `INSERT INTO MOVIE_GENRE (MovieID, Genre) VALUES (?, ?)`,
            [newMovieId, genre]
          );
        }
      }
    }

    return newMovieId;
  }

  async updateMovie(id, movie) {
    const {
      Title,
      ReleaseDate,
      Duration,
      Language,
      Description,
      PosterURL,
      AgeRating,
      Studio,
      Country,
      Director,
      CustomerRating,
      Genres,
    } = movie;
    await pool.query(
      `
      UPDATE MOVIE
      SET Title = ?, ReleaseDate = ?, Duration = ?, Language = ?, Description = ?, PosterURL = ?, AgeRating = ?, Studio = ?, Country = ?, Director = ?, CustomerRating = ?
      WHERE MovieID = ?
    `,
      [
        Title,
        ReleaseDate,
        Duration,
        Language,
        Description,
        PosterURL,
        AgeRating,
        Studio,
        Country,
        Director,
        CustomerRating,
        id,
      ]
    );

    await pool.query("DELETE FROM MOVIE_GENRE WHERE MovieID = ?", [id]);
    if (Genres) {
      const genres = Genres.split(",").map((g) => g.trim());
      for (const genre of genres) {
        await pool.query(
          `
          INSERT INTO MOVIE_GENRE (MovieID, Genre) VALUES (?, ?)
        `,
          [id, genre]
        );
      }
    }
  }

  async deleteMovie(id) {
    // Delete related showtimes if any
    await pool.query("DELETE FROM SHOWTIME WHERE MovieID = ?", [id]);

    // Delete from MOVIE_GENRE
    await pool.query("DELETE FROM MOVIE_GENRE WHERE MovieID = ?", [id]);

    // Delete from MOVIE table
    const [result] = await pool.query("DELETE FROM MOVIE WHERE MovieID = ?", [
      id,
    ]);

    return result.affectedRows > 0;
  }
}

export default new MoviesModel();
