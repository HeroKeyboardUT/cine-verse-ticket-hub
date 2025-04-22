import moviesController from "../controllers/movies.controller.js";
import express from "express";

const moviesRoute = express.Router();

// GET API
moviesRoute.get("/now-showing", moviesController.getShowingList);
moviesRoute.get("/:id/ratings", moviesController.getMovieRating);

moviesRoute.get("/:id/showtimes", moviesController.getMovieShowtimes);
moviesRoute.get("/:id", moviesController.getMovieById);

// Create API
moviesRoute.post("/create", moviesController.createMovie);
moviesRoute.post("/:id/ratings", moviesController.postMovieRating);

// PUT API
moviesRoute.put("/update", moviesController.updateMovie);

// DELETE API
moviesRoute.delete("/:id", moviesController.deleteMovie);
moviesRoute.get("/", moviesController.getAllMovies);

export default moviesRoute;
