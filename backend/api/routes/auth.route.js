import authController from '../controllers/auth.controller.js';
import express from 'express';

route = express.Router();

route.post('/register', authController.register);
route.post('/login', authController.login);
route.post('/password/otp', authController.otpRequest);
route.post('/password/reset', authController.resetPassword);


export default route;