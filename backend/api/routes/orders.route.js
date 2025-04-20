import ordersController from '../controllers/orders.controller.js';
import express from 'express';

route = express.Router();

route.post('/', ordersController.createOrder);


export default route;