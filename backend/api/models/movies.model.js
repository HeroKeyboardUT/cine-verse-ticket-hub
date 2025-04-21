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

  async createMovie(movie) {
    const {
      MovieID,
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
      INSERT INTO MOVIE
      (MovieID, Title, ReleaseDate, Duration, Language, Description, PosterURL, AgeRating, Studio, Country, Director, CustomerRating, isShow)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        MovieID,
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

    if (Genres) {
      const genres = Genres.split(",").map((g) => g.trim());
      for (const genre of genres) {
        await pool.query(
          `
          INSERT INTO MOVIE_GENRE (MovieID, Genre) VALUES (?, ?)
        `,
          [MovieID, genre]
        );
      }
    }
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
    await pool.query("DELETE FROM MOVIE_GENRE WHERE MovieID = ?", [id]);
    await pool.query("DELETE FROM MOVIE WHERE MovieID = ?", [id]);
  }
}

export default new MoviesModel();
