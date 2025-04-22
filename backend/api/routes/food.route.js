import foodController from '../controllers/food.controller.js';
import express from 'express';
import route from './auth.route.js';

route = express.Router();

route.get('/:foodId', foodController.getFoodById);
route.put('/:foodId', foodController.updateFood);
route.get('/', foodController.getList);
route.post('/', foodController.createFood);

export default route;