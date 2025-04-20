
const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/movieController');

// GET all movies
router.get('/', movieController.getAllMovies);

// GET movie by ID
router.get('/:id', movieController.getMovieById);

// GET showtimes for movies
router.get('/showtimes', movieController.getShowtimes);

// POST create new movie
router.post('/', movieController.createMovie);

// PUT update movie
router.put('/:id', movieController.updateMovie);

// DELETE movie
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
