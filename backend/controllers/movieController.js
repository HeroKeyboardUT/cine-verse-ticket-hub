
const db = require('../config/database');

// Helper function to handle database errors
const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// Get all movies
exports.getAllMovies = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        m.*, 
        GROUP_CONCAT(mg.Genre) AS Genres
      FROM MOVIE m
      LEFT JOIN MOVIE_GENRE mg ON m.MovieID = mg.MovieID
      GROUP BY m.MovieID
    `;
    
    const movies = await queryAsync(query);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// Get movie by ID
exports.getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        m.*, 
        GROUP_CONCAT(mg.Genre) AS Genres
      FROM MOVIE m
      LEFT JOIN MOVIE_GENRE mg ON m.MovieID = mg.MovieID
      WHERE m.MovieID = ?
      GROUP BY m.MovieID
    `;
    
    const results = await queryAsync(query, [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Movie not found" 
      });
    }
    
    res.status(200).json(results[0]);
  } catch (error) {
    next(error);
  }
};

// Create a new movie
exports.createMovie = async (req, res, next) => {
  try {
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
      Genres
    } = req.body;

    // Validate required fields
    if (!MovieID || !Title || !Duration || !ReleaseDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: MovieID, Title, Duration, ReleaseDate"
      });
    }

    // Insert movie
    const movieQuery = `
      INSERT INTO MOVIE
      (MovieID, Title, ReleaseDate, Duration, Language, Description, PosterURL, AgeRating, Studio, Country, Director, CustomerRating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await queryAsync(
      movieQuery,
      [
        MovieID,
        Title,
        ReleaseDate,
        Duration,
        Language || null,
        Description || null,
        PosterURL || null,
        AgeRating || null,
        Studio || null,
        Country || null,
        Director || null,
        CustomerRating || 0
      ]
    );

    // Handle genres if provided
    if (Genres && typeof Genres === "string" && Genres.trim()) {
      const genresArray = [...new Set(Genres.split(",").map(g => g.trim()))];
      
      for (const genre of genresArray) {
        await queryAsync(
          "INSERT INTO MOVIE_GENRE (Genre, MovieID) VALUES (?, ?)",
          [genre, MovieID]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      movie: {
        MovieID,
        Title,
        ReleaseDate,
        Duration,
        Genres: Genres || ""
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a movie
exports.updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
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
      Genres
    } = req.body;

    // Validate required fields
    if (!Title || !Duration || !ReleaseDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: Title, Duration, ReleaseDate"
      });
    }

    // Update movie
    const movieQuery = `
      UPDATE MOVIE
      SET Title = ?, ReleaseDate = ?, Duration = ?, Language = ?, 
          Description = ?, PosterURL = ?, AgeRating = ?, Studio = ?, 
          Country = ?, Director = ?, CustomerRating = ?
      WHERE MovieID = ?
    `;

    const result = await queryAsync(
      movieQuery,
      [
        Title,
        ReleaseDate,
        Duration,
        Language || null,
        Description || null,
        PosterURL || null,
        AgeRating || null,
        Studio || null,
        Country || null,
        Director || null,
        CustomerRating || 0,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    // Update genres
    // First delete all existing genres
    await queryAsync("DELETE FROM MOVIE_GENRE WHERE MovieID = ?", [id]);

    // Then add new genres
    if (Genres && typeof Genres === "string" && Genres.trim()) {
      const genresArray = [...new Set(Genres.split(",").map(g => g.trim()))];
      
      for (const genre of genresArray) {
        await queryAsync(
          "INSERT INTO MOVIE_GENRE (Genre, MovieID) VALUES (?, ?)",
          [genre, id]
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie: {
        MovieID: id,
        Title,
        ReleaseDate,
        Duration,
        Genres: Genres || ""
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a movie
exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete genres first (foreign key constraint)
    await queryAsync("DELETE FROM MOVIE_GENRE WHERE MovieID = ?", [id]);

    // Delete movie
    const result = await queryAsync("DELETE FROM MOVIE WHERE MovieID = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get showtimes for a movie
exports.getShowtimes = async (req, res, next) => {
  try {
    const { movieId } = req.query;
    
    let query = "SELECT * FROM SHOWTIME";
    const params = [];
    
    if (movieId) {
      query += " WHERE MovieID = ?";
      params.push(movieId);
    }
    
    const showtimes = await queryAsync(query, params);
    res.status(200).json(showtimes);
  } catch (error) {
    next(error);
  }
};
