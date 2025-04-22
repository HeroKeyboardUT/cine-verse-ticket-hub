import MoviesModel from "../models/movies.model.js";

class MoviesController {
  async getAllMovies(req, res) {
    try {
      const movies = await MoviesModel.getAllMovies();
      res.status(200).json(movies);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving movies", error: error.message });
    }
  }

  async getShowingList(req, res) {
    const movies = await MoviesModel.getAllMovies();
    try {
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving movies" });
    }
  }

  async getMovieById(req, res) {
    try {
      const movie = await MoviesModel.getMovieById(req.params.id);
      if (!movie) return res.status(404).json({ message: "Movie not found" });
      res.status(200).json(movie);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving movie", error: error.message });
    }
  }

  async getMovieShowtimes(req, res) {
    try {
      const showtimes = await MoviesModel.getMovieShowtime(req.params.id);
      if (!showtimes)
        return res.status(404).json({ message: "Showtimes not found" });
      res.status(200).json(showtimes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving showtimes", error: error.message });
    }
  }

  async createMovie(req, res) {
    try {
      await MoviesModel.createMovie(req.body);
      res.status(201).json({ message: "Movie created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating movie", error: error.message });
    }
  }

  async updateMovie(req, res) {
    try {
      await MoviesModel.updateMovie(req.params.id, req.body);
      res.status(200).json({ message: "Movie updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating movie", error: error.message });
    }
  }

  getMovieRating(req, res) {}
  postMovieRating(req, res) {}

  async deleteMovie(req, res) {
    try {
      await MoviesModel.deleteMovie(req.params.id);
      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting movie", error: error.message });
    }
  }
}

export default new MoviesController();
