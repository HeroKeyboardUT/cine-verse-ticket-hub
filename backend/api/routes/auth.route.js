import authController from '../controllers/auth.controller.js';
import express from 'express';

const route = express.Router();

route.post('/register', authController.register);
route.post('/login', authController.login);
route.post('/password/reset', authController.resetPassword);
route.post('/adminlogin', authController.adminLogin);
route.post('/verifyToken', authController.verifyToken, authController.verify);

export default route;