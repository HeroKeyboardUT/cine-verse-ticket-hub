
import foodController from '../controllers/food.controller.js';
import express from 'express';

const foodRoute = express.Router();

foodRoute.get('/:id', foodController.getFoodById);
foodRoute.get('/', foodController.getList);
foodRoute.post('/', foodController.createFood);
foodRoute.put('/:id', foodController.updateFood);


export default foodRoute;
