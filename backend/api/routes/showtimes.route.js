import showtimesController from '../controllers/showtimes.controller.js';
import express from 'express';

route = express.Router();

route.get('/:cinemaId/:roomNum/:startTime/seats', showtimesController.getSeat);
route.post('/', showtimesController.createShowtime);

export default route;