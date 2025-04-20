import moviesController from '../controllers/movies.controller.js';
import express from 'express';

route = express.Router();


route.get('/now-showing', moviesController.getShowingList);

route.get('/:id/ratings', moviesController.getMovieRating);
route.post('/:id/ratings', moviesController.postMovieRating);

route.get('/:id/showtimes', moviesController.getMovieShowtimes);
route.get('/:id', moviesController.getMovieById);

export default route;